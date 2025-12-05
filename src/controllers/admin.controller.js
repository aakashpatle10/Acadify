// controllers/admin.controller.js
import AdminService from '../services/admin.service.js';
import jwtService from '../utils/jwt.js';
import { redisClient } from '../config/redis.js';
import { AppError } from '../utils/errors.js';

class AdminController {
    constructor() {
        this.adminService = new AdminService();
    }

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await this.adminService.login(email, password);

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

            const tokens = await this.adminService.refreshToken(refreshToken);

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
                    await redisClient.del(`admin_refresh_${decoded.userId}`);
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
            const { email, newPassword } = req.body;
            const result = await this.adminService.resetPassword(email, newPassword);

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
            const profile = await this.adminService.getProfile(userId);

            res.status(200).json({
                success: true,
                data: profile
            });
        } catch (error) {
            next(error);
        }
    };

    createSubAdmin = async (req, res, next) => {
        try {
            const creatorId = req.userId;
            const subAdmin = await this.adminService.createSubAdmin(req.body, creatorId);

            res.status(201).json({
                success: true,
                message: 'Sub-admin created successfully',
                data: subAdmin
            });
        } catch (error) {
            next(error);
        }
    };

    getAllSubAdmins = async (req, res, next) => {
        try {
            const subAdmins = await this.adminService.getAllSubAdmins();

            res.status(200).json({
                success: true,
                data: subAdmins
            });
        } catch (error) {
            next(error);
        }
    };

    updateSubAdmin = async (req, res, next) => {
        try {
            const { id } = req.params;
            const subAdmin = await this.adminService.updateSubAdmin(id, req.body);

            res.status(200).json({
                success: true,
                message: 'Sub-admin updated successfully',
                data: subAdmin
            });
        } catch (error) {
            next(error);
        }
    };

    deleteSubAdmin = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.adminService.deleteSubAdmin(id);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new AdminController();
