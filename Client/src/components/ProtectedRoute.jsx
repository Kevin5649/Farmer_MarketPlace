import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirect to login if not authenticated
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'farmer') return <Navigate to="/farmer" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
