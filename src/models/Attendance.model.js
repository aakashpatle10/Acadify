// models/Attendance.model.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming 'User' is the student model based on students.model.js
        required: true,
        index: true
    },
    classSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassSession',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late'],
        default: 'Present'
    },
    scanTime: {
        type: Date,
        default: Date.now
    },
    deviceFingerprint: {
        type: String, // To prevent proxy
        select: false // Don't return by default
    },
    ipAddress: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});

// Prevent duplicate attendance for the same session
attendanceSchema.index({ studentId: 1, classSessionId: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
