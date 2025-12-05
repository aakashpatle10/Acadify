// controllers/schedule.controller.js
import Schedule from '../models/Schedule.model.js';
import Substitution from '../models/Substitution.model.js';
import Teacher from '../models/teacher.model.js';
import aiService from '../services/ai.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Generate schedule using AI
export const generateSchedule = asyncHandler(async (req, res) => {
    const { teachers, subjects, classes, constraints } = req.body;

    // Validate input
    if (!teachers || !subjects || !classes) {
        return res.status(400).json({
            success: false,
            message: 'Missing required parameters: teachers, subjects, classes'
        });
    }

    // Call AI service
    const result = await aiService.generateSchedule({
        teachers,
        subjects,
        classes,
        constraints: constraints || {}
    });

    if (!result.success && result.fallback) {
        // Save fallback schedule
        await Schedule.deleteMany({}); // Clear existing
        const scheduleEntries = result.fallback.schedule.map(entry => ({
            dayOfWeek: entry.day,
            startTime: entry.timeSlot.split('-')[0],
            endTime: entry.timeSlot.split('-')[1],
            subject: entry.subject,
            teacherId: entry.teacherId,
            section: entry.section,
            roomNumber: entry.room
        }));

        await Schedule.insertMany(scheduleEntries);

        return res.json({
            success: true,
            message: 'Schedule generated using fallback algorithm',
            data: result.fallback
        });
    }

    if (result.success) {
        // Save AI-generated schedule
        await Schedule.deleteMany({});
        const scheduleEntries = result.schedule.schedule.map(entry => ({
            dayOfWeek: entry.day,
            startTime: entry.timeSlot.split('-')[0],
            endTime: entry.timeSlot.split('-')[1],
            subject: entry.subject,
            teacherId: entry.teacherId,
            section: entry.section,
            roomNumber: entry.room
        }));

        await Schedule.insertMany(scheduleEntries);

        return res.json({
            success: true,
            message: 'Schedule generated successfully using AI',
            data: result.schedule
        });
    }

    res.status(500).json({
        success: false,
        message: 'Failed to generate schedule',
        error: result.error
    });
});

// Get current schedule
export const getSchedule = asyncHandler(async (req, res) => {
    const { day, section } = req.query;

    const filter = {};
    if (day) filter.dayOfWeek = day;
    if (section) filter.section = section;

    const schedule = await Schedule.find(filter)
        .populate('teacherId', 'firstName lastName email')
        .sort({ dayOfWeek: 1, startTime: 1 });

    res.json({
        success: true,
        count: schedule.length,
        data: schedule
    });
});

// Request substitute teacher
export const requestSubstitute = asyncHandler(async (req, res) => {
    const { scheduleId, reason } = req.body;
    const teacherId = req.user._id;

    // Get the schedule entry
    const scheduleEntry = await Schedule.findById(scheduleId);
    if (!scheduleEntry) {
        return res.status(404).json({
            success: false,
            message: 'Schedule entry not found'
        });
    }

    // Find available teachers (not teaching at this time)
    const conflictingSchedules = await Schedule.find({
        dayOfWeek: scheduleEntry.dayOfWeek,
        startTime: scheduleEntry.startTime
    }).select('teacherId');

    const busyTeacherIds = conflictingSchedules.map(s => s.teacherId.toString());

    const availableTeachers = await Teacher.find({
        _id: { $nin: busyTeacherIds },
        isActive: true
    }).select('firstName lastName email department designation');

    if (availableTeachers.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No available teachers for substitution'
        });
    }

    // Get AI suggestion
    const suggestion = await aiService.suggestSubstitute({
        absentTeacherId: teacherId,
        subject: scheduleEntry.subject,
        timeSlot: `${scheduleEntry.startTime}-${scheduleEntry.endTime}`,
        availableTeachers: availableTeachers.map(t => ({
            _id: t._id,
            name: `${t.firstName} ${t.lastName}`,
            department: t.department,
            subjects: [scheduleEntry.subject] // Simplified
        }))
    });

    // Create substitution record
    const substitution = await Substitution.create({
        originalTeacherId: teacherId,
        substituteTeacherId: suggestion.recommendedTeacherId,
        scheduleId,
        date: new Date(),
        reason: reason || 'Leave',
        status: 'Pending'
    });

    await substitution.populate('substituteTeacherId', 'firstName lastName email');

    res.status(201).json({
        success: true,
        message: 'Substitution request created',
        data: {
            substitution,
            aiReason: suggestion.reason,
            alternatives: suggestion.alternativeOptions
        }
    });
});

// Approve/Reject substitution (Admin)
export const updateSubstitutionStatus = asyncHandler(async (req, res) => {
    const { substitutionId } = req.params;
    const { status } = req.body; // 'Approved' or 'Rejected'

    const substitution = await Substitution.findByIdAndUpdate(
        substitutionId,
        { status },
        { new: true }
    ).populate('originalTeacherId substituteTeacherId', 'firstName lastName email');

    if (!substitution) {
        return res.status(404).json({
            success: false,
            message: 'Substitution not found'
        });
    }

    res.json({
        success: true,
        message: `Substitution ${status.toLowerCase()}`,
        data: substitution
    });
});
