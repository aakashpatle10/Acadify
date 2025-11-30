import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // If authenticated but role not allowed, redirect to appropriate dashboard
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        // Redirect to user's own dashboard
        if (role === 'admin' || role === 'main_admin' || role === 'sub_admin') {
            return <Navigate to="/admin" replace />;
        } else if (role === 'teacher') {
            return <Navigate to="/teacher" replace />;
        } else if (role === 'student') {
            return <Navigate to="/student" replace />;
        }
        // If role unknown, logout and redirect to login
        return <Navigate to="/" replace />;
    }

    // User is authenticated and has correct role
    return children;
};

export default ProtectedRoute;
