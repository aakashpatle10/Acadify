import React, { useState } from 'react'
import { } from 'react-router-dom'
import assigment from '../components/assigment.jsx'
import QrScanner from '../components/QrScanner.jsx'
import { BsQrCodeScan } from 'react-icons/bs'

const StudentDashboard = () => {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Good Morning, Sarah!</h1>
            <p className="text-gray-500 mt-1">Here's your learning overview for today</p>
          </div>
          <button
            onClick={() => setShowScanner(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <BsQrCodeScan className="text-xl" />
            <span className="hidden sm:inline">Mark Attendance</span>
          </button>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QrScanner isOpen={showScanner} onClose={() => setShowScanner(false)} />

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Overall Attendance</h3>
          <div className="flex justify-between items-end">
            <div className="text-3xl font-bold text-gray-900">87%</div>
            <div className="text-green-500 bg-green-50 p-2 rounded-lg">✓</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Credits Earned</h3>
          <div className="flex justify-between items-end">
            <div className="text-3xl font-bold text-gray-900">24</div>
            <div className="text-blue-500 bg-blue-50 p-2 rounded-lg">◷</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Active Courses</h3>
          <div className="flex justify-between items-end">
            <div className="text-3xl font-bold text-gray-900">8</div>
            <div className="text-purple-500 bg-purple-50 p-2 rounded-lg">▤</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Assignments Due</h3>
          <div className="flex justify-between items-end">
            <div className="text-3xl font-bold text-gray-900">3</div>
            <div className="text-orange-500 bg-orange-50 p-2 rounded-lg">📝</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-24 flex-shrink-0">
                  <div className="text-sm font-semibold text-gray-900">10:00 AM</div>
                  <div className="text-xs text-gray-500">Room 201</div>
                </div>
                <div className="flex-1 border-l-2 border-blue-500 pl-4 ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Mathematics</h3>
                  <div className="text-xs text-blue-600 mt-1 font-medium">Upcoming</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-24 flex-shrink-0">
                  <div className="text-sm font-semibold text-gray-900">12:00 PM</div>
                  <div className="text-xs text-gray-500">Lab 101</div>
                </div>
                <div className="flex-1 border-l-2 border-blue-500 pl-4 ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Physics</h3>
                  <div className="text-xs text-blue-600 mt-1 font-medium">Upcoming</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="w-24 flex-shrink-0">
                  <div className="text-sm font-semibold text-gray-900">2:30 PM</div>
                  <div className="text-xs text-gray-500">Lab 203</div>
                </div>
                <div className="flex-1 border-l-2 border-red-500 pl-4 ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Chemistry</h3>
                  <div className="text-xs text-red-600 mt-1 font-medium animate-pulse">Live</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-24 flex-shrink-0">
                  <div className="text-sm font-semibold text-gray-900">4:00 PM</div>
                  <div className="text-xs text-gray-500">Room 105</div>
                </div>
                <div className="flex-1 border-l-2 border-blue-500 pl-4 ml-4">
                  <h3 className="text-sm font-medium text-gray-900">English Literature</h3>
                  <div className="text-xs text-blue-600 mt-1 font-medium">Upcoming</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* AI Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">AI Recommendations</h2>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">More</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 group-hover:bg-blue-200">🔵</div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Python Workshop</h3>
                  <p className="text-xs text-gray-500">2 hours • Beginner</p>
                </div>
                <div className="text-gray-400 group-hover:text-blue-600">→</div>
              </div>
              <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3 group-hover:bg-purple-200">🔷</div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Digital Marketing</h3>
                  <p className="text-xs text-gray-500">4 weeks • Intermediate</p>
                </div>
                <div className="text-gray-400 group-hover:text-purple-600">→</div>
              </div>
              <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 group-hover:bg-green-200">📊</div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Data Science</h3>
                  <p className="text-xs text-gray-500">3 weeks • Advanced</p>
                </div>
                <div className="text-gray-400 group-hover:text-green-600">→</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Attendance Overview</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center text-xl font-bold text-gray-900 mb-2">87%</div>
              <p className="text-sm text-gray-500">Overall</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center text-xl font-bold text-gray-900 mb-2">95%</div>
              <p className="text-sm text-gray-500">This Week</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-purple-500 flex items-center justify-center text-xl font-bold text-gray-900 mb-2">89%</div>
              <p className="text-sm text-gray-500">This Month</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="text-blue-500 mt-1">•</div>
              <div>
                <p className="text-sm text-gray-900">Physics Class moved to Lab 102</p>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="text-orange-500 mt-1">•</div>
              <div>
                <p className="text-sm text-gray-900">New assignment uploaded in Mathematics</p>
                <span className="text-xs text-gray-500">4 hours ago</span>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="text-green-500 mt-1">•</div>
              <div>
                <p className="text-sm text-gray-900">Workshop registration now open</p>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard