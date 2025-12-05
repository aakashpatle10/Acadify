// utils/jwt.js
import jwt from 'jsonwebtoken';
import config from '../config/environment.js';

class JWTService {
    generateAccessToken(userId, enrollmentNumber, roleId) {
        return jwt.sign(
            { userId, enrollmentNumber, roleId },
            config.JWT_SECRET,
            { expiresIn: '15m' }
        );
    }

    generateRefreshToken(userId, enrollmentNumber, roleId) {
        return jwt.sign(
            { userId, enrollmentNumber, roleId },
            config.JWT_SECRET,
            { expiresIn: '7d' }
        );
    }

    verifyToken(token) {
        return jwt.verify(token, config.JWT_SECRET);
    }

    generateTokens(userId, enrollmentNumber, roleId) {
        return {
            accessToken: this.generateAccessToken(userId, enrollmentNumber, roleId),
            refreshToken: this.generateRefreshToken(userId, enrollmentNumber, roleId)
        };
    }
}

export default new JWTService();
