// services/teacher.service.js
import MongoTeacherRepository from '../repositories/implementations/MongoTeacherRepository.js';
import jwtService from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';
import { redisClient } from '../config/redis.js';
import logger from '../utils/logger.js';

class TeacherService {
    constructor() {
        this.teacherRepository = new MongoTeacherRepository();
    }

    async login(email, password) {
        try {
            const teacher = await this.teacherRepository.findByEmail(email);

            if (!teacher) {
                throw new AppError('Invalid email or password', 401);
            }

            if (!teacher.isActive) {
                throw new AppError('Teacher account is deactivated', 403);
            }

            const isPasswordValid = await teacher.comparePassword(password);
            if (!isPasswordValid) {
                throw new AppError('Invalid email or password', 401);
            }

            const tokens = jwtService.generateTokens(
                teacher._id,
                teacher.email,
                teacher.role
            );

            // Store refresh token in Redis
            if (redisClient.isOpen) {
                try {
                    await redisClient.setEx(
                        `teacher_refresh_${teacher._id}`,
                        7 * 24 * 60 * 60,
                        tokens.refreshToken
                    );
                } catch (redisError) {
                    logger.error('Redis error while storing refresh token:', redisError);
                }
            }

            return {
                teacher: {
                    id: teacher._id,
                    email: teacher.email,
                    firstName: teacher.firstName,
                    lastName: teacher.lastName,
                    employeeId: teacher.employeeId,
                    department: teacher.department,
                    role: teacher.role
                },
                token: tokens.accessToken,
                refreshToken: tokens.refreshToken
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Teacher login error:', error);
            throw new AppError('Login failed', 500);
        }
    }

    async createTeacher(teacherData, creatorId) {
        try {
            const newTeacherData = {
                ...teacherData,
                createdBy: creatorId
            };

            const teacher = await this.teacherRepository.create(newTeacherData);

            return {
                id: teacher._id,
                email: teacher.email,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                employeeId: teacher.employeeId,
                department: teacher.department,
                role: teacher.role
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Create teacher error:', error);
            throw new AppError('Failed to create teacher', 500);
        }
    }

    async getAllTeachers(filter = {}) {
        try {
            return await this.teacherRepository.findAll(filter);
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Get all teachers error:', error);
            throw new AppError('Failed to fetch teachers', 500);
        }
    }

    async getProfile(id) {
        try {
            const teacher = await this.teacherRepository.findById(id);
            if (!teacher) {
                throw new AppError('Teacher not found', 404);
            }
            return teacher;
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Get teacher profile error:', error);
            throw new AppError('Failed to fetch profile', 500);
        }
    }

    async updateTeacher(id, updateData) {
        try {
            // Prevent updating critical fields
            delete updateData.password;
            delete updateData.role;
            delete updateData.email;
            delete updateData.employeeId;

            const teacher = await this.teacherRepository.update(id, updateData);

            if (!teacher) {
                throw new AppError('Teacher not found', 404);
            }

            return teacher;
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Update teacher error:', error);
            throw new AppError('Failed to update teacher', 500);
        }
    }

    async deleteTeacher(id) {
        try {
            const teacher = await this.teacherRepository.delete(id);

            if (!teacher) {
                throw new AppError('Teacher not found', 404);
            }

            // Invalidate refresh tokens
            if (redisClient.isOpen) {
                await redisClient.del(`teacher_refresh_${id}`);
            }

            return { message: 'Teacher deleted successfully' };
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Delete teacher error:', error);
            throw new AppError('Failed to delete teacher', 500);
        }
    }
}

export default TeacherService;
