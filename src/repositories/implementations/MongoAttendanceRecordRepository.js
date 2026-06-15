import AttendanceRecord from '../../models/attendanceRecord.model.js';
import IAttendanceRecordRepository from '../contracts/IAttendanceRecordRepository.js';

class MongoAttendanceRecordRepository extends IAttendanceRecordRepository {
  async createRecord(data) {
    return AttendanceRecord.create(data);
  }

  async findByStudentClassAndDate(studentId, classId, date) {
    return AttendanceRecord.findOne({
      studentId,
      classId,
      date,
    });
  }

  async findByStudentAndSession(studentId, sessionId) {
    return AttendanceRecord.findOne({
      studentId,
      sessionId,
    });
  }

  async findBySession(sessionId) {
    return AttendanceRecord.find({
      sessionId,
    });
  }
}

export default new MongoAttendanceRecordRepository();
