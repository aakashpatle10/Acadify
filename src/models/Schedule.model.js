// models/Schedule.model.js
import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
        index: true
    },
    startTime: {
        type: String, // Format: "10:00"
        required: true
    },
    endTime: {
        type: String, // Format: "11:00"
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    section: {
        type: String, // e.g., "CS-A"
        required: true
    },
    roomNumber: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model('Schedule', scheduleSchema);
