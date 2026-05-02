import { Navigate } from 'react-router-dom';
import { useAuth } from '../authContext';

export const RoleGuard = ({ allowed, children }: { allowed: Array<'admin' | 'user'>; children: JSX.Element }) => {
  const { user } = useAuth();

  if (!user || !allowed.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
