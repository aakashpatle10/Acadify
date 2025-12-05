// controllers/attendance.controller.js
import ClassSession from '../models/ClassSession.model.js';
import Attendance from '../models/Attendance.model.js';
import {QRService} from '../services/Qr.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Start a new class session
export const startSession = asyncHandler(async (req, res) => {
    const { subject, section } = req.body;
    const teacherId = req.user._id; // Assuming auth middleware sets req.user

    const session = await ClassSession.create({
        teacherId,
        subject,
        section,
        isLive: true
    });

    // Generate initial QR token
    const token = QRService.generateToken(session._id.toString());
    session.activeQrToken = token;
    await session.save();

    res.status(201).json({
        success: true,
        sessionId: session._id,
        token
    });
});

// End a class session
export const endSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    const session = await ClassSession.findById(sessionId);
    if (!session) {
        return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.isLive = false;
    session.endTime = new Date();
    await session.save();

    res.json({
        success: true,
        message: 'Session ended successfully'
    });
});

// Mark attendance (called by student)
export const markAttendance = asyncHandler(async (req, res) => {
    const { token, sessionId } = req.body;
    const studentId = req.user._id;

    // Validate QR token
    const isValid = QRService.validateToken(token, sessionId);
    if (!isValid) {
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired QR code'
        });
    }

    // Check if session is live
    const session = await ClassSession.findById(sessionId);
    if (!session || !session.isLive) {
        return res.status(400).json({
            success: false,
            message: 'Session is not active'
        });
    }

    // Check if already marked
    const existing = await Attendance.findOne({ studentId, classSessionId: sessionId });
    if (existing) {
        return res.status(400).json({
            success: false,
            message: 'Attendance already marked'
        });
    }

    // Get device fingerprint
    const deviceFingerprint = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Mark attendance
    const attendance = await Attendance.create({
        studentId,
        classSessionId: sessionId,
        status: 'Present',
        deviceFingerprint,
        ipAddress
    });

    // Populate student details
    await attendance.populate('studentId', 'firstName lastName enrollmentNumber');

    // Emit real-time update to teacher
    if (global.io) {
        global.io.to(sessionId).emit('attendance_update', {
            student: {
                name: `${attendance.studentId.firstName} ${attendance.studentId.lastName}`,
                enrollmentNumber: attendance.studentId.enrollmentNumber,
                scanTime: attendance.scanTime
            }
        });
    }

    res.json({
        success: true,
        message: 'Attendance marked successfully'
    });
});

// Get live attendance for a session
export const getLiveAttendance = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    const attendanceList = await Attendance.find({ classSessionId: sessionId })
        .populate('studentId', 'firstName lastName enrollmentNumber')
        .sort({ scanTime: -1 });

    res.json({
        success: true,
        count: attendanceList.length,
        data: attendanceList
    });
});
