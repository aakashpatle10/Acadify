
import AttendanceSession from '../../models/attendanceSession.model.js';
import IAttendanceSessionRepository from '../contracts/IAttendanceSessionRepository.js';

class MongoAttendanceSessionRepository extends IAttendanceSessionRepository {
  async createSession(data) {
    return AttendanceSession.create(data);
  }

  async findActiveSessionByClassAndDate(classId, date, timetableId = null) {
    const query = {
      classId,
      date,
      status: 'ACTIVE',
    };

    if (timetableId) {
      query.timetableId = timetableId;
    }

    return AttendanceSession.findOne(query);
  }

  async findById(sessionId) {
    return AttendanceSession.findById(sessionId);
  }

  async endSession(sessionId, endTime) {
    return AttendanceSession.findByIdAndUpdate(
      sessionId,
      {
        status: 'ENDED',
        endTime,
      },
      { new: true }
    );
  }

  async incrementPresentCount(sessionId) {
    return AttendanceSession.findByIdAndUpdate(
      sessionId,
      { $inc: { presentCount: 1 } },
      { new: true }
    );
  }
}

export default new MongoAttendanceSessionRepository();
