// models/ClassSession.model.js
import mongoose from 'mongoose';

const classSessionSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    timetableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timetable',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    activeQrToken: {
        type: String
    },
    isLive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('ClassSession', classSessionSchema);
