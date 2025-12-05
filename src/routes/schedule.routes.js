// routes/schedule.routes.js
import express from 'express';
import {
    generateSchedule,
    getSchedule,
    requestSubstitute,
    updateSubstitutionStatus
} from '../controllers/schedule.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Schedule routes
router.post('/generate', authMiddleware, generateSchedule); // Admin only (add role check)
router.get('/', authMiddleware, getSchedule);

// Substitution routes
router.post('/substitute/request', authMiddleware, requestSubstitute); // Teacher
router.patch('/substitute/:substitutionId', authMiddleware, updateSubstitutionStatus); // Admin

export default router;
