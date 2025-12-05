// routes/teacher.routes.js
import express from 'express';
import teacherController from '../controllers/teacher.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { loginValidator, createTeacherValidator } from '../middlewares/validators/teacher.validator.js';

const router = express.Router();

// Public routes
router.post('/login', loginValidator, teacherController.login);

// Protected routes (Teacher Profile)
router.get('/profile', authMiddleware, teacherController.getProfile);

// Management Routes (For Sub Admin / HOD)
// Note: We need a middleware to check if user is sub_admin for these routes
// For now, we'll just use authMiddleware, but in production, role check is essential
router.post('/', authMiddleware, createTeacherValidator, teacherController.createTeacher);
router.get('/', authMiddleware, teacherController.getAllTeachers);
router.put('/:id', authMiddleware, teacherController.updateTeacher);
router.delete('/:id', authMiddleware, teacherController.deleteTeacher);

export default router;
