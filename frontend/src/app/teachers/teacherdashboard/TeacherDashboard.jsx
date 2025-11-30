import React, { useState } from 'react';
import { BsCalendar4, BsClockFill, BsPeople, BsGraphUp } from 'react-icons/bs';
import { MdOutlineAssignment, MdMessage } from 'react-icons/md';
import { FaChalkboardTeacher } from 'react-icons/fa';
import AttendanceOverlay from '../components/AttendanceOverlay.jsx';

const TeacherDashboard = () => {
  const [showAttendance, setShowAttendance] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const handleAttendanceClick = (classItem) => {
    setSelectedClass(classItem);
    setShowAttendance(true);
  };

  const stats = [
    { title: "Average Attendance", value: "87%", icon: <BsGraphUp />, color: "blue" },
    { title: "Total Students", value: "115", icon: <BsPeople />, color: "green" },
    { title: "Classes This Month", value: "24", icon: <FaChalkboardTeacher />, color: "purple" },
    { title: "Pending Grading", value: "12", icon: <MdOutlineAssignment />, color: "orange" }
  ];

  const todaysClasses = [
    {
      title: "Advanced Mathematics",
      time: "9:00 AM - 10:30 AM",
      room: "Room 301",
      students: "28 students",
      attendance: "85%",
      status: "completed"
    },
    {
      title: "Calculus I",
      time: "11:00 AM - 12:30 PM",
      room: "Room 205",
      students: "32 students",
      attendance: "90%",
      status: "ongoing"
    },
    {
      title: "Statistics",
      time: "2:00 PM - 3:30 PM",
      room: "Room 103",
      students: "25 students",
      attendance: "0%",
      status: "upcoming"
    },
    {
      title: "Linear Algebra",
      time: "4:00 PM - 5:30 PM",
      room: "Room 102",
      students: "30 students",
      attendance: "0%",
      status: "upcoming"
    }
  ];

  const quickActions = [
    { title: "Take Attendance", icon: <BsCalendar4 />, color: "text-blue-500" },
    { title: "Schedule Class", icon: <BsClockFill />, color: "text-green-500" },
    { title: "Create Assignment", icon: <MdOutlineAssignment />, color: "text-purple-500" },
    { title: "View Reports", icon: <BsGraphUp />, color: "text-orange-500" },
    { title: "Substitution", icon: <FaChalkboardTeacher />, color: "text-blue-500" },
    { title: "Message Students", icon: <MdMessage />, color: "text-purple-500" }
  ];

  return (
    <>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, Dr. Johnson!</h1>
        <p className="text-gray-500 mt-1">Here's your teaching overview for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <h2 className="text-3xl font-bold text-gray-900">{stat.value}</h2>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-500 text-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Today's Classes</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View Schedule</button>
          </div>
          <div className="space-y-4">
            {todaysClasses.map((classItem, index) => (
              <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{classItem.title}</h3>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{classItem.time}</span>
                      <span>•</span>
                      <span>{classItem.room}</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-3 mt-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{classItem.students}</span>
                      <span className="text-xs">Attendance: {classItem.attendance}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${classItem.status === 'completed' ? 'bg-green-100 text-green-700' :
                      classItem.status === 'ongoing' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                      {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                    </span>
                    {classItem.status === "ongoing" && (
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto"
                        onClick={() => handleAttendanceClick(classItem)}
                      >
                        Take Attendance
                      </button>
                    )}
                    {classItem.status === "upcoming" && (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto">
                        Start Class
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Overlay */}
        <AttendanceOverlay
          isOpen={showAttendance}
          onClose={() => setShowAttendance(false)}
          classInfo={selectedClass || {}}
        />

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3 text-center h-32 group">
                <span className={`text-2xl ${action.color} group-hover:scale-110 transition-transform`}>{action.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{action.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Attendance & Notifications Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Attendance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Attendance</h2>
          <div className="space-y-4">
            {/* Advanced Mathematics */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <h3 className="font-semibold text-gray-900">Advanced Mathematics</h3>
                <p className="text-sm text-gray-500">Today</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900">24/28</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  85%
                </span>
              </div>
            </div>

            {/* Calculus I */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <h3 className="font-semibold text-gray-900">Calculus I</h3>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900">29/32</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  90%
                </span>
              </div>
            </div>

            {/* Statistics */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <h3 className="font-semibold text-gray-900">Statistics</h3>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900">22/25</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  88%
                </span>
              </div>
            </div>

            {/* Linear Algebra */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <h3 className="font-semibold text-gray-900">Linear Algebra</h3>
                <p className="text-sm text-gray-500">2 days ago</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900">28/30</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  93%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Notifications</h2>
          <div className="space-y-4">
            {/* Room change notification */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">
                  Room change: Statistics class moved to Room 205
                </p>
                <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
              </div>
            </div>

            {/* Substitution request */}
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">
                  Substitution request approved for tomorrow
                </p>
                <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
              </div>
            </div>

            {/* Assignments pending */}
            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">
                  12 assignments pending review
                </p>
                <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
              </div>
            </div>

            {/* New student enrolled */}
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">
                  New student enrolled in Calculus I
                </p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>

          {/* View All Link */}
          <div className="mt-6 text-center">
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;