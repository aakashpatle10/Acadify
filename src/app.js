// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import studentRoutes from './routes/student.routes.js';
import adminRoutes from './routes/admin.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import timetableRoutes from './routes/timetable.routes.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import { corsOptions } from './config/corsOptions.js'; // Retained from original as it's used by cors()
import qrRoutes from "./routes/Qr.routes.js";

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/timetable', timetableRoutes);
app.use("/api/qr", qrRoutes);


// Error Handler
app.use(errorHandler);

export default app;