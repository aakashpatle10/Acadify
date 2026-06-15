

import mongoose from 'mongoose';

const attendanceSessionSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassSession',
      required: true,
    },

    timetableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Timetable',
    },

    date: {
      type: String, 
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'ENDED'],
      default: 'ACTIVE',
    },

    qrRotationInterval: {
      type: Number, 
      default: 5,
    },

    presentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

attendanceSessionSchema.index(
  { classId: 1, timetableId: 1, date: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'ACTIVE' } }
);

export default mongoose.model(
  'AttendanceSession',
  attendanceSessionSchema
);
