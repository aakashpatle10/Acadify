
import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassSession',
      required: true,
    },

    timetableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Timetable',
      required: true,
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceSession',
      required: true,
    },

    date: {
      type: String, 
      required: true,
    },

    markedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


attendanceRecordSchema.index(
  { studentId: 1, sessionId: 1 },
  { unique: true }
);

export default mongoose.model(
  'AttendanceRecord',
  attendanceRecordSchema
);
