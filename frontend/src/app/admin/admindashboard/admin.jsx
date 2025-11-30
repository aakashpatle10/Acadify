import React from 'react';

const AdminDashboard = () => {
    // Stats data
    const statsCards = [
        {
            icon: '👥',
            value: '2,847',
            label: 'Total Students',
            color: 'bg-blue-500',
            iconBg: 'bg-blue-400'
        },
        {
            icon: '👨‍🏫',
            value: '156',
            label: 'Faculty Members',
            color: 'bg-green-500',
            iconBg: 'bg-green-400'
        },
        {
            icon: '📖',
            value: '89',
            label: 'Active Classes',
            color: 'bg-purple-500',
            iconBg: 'bg-purple-400'
        },
        {
            icon: '📊',
            value: '87%',
            label: 'Avg Attendance',
            color: 'bg-orange-500',
            iconBg: 'bg-orange-400'
        },
        {
            icon: '📈',
            value: '+5.2%',
            label: 'Monthly Growth',
            color: 'bg-indigo-500',
            iconBg: 'bg-indigo-400'
        }
    ];

    // Department data
    const departments = [
        {
            name: 'Computer Science',
            students: 456,
            faculty: 28,
            courses: 15,
            attendance: '91%',
            attendanceColor: 'text-green-600',
            attendanceBg: 'bg-green-50'
        },
        {
            name: 'Mathematics',
            students: 389,
            faculty: 22,
            courses: 12,
            attendance: '89%',
            attendanceColor: 'text-yellow-600',
            attendanceBg: 'bg-yellow-50'
        },
        {
            name: 'Physics',
            students: 312,
            faculty: 18,
            courses: 10,
            attendance: '85%',
            attendanceColor: 'text-yellow-600',
            attendanceBg: 'bg-yellow-50'
        },
        {
            name: 'Chemistry',
            students: 298,
            faculty: 19,
            courses: 11,
            attendance: '88%',
            attendanceColor: 'text-yellow-600',
            attendanceBg: 'bg-yellow-50'
        },
        {
            name: 'English',
            students: 421,
            faculty: 25,
            courses: 14,
            attendance: '92%',
            attendanceColor: 'text-green-600',
            attendanceBg: 'bg-green-50'
        }
    ];

    // System health data
    const systemHealth = [
        {
            icon: '🖥️',
            name: 'Server Uptime',
            status: '99.8%',
            statusText: 'excellent',
            statusColor: 'text-green-600',
            iconBg: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            icon: '💾',
            name: 'Database Performance',
            status: '95%',
            statusText: 'good',
            statusColor: 'text-blue-600',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            icon: '🔒',
            name: 'Authentication System',
            status: '100%',
            statusText: 'excellent',
            statusColor: 'text-green-600',
            iconBg: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            icon: '📱',
            name: 'Mobile App Sync',
            status: '88%',
            statusText: 'good',
            statusColor: 'text-blue-600',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600'
        }
    ];

    // Top performing classes
    const topClasses = [
        {
            rank: 1,
            name: 'Advanced AI & ML',
            instructor: 'Dr. Sarah Chen',
            score: '96%',
            rating: '★4.9',
            rankColor: 'bg-yellow-500'
        },
        {
            rank: 2,
            name: 'Quantum Physics',
            instructor: 'Prof. Michael Brown',
            score: '94%',
            rating: '★4.8',
            rankColor: 'bg-gray-400'
        },
        {
            rank: 3,
            name: 'Data Structures',
            instructor: 'Dr. Emily Johnson',
            score: '93%',
            rating: '★4.7',
            rankColor: 'bg-orange-500'
        },
        {
            rank: 4,
            name: 'Organic Chemistry',
            instructor: 'Dr. Robert Wilson',
            score: '91%',
            rating: '★4.6',
            rankColor: 'bg-blue-500'
        }
    ];

    // Recent activities
    const recentActivities = [
        {
            icon: '👥',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            text: '45 new students enrolled this week',
            time: '2 hours ago'
        },
        {
            icon: '💾',
            iconBg: 'bg-green-50',
            iconColor: 'text-green-600',
            text: 'Database backup completed successfully',
            time: '4 hours ago'
        },
        {
            icon: '📊',
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600',
            text: 'Peak attendance rate of 94% achieved',
            time: '6 hours ago'
        },
        {
            icon: '🔒',
            iconBg: 'bg-orange-50',
            iconColor: 'text-orange-600',
            text: 'Security scan completed - no threats found',
            time: '8 hours ago'
        }
    ];

    // Admin controls
    const adminControls = [
        {
            icon: '👥',
            label: 'Manage Users',
            iconColor: 'text-blue-600'
        },
        {
            icon: '📅',
            label: 'Schedule Classes',
            iconColor: 'text-green-600'
        },
        {
            icon: '📊',
            label: 'Analytics',
            iconColor: 'text-purple-600'
        },
        {
            icon: '⚙️',
            label: 'System Config',
            iconColor: 'text-orange-600'
        },
        {
            icon: '💾',
            label: 'Database',
            iconColor: 'text-red-600'
        },
        {
            icon: '🛡️',
            label: 'Security',
            iconColor: 'text-indigo-600'
        },
        {
            icon: '📄',
            label: 'Export Data',
            iconColor: 'text-pink-600'
        },
        {
            icon: '🔔',
            label: 'Notifications',
            iconColor: 'text-teal-600'
        }
    ];

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Institution Analytics Dashboard</h1>
                <p className="text-gray-600">Comprehensive overview of your educational institution</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-6 lg:mb-8">
                {statsCards.map((stat, index) => (
                    <div
                        key={index}
                        className={`${stat.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
                    >
                        <div className={`${stat.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm opacity-90">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Department Analytics & System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
                {/* Department Analytics */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Department Analytics</h2>
                        <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-4">
                        {departments.map((dept, index) => (
                            <div key={index} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                                    <span className={`${dept.attendanceBg} ${dept.attendanceColor} px-3 py-1 rounded-full text-sm font-medium`}>
                                        {dept.attendance} attendance
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <span>👥</span>
                                        <span>{dept.students} students</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>👨‍🏫</span>
                                        <span>{dept.faculty} faculty</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>📚</span>
                                        <span>{dept.courses} courses</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">System Health</h2>
                    <div className="space-y-4">
                        {systemHealth.map((system, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`${system.iconBg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                                        <span className="text-2xl">{system.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{system.name}</h3>
                                        <p className="text-sm text-gray-600">System performance</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${system.statusColor}`}>{system.status}</div>
                                    <div className="text-sm text-gray-500">{system.statusText}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Performing Classes & Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
                {/* Top Performing Classes */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Classes</h2>
                    <div className="space-y-4">
                        {topClasses.map((classItem, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                                <div className={`${classItem.rankColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold`}>
                                    {classItem.rank}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{classItem.name}</h3>
                                    <p className="text-sm text-gray-600">{classItem.instructor}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-blue-600 font-semibold">{classItem.score}</div>
                                    <div className="text-sm text-yellow-500">{classItem.rating}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                                <div className={`${activity.iconBg} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    <span className={`text-xl ${activity.iconColor}`}>{activity.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-900 font-medium">{activity.text}</p>
                                    <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Admin Controls */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Controls</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {adminControls.map((control, index) => (
                        <button
                            key={index}
                            className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group"
                        >
                            <span className={`text-4xl mb-3 ${control.iconColor} group-hover:scale-110 transition-transform duration-200`}>
                                {control.icon}
                            </span>
                            <span className="text-sm font-medium text-gray-700 text-center">{control.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
