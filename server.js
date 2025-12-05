import { createServer } from 'http';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { connectRedis } from './src/config/redis.js';
import config from './src/config/environment.js';
import logger from './src/utils/logger.js';
// import SocketService from './src/services/socket.service.js';

const { PORT } = config;

async function startServer() {
  try {
    // Initialize database connections
    await connectDB();
    await connectRedis();

    // Create HTTP server
    const httpServer = createServer(app);
    
    // Initialize Socket Service
    // new SocketService(httpServer);
    
    // Start the server
    httpServer.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      // logger.info(`Socket.IO initialized`);
    });
  } catch (error) {
    logger.error("Server failed to start:", error);
    process.exit(1);
  }
}

// Start the server
startServer();
