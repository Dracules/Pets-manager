import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import {
  isTokenExpired,
  useAuth,
} from '../../domains/login/context/AuthContext';
import LoadingComponent from '../ui/LoadingComponent';
import styles from './css/ProtectedRoute.module.css';
import { ROUTES } from './constants/routes';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, refresh, logout, isRefreshing } = useAuth();
  const location = useLocation();

  const hasNoToken = !token.access_token;
  const isExpired = hasNoToken ? true : isTokenExpired(token.access_token);

  useEffect(() => {
    if (isExpired && !isRefreshing) {
      refresh().catch(() => {
        logout(true);
      });
    }
  }, [location.pathname, isExpired, isRefreshing, refresh, logout]);

  if (hasNoToken && !isRefreshing) {
    return (
      <Navigate to={ROUTES.LOGIN} state={{ isJwtExpired: true }} replace />
    );
  }

  if (isExpired || isRefreshing) {
    return <LoadingComponent />;
  }

  return <>{children}</>;
}
