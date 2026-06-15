
import AttendanceSessionService from './attendanceSession.service.js';
import MongoAttendanceRecordRepository from '../repositories/implementations/MongoAttendanceRecordRepository.js';
import MongoStudentRepository from '../repositories/implementations/MongoStudentRepository.js';
import { QRSessionRepositoryImpl } from '../repositories/implementations/MongoQrSessionRepository.js';
import { verifyAttendanceToken } from '../utils/attendancetoken.js';
import {AppError} from '../utils/errors.js';

const studentRepository = new MongoStudentRepository();
const qrSessionRepository = new QRSessionRepositoryImpl();

class AttendanceRecordService {
 
  async markAttendance({ studentId, token }) {
    if (!token) {
      throw new AppError('QR token is required', 400);
    }

    const qrSession = await qrSessionRepository.findActiveByToken(token);
    if (!qrSession) {
      throw new AppError('Invalid or inactive QR session', 404);
    }

    const verifiedToken = verifyAttendanceToken(token);
    if (!verifiedToken.valid) {
      if (verifiedToken.error?.name === 'TokenExpiredError') {
        throw new AppError('QR code expired', 400);
      }

      throw new AppError('Invalid QR token', 400);
    }

    if (!qrSession.isValidNow()) {
      throw new AppError('QR code expired or inactive', 400);
    }

    if (qrSession.maxUses > 0 && qrSession.uses >= qrSession.maxUses) {
      throw new AppError('QR scan limit reached', 400);
    }

    const payload = verifiedToken.payload;
    const payloadClassId = payload.classSessionId || payload.classId;

    if (
      String(payloadClassId) !== String(qrSession.classSessionId) ||
      String(payload.timetableId) !== String(qrSession.timetableId) ||
      String(payload.teacherId) !== String(qrSession.teacherId)
    ) {
      throw new AppError('QR token does not match attendance session', 400);
    }

    const student = await studentRepository.findStudentById(studentId);
    if (!student) {
      throw new AppError('Student not found', 404);
    }

    if (String(student.classSessionId) !== String(qrSession.classSessionId)) {
      throw new AppError('Student does not belong to this class', 403);
    }

    const classId = qrSession.classSessionId;
    const timetableId = qrSession.timetableId;
    const date = new Date().toISOString().split('T')[0];

    const session = await AttendanceSessionService.getOrCreateActiveSession({
      classId,
      timetableId,
      date,
    });

    const alreadyMarked =
      await MongoAttendanceRecordRepository.findByStudentAndSession(
        studentId,
        session._id
      );

    if (alreadyMarked) {
      throw new AppError('Attendance already marked', 409);
    }

    let record;

    try {
      record = await MongoAttendanceRecordRepository.createRecord({
        studentId,
        classId,
        timetableId,
        sessionId: session._id,
        date,
        markedAt: new Date(),
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError('Attendance already marked', 409);
      }

      throw error;
    }

    await AttendanceSessionService.incrementPresentCount(session._id);
    await qrSessionRepository.incrementUses(qrSession._id);

    return record;
  }
}

export default new AttendanceRecordService();
