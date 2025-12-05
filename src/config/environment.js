// config/environment.js
import dotenv from 'dotenv';
dotenv.config();

export default {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
    GROK_API_KEY: process.env.GROK_API_KEY,
    GROK_API_URL: process.env.GROK_API_URL || 'https://api.x.ai/v1',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173'
};