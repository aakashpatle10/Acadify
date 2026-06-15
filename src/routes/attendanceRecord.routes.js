
import express from 'express';
import { markAttendance } from '../controllers/attendanceRecord.controller.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';
import { markAttendanceValidator } from'../middlewares/validators/attendanceRecord.validation.js';
const router = express.Router();


router.post(
  '/attendance/mark',
  authMiddleware,
  markAttendanceValidator,
  markAttendance
);

export default router;
