// routes/analytics.routes.js
import express from 'express';
import {
    getAttendanceOverview,
    getAttendanceTrends,
    getTeacherPerformance,
    getStudentEngagement,
    getClassAnalytics
} from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Analytics routes
router.get('/attendance/overview', authMiddleware, getAttendanceOverview);
router.get('/attendance/trends', authMiddleware, getAttendanceTrends);
router.get('/teacher/performance', authMiddleware, getTeacherPerformance);
router.get('/student/engagement', authMiddleware, getStudentEngagement);
router.get('/class', authMiddleware, getClassAnalytics);

export default router;
