
import {asyncHandler} from '../utils/asyncHandler.js';
import AttendanceRecordService from '../services/attendanceRecord.service.js';


export const markAttendance = asyncHandler(async (req, res) => {
  const studentId = req.user.id; 
  const { token } = req.body;

  const record =
    await AttendanceRecordService.markAttendance({
      studentId,
      token,
    });

  res.status(201).json({
    success: true,
    message: 'Attendance marked successfully',
    data: record,
  });
});
