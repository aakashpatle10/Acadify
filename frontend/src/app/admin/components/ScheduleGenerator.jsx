import React, { useState } from 'react';
import { BsCalendar3, BsRobot, BsCheckCircle, BsXCircle } from 'react-icons/bs';

const ScheduleGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        teachers: [],
        subjects: [],
        classes: [],
        constraints: {}
    });

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/schedule/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    teachers: formData.teachers,
                    subjects: formData.subjects,
                    classes: formData.classes,
                    constraints: formData.constraints
                })
            });

            const data = await response.json();

            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.message || 'Failed to generate schedule');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <BsRobot className="text-blue-600" />
                    AI Schedule Generator
                </h1>
                <p className="text-gray-500 mt-1">Generate optimized schedules using Grok AI</p>
            </div>

            {/* Configuration Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Parameters</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Teachers
                        </label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 10"
                            onChange={(e) => {
                                // In real implementation, fetch teachers from API
                                const count = parseInt(e.target.value) || 0;
                                setFormData(prev => ({
                                    ...prev,
                                    teachers: Array(count).fill({}).map((_, i) => ({
                                        _id: `teacher_${i}`,
                                        name: `Teacher ${i + 1}`,
                                        subjects: ['Mathematics', 'Science']
                                    }))
                                }));
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subjects
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Mathematics, Science, English (comma-separated)"
                            onChange={(e) => {
                                const subjects = e.target.value.split(',').map(s => ({
                                    name: s.trim()
                                }));
                                setFormData(prev => ({ ...prev, subjects }));
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Classes/Sections
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="CS-A, CS-B, ME-A (comma-separated)"
                            onChange={(e) => {
                                const classes = e.target.value.split(',').map(s => ({
                                    name: s.trim()
                                }));
                                setFormData(prev => ({ ...prev, classes }));
                            }}
                        />
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !formData.teachers.length || !formData.subjects.length}
                    className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Generating with AI...
                        </>
                    ) : (
                        <>
                            <BsRobot />
                            Generate Schedule
                        </>
                    )}
                </button>
            </div>

            {/* Result Section */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 text-red-700">
                        <BsXCircle className="text-2xl" />
                        <div>
                            <h3 className="font-semibold">Error</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {result && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 text-green-700 mb-4">
                        <BsCheckCircle className="text-2xl" />
                        <div>
                            <h3 className="font-semibold">Schedule Generated Successfully!</h3>
                            <p className="text-sm">{result.notes || 'AI-powered schedule created'}</p>
                        </div>
                    </div>

                    {/* Schedule Table */}
                    <div className="bg-white rounded-lg overflow-hidden mt-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {result.schedule?.slice(0, 10).map((entry, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.day}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{entry.timeSlot}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.subject}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{entry.section}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{entry.room}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {result.schedule?.length > 10 && (
                            <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 text-center">
                                Showing 10 of {result.schedule.length} entries
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleGenerator;
