import QRCode from "qrcode";
import Timetable from "../models/timetable.model.js";
import Teacher from "../models/teacher.model.js";
import { QRSessionRepositoryImpl } from "../repositories/implementations/MongoQrSessionRepository.js";
import { signAttendanceToken } from "../utils/attendancetoken.js";
import { AppError } from "../utils/errors.js";

const qrSessionRepo = new QRSessionRepositoryImpl();

const DEFAULT_EXP_SECONDS = Number(
  process.env.ATTENDANCE_QR_EXP_SECONDS || 10
);

export class QRService {
  
  static async generateForTimetable({
    timetableId,
    teacherUserId,
    expiresInSeconds,
  }) {
    
    const teacher = await Teacher.findById(teacherUserId);
    if (!teacher) {
      throw new AppError("Teacher profile not found", 404);
    }

    
    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
      throw new AppError("Timetable not found", 404);
    }

    
    if (String(timetable.teacherId) !== String(teacher._id)) {
      throw new AppError("You are not assigned to this lecture", 403);
    }

    
    const seconds = expiresInSeconds || DEFAULT_EXP_SECONDS;
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + seconds * 1000);

    
    const payload = {
      classId: String(timetable.classSessionId),
      classSessionId: String(timetable.classSessionId),
      timetableId: String(timetable._id),
      teacherId: String(teacher._id),
    };

    
    const token = signAttendanceToken(payload, `${seconds}s`);

    
    const qrSession = await qrSessionRepo.create({
      token,
      classSessionId: timetable.classSessionId,
      timetableId: timetable._id,
      teacherId: teacher._id,
      subject: timetable.subject,
      issuedAt,
      expiresAt,
      active: true,
    });

    
    const qrDataUri = await QRCode.toDataURL(token, {
      errorCorrectionLevel: "M",
    });

    return {
      sessionId: qrSession._id,
      qrDataUri,
      expiresAt,
      token, 
    };
  }
}
