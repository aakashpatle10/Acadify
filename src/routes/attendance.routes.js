// routes/attendance.routes.js
import express from 'express';
import {
    startSession,
    endSession,
    markAttendance,
    getLiveAttendance
} from '../controllers/attendance.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Teacher routes
router.post('/start-session', authMiddleware, startSession);
router.post('/end-session/:sessionId', authMiddleware, endSession);
router.get('/live/:sessionId', authMiddleware, getLiveAttendance);

// Student routes
router.post('/mark', authMiddleware, markAttendance);

export default router;
