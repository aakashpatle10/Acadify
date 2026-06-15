
export default class IAttendanceSessionRepository {
  createSession(data) {
    throw new Error('Method not implemented');
  }

  findActiveSessionByClassAndDate(classId, date, timetableId = null) {
    throw new Error('Method not implemented');
  }

  findById(sessionId) {
    throw new Error('Method not implemented');
  }

  endSession(sessionId, endTime) {
    throw new Error('Method not implemented');
  }

  incrementPresentCount(sessionId) {
    throw new Error('Method not implemented');
  }
}
