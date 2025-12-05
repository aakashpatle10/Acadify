// services/admin.service.js
import MongoAdminRepository from '../repositories/implementations/MongoAdminRepository.js';
import jwtService from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';
import { redisClient } from '../config/redis.js';
import logger from '../utils/logger.js';

class AdminService {
    constructor() {
        this.adminRepository = new MongoAdminRepository();
    }

    async login(email, password) {
        try {
            const admin = await this.adminRepository.findAdminByEmail(email);

            if (!admin) {
                throw new AppError('Invalid email or password', 401);
            }

            if (!admin.isActive) {
                throw new AppError('Admin account is deactivated', 403);
            }

            const isPasswordValid = await admin.comparePassword(password);
            if (!isPasswordValid) {
                throw new AppError('Invalid email or password', 401);
            }

            const tokens = jwtService.generateTokens(
                admin._id,
                admin.email,
                admin.role
            );

            // Store refresh token in Redis
            if (redisClient.isOpen) {
                try {
                    await redisClient.setEx(
                        `admin_refresh_${admin._id}`,
                        7 * 24 * 60 * 60,
                        tokens.refreshToken
                    );
                } catch (redisError) {
                    logger.error('Redis error while storing refresh token:', redisError);
                }
            }

            return {
                admin: {
                    id: admin._id,
                    email: admin.email,
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    phoneNumber: admin.phoneNumber,
                    role: admin.role
                },
                token: tokens.accessToken,
                refreshToken: tokens.refreshToken
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Admin login error:', error);
            throw new AppError('Login failed', 500);
        }
    }

    async refreshToken(refreshToken) {
        try {
            const decoded = jwtService.verifyToken(refreshToken);

            // Verify refresh token in Redis
            if (redisClient.isOpen) {
                const storedToken = await redisClient.get(`admin_refresh_${decoded.userId}`);
                if (!storedToken || storedToken !== refreshToken) {
                    throw new AppError('Invalid refresh token', 401);
                }
            }

            const admin = await this.adminRepository.findAdminById(decoded.userId);
            if (!admin) {
                throw new AppError('Admin not found', 404);
            }

            if (!admin.isActive) {
                throw new AppError('Admin account is deactivated', 403);
            }

            const tokens = jwtService.generateTokens(
                admin._id,
                admin.email,
                admin.role
            );

            // Update refresh token in Redis
            if (redisClient.isOpen) {
                await redisClient.setEx(
                    `admin_refresh_${admin._id}`,
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

    async resetPassword(email, newPassword) {
        try {
            const admin = await this.adminRepository.findAdminByEmail(email);

            if (!admin) {
                throw new AppError('No admin found with this email', 404);
            }

            await this.adminRepository.updateAdminPassword(email, newPassword);

            // Invalidate all refresh tokens for this admin
            if (redisClient.isOpen) {
                await redisClient.del(`admin_refresh_${admin._id}`);
            }

            logger.info(`Password reset successful for admin: ${email}`);

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
            const admin = await this.adminRepository.findAdminById(userId);

            if (!admin) {
                throw new AppError('Admin not found', 404);
            }

            return {
                id: admin._id,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
                phoneNumber: admin.phoneNumber,
                role: admin.role,
                isActive: admin.isActive
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Get profile error:', error);
            throw new AppError('Failed to get profile', 500);
        }
    }

    async createSubAdmin(adminData, creatorId) {
        try {
            const subAdminData = {
                ...adminData,
                role: 'sub_admin',
                createdBy: creatorId
            };

            const subAdmin = await this.adminRepository.createAdmin(subAdminData);

            return {
                id: subAdmin._id,
                email: subAdmin.email,
                firstName: subAdmin.firstName,
                lastName: subAdmin.lastName,
                role: subAdmin.role,
                department: subAdmin.department
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Create sub-admin error:', error);
            throw new AppError('Failed to create sub-admin', 500);
        }
    }

    async getAllSubAdmins() {
        try {
            return await this.adminRepository.findAllSubAdmins();
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Get all sub-admins error:', error);
            throw new AppError('Failed to fetch sub-admins', 500);
        }
    }

    async updateSubAdmin(id, updateData) {
        try {
            // Prevent updating critical fields like password or role directly through this method
            delete updateData.password;
            delete updateData.role;
            delete updateData.email; // Email update might need verification logic, skipping for now

            const subAdmin = await this.adminRepository.updateSubAdmin(id, updateData);

            if (!subAdmin) {
                throw new AppError('Sub-admin not found', 404);
            }

            return subAdmin;
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Update sub-admin error:', error);
            throw new AppError('Failed to update sub-admin', 500);
        }
    }

    async deleteSubAdmin(id) {
        try {
            const subAdmin = await this.adminRepository.deleteSubAdmin(id);

            if (!subAdmin) {
                throw new AppError('Sub-admin not found', 404);
            }

            // Invalidate refresh tokens
            if (redisClient.isOpen) {
                await redisClient.del(`admin_refresh_${id}`);
            }

            return { message: 'Sub-admin deleted successfully' };
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error('Delete sub-admin error:', error);
            throw new AppError('Failed to delete sub-admin', 500);
        }
    }
}

export default AdminService;
