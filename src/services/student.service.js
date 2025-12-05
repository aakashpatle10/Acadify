// services/student.service.js
import MongoStudentRepository from '../repositories/implementations/MongoStudentRepository.js';
import jwtService from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';
import { redisClient } from '../config/redis.js';
import logger from '../utils/logger.js';

class StudentService {
    constructor() {
        this.studentRepository = new MongoStudentRepository();
    }

    async login(enrollmentNumber, password) {
        try {
            const student = await this.studentRepository.findStudentByEnrollmentNumber(enrollmentNumber);

            if (!student) {
                throw new AppError('Invalid enrollment number or password', 401);
            }

            if (!student.password) {
                throw new AppError('Please use Google login', 400);
            }

            const isPasswordValid = await student.comparePassword(password);
            if (!isPasswordValid) {
                throw new AppError('Invalid enrollment number or password', 401);
            }

            const tokens = jwtService.generateTokens(
                student._id,
                student.enrollmentNumber,
                student.roleId
            );

            // Store refresh token in Redis
            if (redisClient.isOpen) {
                try {
                    await redisClient.setEx(
                        `student_refresh_${student._id}`,
                        7 * 24 * 60 * 60, // 7 days
                        tokens.refreshToken
                    );
                } catch (redisError) {
                    logger.error('Redis error while storing refresh token:', redisError);
                }
            }

            return {
                student: {
                    id: student._id,
                    enrollmentNumber: student.enrollmentNumber,
                    email: student.email,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    phoneNumber: student.phoneNumber,
                    roleId: student.roleId,
                    role: 'student' // Explicitly set role for frontend
                },
                token: tokens.accessToken,
                refreshToken: tokens.refreshToken
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Login error:', error);
            throw new AppError('Login failed', 500);
        }
    }

    async refreshToken(refreshToken) {
        try {
            const decoded = jwtService.verifyToken(refreshToken);

            // Verify refresh token in Redis
            if (redisClient.isOpen) {
                const storedToken = await redisClient.get(`student_refresh_${decoded.userId}`);
                if (!storedToken || storedToken !== refreshToken) {
                    throw new AppError('Invalid refresh token', 401);
                }
            }

            const student = await this.studentRepository.findStudentById(decoded.userId);
            if (!student) {
                throw new AppError('Student not found', 404);
            }

            const tokens = jwtService.generateTokens(
                student._id,
                student.enrollmentNumber,
                student.roleId
            );

            // Update refresh token in Redis
            if (redisClient.isOpen) {
                await redisClient.setEx(
                    `student_refresh_${student._id}`,
                    7 * 24 * 60 * 60,
                    tokens.refreshToken
                );
            }

            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                throw new AppError('Invalid or expired refresh token', 401);
            }
            logger.error('Refresh token error:', error);
            throw new AppError('Failed to refresh token', 500);
        }
    }

    async resetPassword(enrollmentNumber, email, newPassword) {
        try {
            const student = await this.studentRepository.findStudentByEnrollmentAndEmail(
                enrollmentNumber,
                email
            );

            if (!student) {
                throw new AppError('No student found with this enrollment number and email', 404);
            }

            await this.studentRepository.updateStudentPassword(enrollmentNumber, newPassword);

            // Invalidate all refresh tokens for this student
            if (redisClient.isOpen) {
                await redisClient.del(`student_refresh_${student._id}`);
            }

            logger.info(`Password reset successful for enrollment: ${enrollmentNumber}`);

            return {
                message: 'Password reset successful. Please login with your new password.'
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Password reset error:', error);
            throw new AppError('Password reset failed', 500);
        }
    }

    async getProfile(userId) {
        try {
            const student = await this.studentRepository.findStudentById(userId);

            if (!student) {
                throw new AppError('Student not found', 404);
            }

            return {
                id: student._id,
                enrollmentNumber: student.enrollmentNumber,
                email: student.email,
                firstName: student.firstName,
                lastName: student.lastName,
                phoneNumber: student.phoneNumber,
                roleId: student.roleId
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Get profile error:', error);
            throw new AppError('Failed to get profile', 500);
        }
    }

    async createStudent(studentData) {
        try {
            const student = await this.studentRepository.createStudent(studentData);

            return {
                id: student._id,
                enrollmentNumber: student.enrollmentNumber,
                email: student.email,
                firstName: student.firstName,
                lastName: student.lastName,
                department: student.department,
                course: student.course,
                year: student.year,
                semester: student.semester
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Create student error:', error);
            throw new AppError('Failed to create student', 500);
        }
    }

    async getAllStudents(filter = {}) {
        try {
            return await this.studentRepository.findAll(filter);
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Get all students error:', error);
            throw new AppError('Failed to fetch students', 500);
        }
    }

    async updateStudent(id, updateData) {
        try {
            // Prevent updating critical fields
            delete updateData.password;
            delete updateData.enrollmentNumber;
            delete updateData.email;

            const student = await this.studentRepository.update(id, updateData);

            if (!student) {
                throw new AppError('Student not found', 404);
            }

            return student;
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Update student error:', error);
            throw new AppError('Failed to update student', 500);
        }
    }

    async deleteStudent(id) {
        try {
            const student = await this.studentRepository.delete(id);

            if (!student) {
                throw new AppError('Student not found', 404);
            }

            // Invalidate refresh tokens
            if (redisClient.isOpen) {
                await redisClient.del(`student_refresh_${id}`);
            }

            return { message: 'Student deleted successfully' };
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Delete student error:', error);
            throw new AppError('Failed to delete student', 500);
        }
    }
}

export default StudentService;
