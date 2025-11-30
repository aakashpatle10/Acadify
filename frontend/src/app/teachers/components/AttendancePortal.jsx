import React, { useState } from 'react'
import { BsCalendar4, BsClockFill, BsPeople, BsGraphUp } from 'react-icons/bs'
import { FaUserCheck, FaUserClock, FaChalkboardTeacher } from 'react-icons/fa'

const AttendancePortal = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const stats = [
    { title: "Total Present", value: "85%", icon: <FaUserCheck />, color: "blue" },
    { title: "Total Absent", value: "15%", icon: <FaUserClock />, color: "red" },
    { title: "Total Students", value: "120", icon: <BsPeople />, color: "green" },
    { title: "Total Classes", value: "8", icon: <FaChalkboardTeacher />, color: "purple" }
  ];

  const todayClasses = [
    {
      className: "Advanced Mathematics",
      time: "09:00 AM - 10:30 AM",
      location: "Room 301",
      totalStudents: "32",
      presentStudents: "28",
      status: "completed"
    },
    {
      className: "Physics Lab",
      time: "11:00 AM - 12:30 PM",
      location: "Lab 102",
      totalStudents: "28",
      presentStudents: "25",
      status: "ongoing"
    },
    {
      className: "Computer Science",
      time: "02:00 PM - 03:30 PM",
      location: "Room 205",
      totalStudents: "30",
      presentStudents: "0",
      status: "upcoming"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Attendance Portal</h1>
              <p className="text-gray-500 mt-1">Track and manage attendance for all classes</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">{stat.title}</h3>
                  <div className="flex justify-between items-end">
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className={`text-${stat.color}-500 bg-${stat.color}-50 p-2 rounded-lg text-xl`}>{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Classes */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Today's Classes</h2>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All Classes</button>
                  </div>
                  <div className="space-y-4">
                    {todayClasses.map((classItem, index) => (
                      <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{classItem.className}</h3>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{classItem.time}</span>
                            <span>•</span>
                            <span>{classItem.location}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm text-gray-600">Present: {classItem.presentStudents}/{classItem.totalStudents}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${classItem.status === 'completed' ? 'bg-green-100 text-green-700' :
                                classItem.status === 'ongoing' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                                  'bg-gray-100 text-gray-700'
                              }`}>
                              {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto">
                          {classItem.status === "ongoing" && (
                            <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                              Mark Attendance
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Attendance Overview */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Attendance Overview</h2>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View Details</button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-4">This Week's Overview</h3>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center text-lg font-bold text-gray-900 mb-2">90%</div>
                          <span className="text-xs text-gray-500">Monday</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center text-lg font-bold text-gray-900 mb-2">85%</div>
                          <span className="text-xs text-gray-500">Tuesday</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full border-4 border-purple-500 flex items-center justify-center text-lg font-bold text-gray-900 mb-2">88%</div>
                          <span className="text-xs text-gray-500">Wednesday</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AttendancePortal