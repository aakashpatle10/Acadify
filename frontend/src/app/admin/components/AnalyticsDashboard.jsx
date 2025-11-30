import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BsGraphUp, BsPeople, BsCalendar3, BsTrophy } from 'react-icons/bs';

const AnalyticsDashboard = () => {
    const [overview, setOverview] = useState(null);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('weekly');

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // Fetch overview
            const overviewRes = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/attendance/overview`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const overviewData = await overviewRes.json();
            setOverview(overviewData.data);

            // Fetch trends
            const trendsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/attendance/trends?period=${period}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const trendsData = await trendsRes.json();
            setTrends(trendsData.data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#3B82F6', '#EF4444', '#F59E0B'];

    const pieData = overview ? [
        { name: 'Present', value: overview.totalPresent },
        { name: 'Absent', value: overview.totalAbsent },
        { name: 'Late', value: overview.totalLate }
    ] : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <BsGraphUp className="text-blue-600" />
                    Analytics Dashboard
                </h1>
                <p className="text-gray-500 mt-1">Comprehensive insights into attendance and performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Overall Attendance</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{overview?.overallPercentage}%</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <BsTrophy className="text-2xl text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{overview?.totalSessions}</h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <BsCalendar3 className="text-2xl text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Present</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{overview?.totalPresent}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <BsPeople className="text-2xl text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Absent</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{overview?.totalAbsent}</h3>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                            <BsPeople className="text-2xl text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Attendance Trends */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Attendance Trends</h2>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="totalPresent" stroke="#3B82F6" name="Present" strokeWidth={2} />
                            <Line type="monotone" dataKey="totalAbsent" stroke="#EF4444" name="Absent" strokeWidth={2} />
                            <Line type="monotone" dataKey="totalLate" stroke="#F59E0B" name="Late" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Attendance Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Attendance Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Breakdown Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Detailed Breakdown</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalPresent" fill="#3B82F6" name="Present" />
                        <Bar dataKey="totalAbsent" fill="#EF4444" name="Absent" />
                        <Bar dataKey="totalLate" fill="#F59E0B" name="Late" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
