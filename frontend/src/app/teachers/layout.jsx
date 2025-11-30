import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../component/Sidebar.jsx'
import Navbar from '../../component/Navbar.jsx'

const TeacherLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                userType="teacher"
            />

            {/* Main Content Area - Add left margin for fixed sidebar on desktop */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
                {/* Navbar */}
                <Navbar
                    toggleMobileMenu={toggleMobileMenu}
                    portalType="Teacher Portal"
                    userName="Dr. Johnson"
                />

                {/* Page Content - This is where child routes will render */}
                <main
                    id="main-scroll-container"
                    className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto"
                >
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default TeacherLayout
