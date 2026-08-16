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
import { AuthState, FullJwtToken } from '../model/jwtToken.interface';
import { setApiAuth } from '../../../shared/api/axiosApi';

const AuthContext = createContext({
  token: { access_token: null, refresh_token: null } as AuthState,
  login: (newToken: FullJwtToken) => {},
  updateToken: (newToken: FullJwtToken) => {},
  logout: () => {},
  getTokenStorage: () => {
    return {
      access_token: null,
      refresh_token: null,
    } as AuthState;
  },
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<AuthState>(() => ({
    access_token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token'),
  }));
  const navigate = useNavigate();

  const updateToken = useCallback((newToken: FullJwtToken) => {
    localStorage.setItem('access_token', newToken.access_token);
    localStorage.setItem('refresh_token', newToken.refresh_token);
    setToken(newToken);
  }, []);

  const login = useCallback((newToken: FullJwtToken) => {
    updateToken(newToken);
    navigate('/my/');
  }, []);

  const getTokenStorage = useCallback(() => {
    return {
      access_token: localStorage.getItem('access_token'),
      refresh_token: localStorage.getItem('refresh_token'),
    } as AuthState;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken({ access_token: null, refresh_token: null });

    navigate('/login');
  }, []);

  useEffect(() => {
    setApiAuth(getTokenStorage, logout, updateToken);
  }, [getTokenStorage, logout, updateToken]);

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
      updateToken,
      getTokenStorage,
    }),
    [token, login, logout, updateToken, getTokenStorage],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
