// routes/student.routes.js
import express from 'express';
import studentController from '../controllers/student.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { loginValidator, resetPasswordValidator, createStudentValidator } from '../middlewares/validators/student.validator.js';

const router = express.Router();

// Public routes
router.post('/login', loginValidator, studentController.login);
router.post('/reset-password', resetPasswordValidator, studentController.resetPassword);
router.post('/refresh-token', studentController.refreshToken);

// Protected routes
router.post('/logout', authMiddleware, studentController.logout);
router.get('/profile', authMiddleware, studentController.getProfile);

// Management Routes (For Sub Admin / Teacher)
// Note: We need a middleware to check if user is sub_admin or teacher for these routes
// For now, we'll just use authMiddleware
router.post('/', authMiddleware, createStudentValidator, studentController.createStudent);
router.get('/', authMiddleware, studentController.getAllStudents);
router.put('/:id', authMiddleware, studentController.updateStudent);
router.delete('/:id', authMiddleware, studentController.deleteStudent);

export default router;
