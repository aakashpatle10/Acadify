// services/Qr.service.js
import QRCode from "qrcode";
import Timetable from "../models/timetable.model.js";
import Teacher from "../models/teacher.model.js";
import { QRSessionRepositoryImpl } from "../repositories/implementations/MongoQrSessionRepository.js";
import { signAttendanceToken } from "../utils/attendanceToken.js";
import { AppError } from "../utils/errors.js";

const qrSessionRepo = new QRSessionRepositoryImpl();

// default 10 seconds, env se override kar sakte ho
const DEFAULT_EXP_SECONDS = Number(
  process.env.ATTENDANCE_QR_EXP_SECONDS || 10
);

export class QRService {
  /**
   * Generate QR for a particular timetable slot
   * - teacherUserId = req.user.id (User._id)
   */
  static async generateForTimetable({
    timetableId,
    teacherUserId,
    expiresInSeconds,
  }) {
    // 1) Teacher profile lao (Teacher.userId == logged in user)
    const teacher = await Teacher.findById(teacherUserId);
    if (!teacher) {
      throw new AppError("Teacher profile not found", 404);
    }

    // 2) Timetable slot lao
    const timetable = await Timetable.findById(timetableId).populate("classId");
    if (!timetable) {
      throw new AppError("Timetable not found", 404);
    }

    // 3) Check: ye slot isi teacher ka hai ya nahi
    if (String(timetable.teacherId) !== String(teacher._id)) {
      throw new AppError("You are not assigned to this lecture", 403);
    }

    // 4) Expiry calculate karo (default 10 sec)
    const seconds = expiresInSeconds || DEFAULT_EXP_SECONDS;
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + seconds * 1000);

    // 5) Payload tayar karo
    const payload = {
      classId: String(timetable.classId),
      timetableId: String(timetable._id),
      teacherId: String(teacher._id),
    };

    // 6) JWT token sign karo (e.g. "10s")
    const token = signAttendanceToken(payload, `${seconds}s`);

    // 7) QRSession DB me save karo
    const qrSession = await qrSessionRepo.create({
      token,
      classId: timetable.classId,
      timetableId: timetable._id,
      teacherId: teacher._id,
      subject: timetable.subject,
      issuedAt,
      expiresAt,
      active: true,
    });

    // 8) Token ko QR image me convert karo
    const qrDataUri = await QRCode.toDataURL(token, {
      errorCorrectionLevel: "M",
    });

    return {
      sessionId: qrSession._id,
      qrDataUri,
      expiresAt,
      token, // optional: frontend chaahe to react-qr se render kare
    };
  }
}

