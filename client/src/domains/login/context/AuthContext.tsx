import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
  useMemo,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router';
import type { AuthState, FullJwtToken } from '../model/jwtToken.interface';
import { setApiAuth } from '../../../shared/api/axiosApi';
import Auth from '../../../shared/api/authApi';
import { ROUTES } from '../../../shared/routes/constants/routes';

/* eslint-disable @typescript-eslint/no-unused-vars */
const AuthContext = createContext({
  token: { access_token: null, refresh_token: null } as AuthState,
  login: (newToken: FullJwtToken) => {},
  logout: (isJwtExpired?: boolean) => {},
});

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]!)) as { exp: number };
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<AuthState>(() => {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');

    if (isTokenExpired(access)) {
      if (!isTokenExpired(refresh)) {
        localStorage.removeItem('access_token');
        return { access_token: null, refresh_token: refresh };
      }
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return { access_token: null, refresh_token: null };
    }

    return { access_token: access, refresh_token: refresh };
  });
  const navigate = useNavigate();

  const updateToken = useCallback((newToken: FullJwtToken) => {
    localStorage.setItem('access_token', newToken.access_token);
    localStorage.setItem('refresh_token', newToken.refresh_token);
    setToken(newToken);
  }, []);

  const login = useCallback((newToken: FullJwtToken) => {
    updateToken(newToken);
    void navigate(ROUTES.MY);
  }, []);

  const getTokenStorage = useCallback(() => {
    return {
      access_token: localStorage.getItem('access_token'),
      refresh_token: localStorage.getItem('refresh_token'),
    } as AuthState;
  }, []);

  const logout = useCallback((isJwtExpired: boolean = false) => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken({ access_token: null, refresh_token: null });

    void navigate(
      ROUTES.LOGIN,
      isJwtExpired
        ? {
            state: { isJwtExpired: true },
          }
        : {},
    );
  }, []);

  const refresh = useCallback(async () => {
    const tokens = getTokenStorage();
    if (!tokens.refresh_token) {
      throw new Error('Error: No refresh token');
    }
    return await Auth.refresh(tokens.refresh_token);
  }, []);

  useEffect(() => {
    setApiAuth({
      getToken: getTokenStorage,
      handleLogout: logout,
      updateToken: updateToken,
      refreshToken: refresh,
    });
  }, [getTokenStorage, logout, updateToken, refresh]);

  useEffect(() => {
    const onStorageChange = () =>
      setToken({
        access_token: localStorage.getItem('access_token'),
        refresh_token: localStorage.getItem('refresh_token'),
      });
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
    }),
    [token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
