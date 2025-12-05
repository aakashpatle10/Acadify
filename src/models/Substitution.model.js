// models/Substitution.model.js
import mongoose from 'mongoose';

const substitutionSchema = new mongoose.Schema({
    originalTeacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    substituteTeacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        default: 'Leave'
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

export default mongoose.model('Substitution', substitutionSchema);
