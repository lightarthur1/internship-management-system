import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const DashboardRedirect = () => {
    const { user } = useAuth();

    // If no user exists, redirect immediately to login
    if (!user) return <Navigate to="/login" replace />;

    // Redirect based on the user's role
    switch (user.role) {
        case 'admin': return <Navigate to="/admin" replace />;
        case 'academic-supervisor': return <Navigate to="/academic-supervisor" replace />;
        case 'workplace-supervisor': return <Navigate to="/workplace-supervisor" replace />;
        case 'student': return <Navigate to="/student" replace />;
        default: return <Navigate to="/login" replace />;
    }
};

export default DashboardRedirect;