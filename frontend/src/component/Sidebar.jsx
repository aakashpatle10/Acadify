import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import assignments from '../app/students/components/assigment.jsx';

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen, userType = "student" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };

  const teacherMenuItems = [
    { icon: "⌂", text: "Dashboard", path: "/teacher" },
    { icon: "📋", text: "Attendance", path: "/teacher/attendance" },
    { icon: "📊", text: "Analytics", path: "/teacher/analytics" }
  ];

  const adminMenuItems = [
    { icon: "⌂", text: "Dashboard", path: "/admin" },
    { icon: "📋", text: "Attendance", path: "/admin/attendance" },
    { icon: "📊", text: "Analytics", path: "/admin/analytics" },
    { icon: "👥", text: "User Management", path: "/admin/users" },
    { icon: "⚙️", text: "System", path: "/admin/system" }
  ];

  const studentMenuItems = [
    { icon: "⌂", text: "Dashboard", path: "/student" },
    {icon:"",text:"Check in",path:"/student/checkin"},
    { icon: "📚", text: "My Courses", path: "/student/courses" },
    { icon: "📝", text: "Assignments", path: "/student/assignments" }
  ];

  const menuItems = userType === "admin" ? adminMenuItems : userType === "teacher" ? teacherMenuItems : studentMenuItems;

  // Handle scroll to prevent propagation to main page
  const handleWheel = (e) => {
    const element = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = element;
    const atTop = scrollTop === 0;
    const atBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

    // If scrolling up at top or down at bottom, prevent default to stop momentum
    if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
      e.preventDefault();
    }

    // Always stop propagation to prevent main page scroll
    e.stopPropagation();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed overflow: hidden inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar - Fixed position so it doesn't scroll with page */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform lg:transform-none transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-bold text-gray-900">Acadify</span>
          </div>
          <button
            className="lg:hidden text-2xl text-gray-500 hover:text-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ×
          </button>
        </div>

        {/* Navigation - Using inline style for guaranteed scroll containment */}
        <nav
          className="flex-1 flex flex-col justify-between p-4 overflow-y-auto"
          style={{ overscrollBehavior: 'contain' }}
          onWheel={handleWheel}
        >
          {/* Menu Items */}
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.text}
              </Link>
            ))}
          </div>

          {/* Logout Button - Working */}
          <div className="mt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <span className="text-xl">⇥</span>
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
