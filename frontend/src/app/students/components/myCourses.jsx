import React, { useState } from 'react';

const MyCourses = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Course data
    const courses = [
        {
            id: 1,
            code: 'MATH301',
            name: 'Advanced Mathematics',
            instructor: 'Dr. Sarah Johnson',
            progress: 78,
            currentGrade: 'A-',
            attendance: 92,
            assignments: { completed: 8, total: 10 },
            nextClass: {
                date: 'Jun 25 at 09:00 AM',
                room: 'Room 301'
            },
            status: 'Active',
            color: 'blue'
        },
        {
            id: 2,
            code: 'PHYS201',
            name: 'Physics Laboratory',
            instructor: 'Prof. Michael Brown',
            progress: 85,
            currentGrade: 'B+',
            attendance: 88,
            assignments: { completed: 6, total: 7 },
            nextClass: {
                date: 'Jun 25 at 02:00 PM',
                room: 'Lab 101'
            },
            status: 'Active',
            color: 'green'
        },
        {
            id: 3,
            code: 'CHEM101',
            name: 'Chemistry Fundamentals',
            instructor: 'Dr. Emily Wilson',
            progress: 92,
            currentGrade: 'A',
            attendance: 95,
            assignments: { completed: 9, total: 9 },
            nextClass: {
                date: 'Jun 26 at 10:30 AM',
                room: 'Lab 203'
            },
            status: 'Active',
            color: 'purple'
        },
        {
            id: 4,
            code: 'ENG205',
            name: 'English Literature',
            instructor: 'Dr. Amanda Clark',
            progress: 65,
            currentGrade: 'B',
            attendance: 87,
            assignments: { completed: 5, total: 8 },
            nextClass: {
                date: 'Jun 25 at 04:00 PM',
                room: 'Room 105'
            },
            status: 'Active',
            color: 'orange'
        },
        {
            id: 5,
            code: 'CS101',
            name: 'Computer Science Basics',
            instructor: 'Dr. Robert Kim',
            progress: 100,
            currentGrade: 'A+',
            attendance: 98,
            assignments: { completed: 12, total: 12 },
            nextClass: null,
            status: 'Completed',
            color: 'blue'
        },
        {
            id: 6,
            code: 'STAT201',
            name: 'Statistics & Probability',
            instructor: 'Dr. Lisa Zhang',
            progress: 45,
            currentGrade: 'B-',
            attendance: 82,
            assignments: { completed: 4, total: 9 },
            nextClass: {
                date: 'Jun 27 at 11:00 AM',
                room: 'Room 202'
            },
            status: 'Active',
            color: 'pink'
        }
    ];

    // Color mappings
    const colorClasses = {
        blue: {
            dot: 'bg-blue-500',
            progress: 'bg-blue-500',
            badge: 'bg-blue-50 text-blue-600'
        },
        green: {
            dot: 'bg-green-500',
            progress: 'bg-green-500',
            badge: 'bg-green-50 text-green-600'
        },
        purple: {
            dot: 'bg-purple-500',
            progress: 'bg-purple-500',
            badge: 'bg-purple-50 text-purple-600'
        },
        orange: {
            dot: 'bg-orange-500',
            progress: 'bg-orange-500',
            badge: 'bg-orange-50 text-orange-600'
        },
        pink: {
            dot: 'bg-pink-500',
            progress: 'bg-pink-500',
            badge: 'bg-pink-50 text-pink-600'
        }
    };

    // Filter courses based on active tab
    const filteredCourses = courses.filter(course => {
        const matchesTab =
            activeTab === 'all' ? true :
                activeTab === 'active' ? course.status === 'Active' :
                    activeTab === 'completed' ? course.status === 'Completed' : true;

        const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
                        <p className="text-gray-600">Manage your enrolled courses and track progress</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <span className="text-lg">+</span>
                            <span>Enroll Course</span>
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>View Schedule</span>
                        </button>
                    </div>
                </div>

                {/* Tabs and Search */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'all'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            All Courses
                        </button>
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'active'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'completed'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            Completed
                        </button>
                    </div>

                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                    >
                        {/* Course Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${colorClasses[course.color].dot}`}></div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{course.code}</h3>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                {course.status}
                            </span>
                        </div>

                        {/* Course Title */}
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h2>
                        <p className="text-sm text-gray-600 mb-4">{course.instructor}</p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className="text-sm font-semibold text-gray-900">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${colorClasses[course.color].progress}`}
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Grade and Attendance */}
                        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Current Grade</p>
                                <p className="text-2xl font-bold text-gray-900">{course.currentGrade}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Attendance</p>
                                <p className="text-2xl font-bold text-gray-900">{course.attendance}%</p>
                            </div>
                        </div>

                        {/* Assignments Progress */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Assignments</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {course.assignments.completed}/{course.assignments.total}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                {Array.from({ length: course.assignments.total }).map((_, index) => (
                                    <div
                                        key={index}
                                        className={`flex-1 h-2 rounded-full ${index < course.assignments.completed
                                                ? 'bg-green-500'
                                                : 'bg-gray-200'
                                            }`}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Next Class */}
                        {course.nextClass && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-4">
                                <div className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-blue-900 mb-1">Next Class:</p>
                                        <p className="text-sm text-blue-700">{course.nextClass.date} • {course.nextClass.room}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <span className="text-sm font-medium">View Details</span>
                            </button>
                            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Browse All Courses
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyCourses;
