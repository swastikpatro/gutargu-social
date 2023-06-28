import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const token = useSelector((store) => store.auth.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }
  return children;
};

export default ProtectedRoute;
