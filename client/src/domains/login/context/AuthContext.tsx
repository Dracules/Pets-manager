import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import { useNavigate } from 'react-router';
import { AuthState, FullJwtToken } from '../model/jwtToken.interface';

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
  const [token, setToken] = useState<AuthState>({
    access_token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token'),
  });
  const navigate = useNavigate();

  const login = (newToken: FullJwtToken) => {
    updateToken(newToken);
    navigate('/my/');
  };

  const updateToken = (newToken: FullJwtToken) => {
    localStorage.setItem('access_token', newToken.access_token);
    localStorage.setItem('refresh_token', newToken.refresh_token);
    setToken(newToken);
  };

  const getTokenStorage = () => {
    return {
      access_token: localStorage.getItem('access_token'),
      refresh_token: localStorage.getItem('refresh_token'),
    } as AuthState;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken({ access_token: null, refresh_token: null });

    navigate('/login');
  };

  useEffect(() => {
    const onStorageChange = () =>
      setToken({
        access_token: localStorage.getItem('access_token'),
        refresh_token: localStorage.getItem('refresh_token'),
      });
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, login, logout, updateToken, getTokenStorage }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
