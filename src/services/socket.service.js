// services/socket.service.js
// import logger from '../utils/logger.js';
// import qrService from './Qr.service.js';
// import ClassSession from '../models/ClassSession.model.js';

// class SocketService {
//   constructor(server) {
//     this.io = new Server(server, {
//       cors: {
//         origin: process.env.CORS_ORIGIN || "http://localhost:5173",
//         methods: ["GET", "POST"],
//         credentials: true
//       }
//     });
//     this.activeIntervals = new Map();
//     this.initializeSocket();
//   }

//   initializeSocket() {
//     this.io.on('connection', (socket) => {
//       logger.info(`Socket connected: ${socket.id}`);

//       // Join a class room
//       socket.on('join_class', (classId) => {
//         socket.join(classId);
//         logger.info(`Socket ${socket.id} joined class ${classId}`);
//       });

//       // Handle QR code generation requests
//       socket.on('request_qr', async ({ sessionId }) => {
//         try {
//           const session = await ClassSession.findById(sessionId);
//           if (!session) {
//             throw new Error('Session not found');
//           }
          
//           if (session.isLive) {
//             // Generate initial token
//             const token = qrService.generateToken(sessionId);
//             session.activeQrToken = token;
//             await session.save();

//             // Send to requester
//             socket.emit('qr_update', { token });

//             // Start periodic updates (every 10 seconds)
//             const interval = setInterval(async () => {
//               try {
//                 const currentSession = await ClassSession.findById(sessionId);
//                 if (!currentSession || !currentSession.isLive) {
//                   this.cleanupInterval(sessionId);
//                   return;
//                 }

//                 const newToken = qrService.generateToken(sessionId);
//                 currentSession.activeQrToken = newToken;
//                 await currentSession.save();

//                 this.io.to(sessionId).emit('qr_update', { token: newToken });
//               } catch (err) {
//                 logger.error('Error in QR update interval:', err);
//                 this.cleanupInterval(sessionId);
//               }
//             }, 10000);

//             // Store the interval for cleanup
//             this.activeIntervals.set(sessionId, interval);
//           }
//         } catch (error) {
//           logger.error('Error handling QR request:', error);
//           socket.emit('qr_error', { error: error.message });
//         }
//       });

//       // Handle disconnection
//       socket.on('disconnect', () => {
//         logger.info(`Socket disconnected: ${socket.id}`);
//         // Clean up any intervals associated with this socket's sessions
//         this.activeIntervals.forEach((interval, sessionId) => {
//           clearInterval(interval);
//           this.activeIntervals.delete(sessionId);
//         });
//       });
//     });
//   }

//   cleanupInterval(sessionId) {
//     if (this.activeIntervals.has(sessionId)) {
//       clearInterval(this.activeIntervals.get(sessionId));
//       this.activeIntervals.delete(sessionId);
//     }
//   }

//   getIO() {
//     return this.io;
//   }
// }

// export default SocketService;
