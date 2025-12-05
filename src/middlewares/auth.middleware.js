// middlewares/auth.middleware.js
import jwtService from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';
import { redisClient } from '../config/redis.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new AppError('Unauthorized - No token provided', 401);
        }

        // Check if token is blacklisted
        if (redisClient.isOpen) {
            const isBlacklisted = await redisClient.get(`bl_${token}`);
            if (isBlacklisted) {
                throw new AppError('Token is invalid', 401);
            }
        }

        const decoded = jwtService.verifyToken(token);
        req.userId = decoded.userId;
        req.enrollmentNumber = decoded.enrollmentNumber;
        req.roleId = decoded.roleId;

        // Populate req.user for compatibility with requireRole and controllers
        // Note: decoded.roleId actually contains the role name (e.g., "teacher", "admin", "student")
        // because the login services pass role name as the third parameter to generateTokens
        req.user = {
            id: decoded.userId,
            _id: decoded.userId,
            role: decoded.roleId, // roleId field contains the role name
            enrollmentNumber: decoded.enrollmentNumber
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token', 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Token expired', 401));
        }
        next(error);
    }
};

export const requireRole = (roles = []) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            if (!Array.isArray(roles)) {
                roles = [roles];
            }

            if (roles.length && !roles.includes(req.user.role)) {
                throw new AppError('Insufficient permissions', 403);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
