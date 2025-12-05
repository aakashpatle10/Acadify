// controllers/student.controller.js
import StudentService from '../services/student.service.js';
import jwtService from '../utils/jwt.js';
import { redisClient } from '../config/redis.js';
import { AppError } from '../utils/errors.js';

class StudentController {
    constructor() {
        this.studentService = new StudentService();
    }

    login = async (req, res, next) => {
        try {
            const { enrollmentNumber, password } = req.body;
            const result = await this.studentService.login(enrollmentNumber, password);

            // Set cookies
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    refreshToken = async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw new AppError('Refresh token not found', 401);
            }

            const tokens = await this.studentService.refreshToken(refreshToken);

            // Set new cookies
            res.cookie('token', tokens.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 15 * 60 * 1000
            });

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(200).json({
                success: true,
                data: tokens
            });
        } catch (error) {
            next(error);
        }
    };

    logout = async (req, res, next) => {
        try {
            const token =
                req.cookies?.token ||
                req.header('Authorization')?.replace('Bearer ', '');

            if (token) {
                const decoded = jwtService.verifyToken(token);
                const exp = decoded.exp * 1000;
                const ttl = Math.floor((exp - Date.now()) / 1000);

                // Blacklist the token
                if (ttl > 0 && redisClient.isOpen) {
                    await redisClient.setEx(`bl_${token}`, ttl, 'blacklisted');
                }

                // Delete refresh token
                if (redisClient.isOpen) {
                    await redisClient.del(`student_refresh_${decoded.userId}`);
                }
            }

            // Clear cookies
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });

            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async (req, res, next) => {
        try {
            const { enrollmentNumber, email, newPassword } = req.body;
            const result = await this.studentService.resetPassword(
                enrollmentNumber,
                email,
                newPassword
            );

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    };

    getProfile = async (req, res, next) => {
        try {
            const userId = req.userId;
            const profile = await this.studentService.getProfile(userId);

            res.status(200).json({
                success: true,
                data: profile
            });
        } catch (error) {
            next(error);
        }
    };

    createStudent = async (req, res, next) => {
        try {
            const student = await this.studentService.createStudent(req.body);

            res.status(201).json({
                success: true,
                message: 'Student created successfully',
                data: student
            });
        } catch (error) {
            next(error);
        }
    };

    getAllStudents = async (req, res, next) => {
        try {
            const students = await this.studentService.getAllStudents(req.query);

            res.status(200).json({
                success: true,
                data: students
            });
        } catch (error) {
            next(error);
        }
    };

    updateStudent = async (req, res, next) => {
        try {
            const { id } = req.params;
            const student = await this.studentService.updateStudent(id, req.body);

            res.status(200).json({
                success: true,
                message: 'Student updated successfully',
                data: student
            });
        } catch (error) {
            next(error);
        }
    };

    deleteStudent = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.studentService.deleteStudent(id);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new StudentController();
