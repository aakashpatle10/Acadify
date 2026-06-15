
import MongoAttendanceSessionRepository from '../repositories/implementations/MongoAttendanceSessionRepository.js';
import { AppError } from '../utils/errors.js';

class AttendanceSessionService {
 
  async startSession({ classId, date, timetableId = null }) {
    const activeSession =
      await MongoAttendanceSessionRepository.findActiveSessionByClassAndDate(
        classId,
        date,
        timetableId
      );

    if (activeSession) {
      throw new AppError(
        'Attendance already started for this class',
        400
      );
    }

    const session =
      await MongoAttendanceSessionRepository.createSession({
        classId,
        timetableId,
        date,
        startTime: new Date(),
        status: 'ACTIVE',
      });

    return session;
  }

  async getActiveSession(classId, date, timetableId = null) {
    const session =
      await MongoAttendanceSessionRepository.findActiveSessionByClassAndDate(
        classId,
        date,
        timetableId
      );

    if (!session) {
      throw new AppError('Attendance not started', 404);
    }

    if (session.status === 'ENDED') {
      throw new AppError('Attendance already closed', 400);
    }

    return session;
  }

  async getOrCreateActiveSession({ classId, date, timetableId }) {
    const activeSession =
      await MongoAttendanceSessionRepository.findActiveSessionByClassAndDate(
        classId,
        date,
        timetableId
      );

    if (activeSession) {
      return activeSession;
    }

    try {
      return await MongoAttendanceSessionRepository.createSession({
        classId,
        timetableId,
        date,
        startTime: new Date(),
        status: 'ACTIVE',
      });
    } catch (error) {
      if (error.code === 11000) {
        return MongoAttendanceSessionRepository.findActiveSessionByClassAndDate(
          classId,
          date,
          timetableId
        );
      }

      throw error;
    }
  }

  async incrementPresentCount(sessionId) {
    return MongoAttendanceSessionRepository.incrementPresentCount(sessionId);
  }

  async endSession(sessionId) {
    const session =
      await MongoAttendanceSessionRepository.findById(sessionId);

    if (!session) {
      throw new AppError('Invalid attendance session', 404);
    }

    if (session.status === 'ENDED') {
      throw new AppError('Attendance already closed', 400);
    }

    return MongoAttendanceSessionRepository.endSession(
      sessionId,
      new Date()
    );
  }
}

export default new AttendanceSessionService();
