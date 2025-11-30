import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaGraduationCap, FaEnvelope, FaLock, FaUser, FaChalkboardTeacher, FaShieldAlt, FaIdCard } from 'react-icons/fa'
import { useLoginForm } from './hooks/personal/useLoginForm'
import { USER_ROLES } from '../../../types'

const Login = () => {
    const navigate = useNavigate();
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    const [authMethod, setAuthMethod] = useState('email');

    const {
        formData,
        selectedRole,
        error,
        isLoading,
        handleInputChange,
        handleRoleChange,
        handleSubmit,
    } = useLoginForm();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && role) {
            if (role === 'admin' || role === 'main_admin' || role === 'sub_admin') {
                navigate('/admin', { replace: true });
            } else if (role === 'teacher') {
                navigate('/teacher', { replace: true });
            } else if (role === 'student') {
                navigate('/student', { replace: true });
            }
        }
    }, [isAuthenticated, role, navigate]);

    const roles = [
        { id: USER_ROLES.STUDENT, label: 'Student', icon: FaUser },
        { id: USER_ROLES.TEACHER, label: 'Teacher', icon: FaChalkboardTeacher },
        { id: USER_ROLES.ADMIN, label: 'Admin', icon: FaShieldAlt }
    ]

    const handleOAuthLogin = () => {
        alert('OAuth 2.0 authentication coming soon!');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-3">
            <div className="w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg mb-2 transform hover:scale-105 transition-transform duration-300">
                        <FaGraduationCap className="text-white text-2xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'cursive' }}>
                        Acadify
                    </h1>
                    <p className="text-xs text-gray-600 font-medium">Smart Curriculum & Attendance System</p>
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-0.5">
                        <FaShieldAlt className="text-xs" />
                        <span>OAuth2.0 + JWT Secured</span>
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-xl shadow-xl p-4 backdrop-blur-sm">
                    {/* Role Selection */}
                    <div className="mb-3">
                        <h2 className="text-gray-700 font-semibold mb-2 text-sm">Select Your Role</h2>
                        <div className="grid grid-cols-3 gap-2">
                            {roles.map((role) => {
                                const Icon = role.icon
                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => handleRoleChange(role.id)}
                                        type="button"
                                        className={`flex flex-col items-center justify-center p-2.5 rounded-lg border-2 transition-all duration-300 ${selectedRole === role.id
                                            ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                                            : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                                            }`}
                                    >
                                        <Icon className="text-lg mb-1" />
                                        <span className="text-xs font-medium">{role.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Authentication Method */}
                    <div className="mb-3">
                        <h2 className="text-gray-700 font-semibold mb-2 text-sm">Authentication Method</h2>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setAuthMethod('email')}
                                type="button"
                                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border-2 transition-all duration-300 ${authMethod === 'email'
                                    ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                                    }`}
                            >
                                <FaEnvelope className="text-base mb-1" />
                                <span className="text-xs font-medium">Email/Password</span>
                            </button>
                            <button
                                onClick={() => setAuthMethod('oauth')}
                                type="button"
                                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border-2 transition-all duration-300 ${authMethod === 'oauth'
                                    ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                                    }`}
                            >
                                <FaShieldAlt className="text-base mb-1" />
                                <span className="text-xs font-medium">OAuth 2.0</span>
                            </button>
                        </div>
                    </div>

                    {/* Login Form or OAuth Button */}
                    {authMethod === 'email' ? (
                        <form onSubmit={handleSubmit}>
                            {/* Error Message */}
                            {error && (
                                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-xs text-red-600 font-medium">{error}</p>
                                </div>
                            )}

                            {/* Email or Enrollment Number Input */}
                            <div className="mb-3">
                                <label className="block text-gray-700 font-medium mb-1.5 text-xs">
                                    {selectedRole === USER_ROLES.STUDENT ? 'Enrollment Number' : 'Email Address'}
                                </label>
                                <div className="relative">
                                    {selectedRole === USER_ROLES.STUDENT ? (
                                        <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                    ) : (
                                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                    )}
                                    <input
                                        type={selectedRole === USER_ROLES.STUDENT ? 'text' : 'email'}
                                        name={selectedRole === USER_ROLES.STUDENT ? 'enrollmentNumber' : 'email'}
                                        value={selectedRole === USER_ROLES.STUDENT ? formData.enrollmentNumber : formData.email}
                                        onChange={handleInputChange}
                                        placeholder={selectedRole === USER_ROLES.STUDENT ? 'Enter your enrollment number' : 'Enter your institutional email'}
                                        className="w-full pl-10 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors duration-300 text-gray-700"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="mb-3">
                                <label className="block text-gray-700 font-medium mb-1.5 text-xs">
                                    Password
                                </label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                        className="w-full pl-10 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors duration-300 text-gray-700"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2.5 text-sm rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${isLoading
                                        ? 'opacity-70 cursor-not-allowed'
                                        : 'hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Logging in...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaShieldAlt className="text-sm" />
                                        <span>Secure Login as {roles.find(r => r.id === selectedRole)?.label}</span>
                                    </>
                                )}
                            </button>

                            {/* Forgot Password */}
                            <div className="text-center mt-2">
                                <a href="#" className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:underline">
                                    Forgot your password?
                                </a>
                            </div>

                            {/* Security Note */}
                            <div className="text-center mt-2">
                                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                    <FaLock className="text-xs" />
                                    <span>End-to-end encrypted with JWT tokens</span>
                                </p>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <button
                                onClick={handleOAuthLogin}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2.5 text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                <FaShieldAlt className="text-sm" />
                                <span>Login with OAuth 2.0 as {roles.find(r => r.id === selectedRole)?.label}</span>
                            </button>

                            <div className="text-center mt-3">
                                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                    <FaLock className="text-xs" />
                                    <span>Secure authentication via OAuth 2.0 protocol</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Security Note */}
                <div className="text-center mt-3">
                    <p className="text-xs text-gray-600">
                        Protected by advanced security protocols including OAuth2.0 and JWT tokens
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login