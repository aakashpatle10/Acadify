import React, { useState, useEffect } from 'react';
import { BsX, BsQrCode } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';
import { BsPersonX } from 'react-icons/bs';

const AttendanceOverlay = ({ isOpen, onClose, classInfo }) => {
  const [stats, setStats] = useState({ present: 3, total: 6 });

  // Prevent background scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const [students, setStudents] = useState([
    { name: "Tatya", id: "ST001", time: "11:02 AM", status: "present" },
    { name: "Tunni", id: "ST004", time: "11:05 AM", status: "present" },
    { name: "Goti", id: "ST002", time: "11:03 AM", status: "present" },
    { name: "Baburao", id: "ST005", status: "absent" },
    { name: "Khetri", id: "ST003", status: "absent" },
    { name: "DADA", id: "ST006", status: "absent" }
  ]);

  // Update stats when students change
  useEffect(() => {
    const presentCount = students.filter(s => s.status === 'present').length;
    setStats({ present: presentCount, total: students.length });
  }, [students]);

  const toggleAttendance = (studentId) => {
    setStudents(prev =>
      prev.map(student => {
        if (student.id === studentId) {
          const newStatus = student.status === 'present' ? 'absent' : 'present';
          return {
            ...student,
            status: newStatus,
            time: newStatus === 'present' ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : null
          };
        }
        return student;
      })
    );
  };

  const handleSave = () => {
    console.log('Saving attendance:', students);
    onClose();
  };

  if (!isOpen) return null;

  const attendancePercentage = Math.round((stats.present / stats.total) * 100);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-hidden p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Attendance Control</h2>
            <p className="text-gray-600 mt-1 text-sm">{classInfo.title} • {classInfo.time} • {classInfo.room}</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={onClose}>
            <BsX size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 p-6 overflow-hidden">
          {/* Left panel – QR only */}
          <div className="flex flex-col gap-4 overflow-hidden">
            {/* QR Code Section */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-3">QR Code Generator</h3>

              {/* QR Code Display */}
              <div className="w-full aspect-square max-w-[200px] mx-auto border-4 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 mb-3">
                <BsQrCode className="text-gray-300 text-5xl mb-2" />
                <p className="text-gray-400 text-xs font-medium">QR Code will appear here</p>
              </div>

              {/* Class ID */}
              <div className="bg-gray-100 rounded-lg p-2 mb-3">
                <p className="text-xs text-gray-500 mb-0.5">Class ID</p>
                <p className="text-xs font-mono font-semibold text-gray-900">CALCULUS_I_001</p>
              </div>

              {/* Generate Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm">
                <BsQrCode size={18} />
                Generate QR Code
              </button>
            </div>
          </div>

          {/* Right panel – Student list with attendance percentage */}
          <div className="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden">
            {/* Header with Attendance Percentage */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Real-time Monitor</h3>
                <div className="text-4xl font-bold text-blue-600">{attendancePercentage}%</div>
              </div>
              <div className="text-sm text-gray-600">{stats.present}/{stats.total} Present</div>
            </div>

            {/* Student List - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {students.map(student => (
                <div
                  key={student.id}
                  className={`flex justify-between items-center p-4 bg-white rounded-xl cursor-pointer hover:shadow-md transition-all border-2 ${student.status === 'present' ? 'border-green-200 hover:border-green-300' : 'border-red-200 hover:border-red-300'
                    }`}
                  onClick={() => toggleAttendance(student.id)}
                  title="Click to toggle attendance status"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Status Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${student.status === 'present' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                      {student.status === 'present' ? (
                        <FaCheckCircle className="text-green-600 text-xl" />
                      ) : (
                        <BsPersonX className="text-red-600 text-xl" />
                      )}
                    </div>

                    {/* Student Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{student.name}</h4>
                      <p className="text-sm text-gray-500 truncate">{student.id}</p>
                    </div>
                  </div>

                  {/* Time & Status */}
                  <div className="flex items-center gap-3">
                    {student.time && (
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                        {student.time}
                      </span>
                    )}
                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${student.status === 'present'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Manual Override Info - Fixed at bottom */}
            <div className="p-4 bg-blue-50 border-t-2 border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-1 text-sm">Manual Override</h4>
              <p className="text-xs text-gray-600">Click student status to manually mark attendance</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            onClick={handleSave}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceOverlay;