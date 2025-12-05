// controllers/analytics.controller.js
import Attendance from '../models/Attendance.model.js';
import ClassSession from '../models/ClassSession.model.js';
import Teacher from '../models/teacher.model.js';
import Student from '../models/students.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Get attendance overview
export const getAttendanceOverview = asyncHandler(async (req, res) => {
    const { startDate, endDate, section } = req.query;

    const filter = {};
    if (startDate && endDate) {
        filter.scanTime = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    // Get total sessions
    const totalSessions = await ClassSession.countDocuments({
        startTime: filter.scanTime || { $exists: true }
    });

    // Get attendance records
    const attendanceRecords = await Attendance.find(filter);

    // Calculate metrics
    const totalPresent = attendanceRecords.filter(a => a.status === 'Present').length;
    const totalAbsent = attendanceRecords.filter(a => a.status === 'Absent').length;
    const totalLate = attendanceRecords.filter(a => a.status === 'Late').length;

    const overallPercentage = totalSessions > 0
        ? ((totalPresent / (totalPresent + totalAbsent + totalLate)) * 100).toFixed(2)
        : 0;

    res.json({
        success: true,
        data: {
            totalSessions,
            totalPresent,
            totalAbsent,
            totalLate,
            overallPercentage,
            breakdown: {
                present: totalPresent,
                absent: totalAbsent,
                late: totalLate
            }
        }
    });
});

// Get attendance trends (daily/weekly/monthly)
export const getAttendanceTrends = asyncHandler(async (req, res) => {
    const { period = 'weekly', section } = req.query;

    let groupBy;
    let dateRange;

    switch (period) {
        case 'daily':
            groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$scanTime' } };
            dateRange = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
            break;
        case 'weekly':
            groupBy = { $week: '$scanTime' };
            dateRange = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
            break;
        case 'monthly':
            groupBy = { $month: '$scanTime' };
            dateRange = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // Last year
            break;
        default:
            groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$scanTime' } };
            dateRange = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    const trends = await Attendance.aggregate([
        {
            $match: {
                scanTime: { $gte: dateRange }
            }
        },
        {
            $group: {
                _id: groupBy,
                totalPresent: {
                    $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] }
                },
                totalAbsent: {
                    $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] }
                },
                totalLate: {
                    $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] }
                }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    res.json({
        success: true,
        period,
        data: trends
    });
});

// Get teacher performance metrics
export const getTeacherPerformance = asyncHandler(async (req, res) => {
    const { teacherId } = req.query;

    const filter = teacherId ? { teacherId } : {};

    const performance = await ClassSession.aggregate([
        { $match: filter },
        {
            $lookup: {
                from: 'attendances',
                localField: '_id',
                foreignField: 'classSessionId',
                as: 'attendanceRecords'
            }
        },
        {
            $group: {
                _id: '$teacherId',
                totalSessions: { $sum: 1 },
                totalStudentsPresent: {
                    $sum: {
                        $size: {
                            $filter: {
                                input: '$attendanceRecords',
                                cond: { $eq: ['$$this.status', 'Present'] }
                            }
                        }
                    }
                },
                averageAttendance: {
                    $avg: {
                        $cond: [
                            { $gt: [{ $size: '$attendanceRecords' }, 0] },
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            {
                                                $size: {
                                                    $filter: {
                                                        input: '$attendanceRecords',
                                                        cond: { $eq: ['$$this.status', 'Present'] }
                                                    }
                                                }
                                            },
                                            { $size: '$attendanceRecords' }
                                        ]
                                    },
                                    100
                                ]
                            },
                            0
                        ]
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'teachers',
                localField: '_id',
                foreignField: '_id',
                as: 'teacher'
            }
        },
        {
            $unwind: '$teacher'
        },
        {
            $project: {
                teacherName: {
                    $concat: ['$teacher.firstName', ' ', '$teacher.lastName']
                },
                totalSessions: 1,
                totalStudentsPresent: 1,
                averageAttendance: { $round: ['$averageAttendance', 2] }
            }
        }
    ]);

    res.json({
        success: true,
        data: performance
    });
});

// Get student engagement analytics
export const getStudentEngagement = asyncHandler(async (req, res) => {
    const { studentId, section } = req.query;

    const filter = {};
    if (studentId) filter.studentId = studentId;

    const engagement = await Attendance.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$studentId',
                totalClasses: { $sum: 1 },
                presentCount: {
                    $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] }
                },
                lateCount: {
                    $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] }
                },
                absentCount: {
                    $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] }
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'student'
            }
        },
        {
            $unwind: '$student'
        },
        {
            $project: {
                studentName: {
                    $concat: ['$student.firstName', ' ', '$student.lastName']
                },
                enrollmentNumber: '$student.enrollmentNumber',
                totalClasses: 1,
                presentCount: 1,
                lateCount: 1,
                absentCount: 1,
                attendancePercentage: {
                    $round: [
                        {
                            $multiply: [
                                { $divide: ['$presentCount', '$totalClasses'] },
                                100
                            ]
                        },
                        2
                    ]
                }
            }
        },
        {
            $sort: { attendancePercentage: -1 }
        }
    ]);

    res.json({
        success: true,
        count: engagement.length,
        data: engagement
    });
});

// Get class-wise analytics
export const getClassAnalytics = asyncHandler(async (req, res) => {
    const { section } = req.query;

    const sessions = await ClassSession.find(section ? { section } : {})
        .populate('teacherId', 'firstName lastName')
        .lean();

    const analytics = await Promise.all(
        sessions.map(async (session) => {
            const attendanceRecords = await Attendance.find({
                classSessionId: session._id
            });

            const present = attendanceRecords.filter(a => a.status === 'Present').length;
            const total = attendanceRecords.length;

            return {
                sessionId: session._id,
                subject: session.subject,
                section: session.section,
                teacher: session.teacherId
                    ? `${session.teacherId.firstName} ${session.teacherId.lastName}`
                    : 'N/A',
                date: session.startTime,
                totalStudents: total,
                presentStudents: present,
                attendanceRate: total > 0 ? ((present / total) * 100).toFixed(2) : 0
            };
        })
    );

    res.json({
        success: true,
        count: analytics.length,
        data: analytics
    });
});
