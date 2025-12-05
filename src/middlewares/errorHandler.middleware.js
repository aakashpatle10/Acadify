// middlewares/errorHandler.middleware.js
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    logger.error(err.message, { stack: err.stack });

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;
