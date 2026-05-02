import { Navigate, useLocation } from 'react-router-dom';
import { authStorage } from '../auth';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = authStorage.getToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};
