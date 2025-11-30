import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';
import { BsX, BsPeople, BsCheckCircle, BsClock } from 'react-icons/bs';

const QrAttendanceSession = ({ isOpen, onClose, classInfo }) => {
    const [socket, setSocket] = useState(null);
    const [qrToken, setQrToken] = useState('');
    const [presentStudents, setPresentStudents] = useState([]);
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        if (isOpen && classInfo) {
            // Initialize Socket.IO connection
            const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:9000', {
                withCredentials: true
            });

            setSocket(newSocket);

            // Start class session via API
            startClassSession(classInfo);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [isOpen, classInfo]);

    useEffect(() => {
        if (socket && sessionId) {
            // Join the class room
            socket.emit('join_class', sessionId);

            // Listen for QR token updates (every 10 seconds)
            socket.on('qr_update', (data) => {
                setQrToken(data.token);
            });

            // Listen for attendance updates
            socket.on('attendance_update', (data) => {
                setPresentStudents(prev => [...prev, data.student]);
            });

            // Request initial QR token
            socket.emit('request_qr', { sessionId });

            return () => {
                socket.off('qr_update');
                socket.off('attendance_update');
            };
        }
    }, [socket, sessionId]);

    const startClassSession = async (classInfo) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attendance/start-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    subject: classInfo.title,
                    section: classInfo.room
                })
            });

            const data = await response.json();
            setSessionId(data.sessionId);
        } catch (error) {
            console.error('Failed to start session:', error);
        }
    };

    const endSession = async () => {
        if (sessionId) {
            try {
                await fetch(`${import.meta.env.VITE_API_URL}/api/attendance/end-session/${sessionId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                onClose();
            } catch (error) {
                console.error('Failed to end session:', error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{classInfo?.title}</h2>
                        <p className="text-sm text-gray-500 mt-1">{classInfo?.time} • {classInfo?.room}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <BsX className="text-2xl text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* QR Code Section */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 flex flex-col items-center justify-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan to Mark Attendance</h3>
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                {qrToken ? (
                                    <QRCodeSVG
                                        value={qrToken}
                                        size={256}
                                        level="H"
                                        includeMargin={true}
                                    />
                                ) : (
                                    <div className="w-64 h-64 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                <BsClock className="animate-pulse" />
                                <span>QR refreshes every 10 seconds</span>
                            </div>
                        </div>

                        {/* Live Attendance List */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Present Students</h3>
                                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                    <BsPeople />
                                    <span className="font-semibold">{presentStudents.length}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                                {presentStudents.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <BsPeople className="text-4xl mx-auto mb-2 opacity-50" />
                                        <p>Waiting for students to scan...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {presentStudents.map((student, index) => (
                                            <div
                                                key={index}
                                                className="bg-white p-3 rounded-lg flex items-center gap-3 animate-fadeIn"
                                            >
                                                <BsCheckCircle className="text-green-500 text-xl" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{student.name}</p>
                                                    <p className="text-xs text-gray-500">{student.enrollmentNumber}</p>
                                                </div>
                                                <span className="ml-auto text-xs text-gray-400">
                                                    {new Date(student.scanTime).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={endSession}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            End Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QrAttendanceSession;
