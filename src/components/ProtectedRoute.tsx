import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/store-hooks';

interface ProtectedRoutePropType {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRoutePropType) => {
  const token = useAppSelector((store) => store.auth.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }
  return children;
};

export default ProtectedRoute;
