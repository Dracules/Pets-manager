import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import { useNavigate } from 'react-router';

const AuthContext = createContext({
  token: null as string | null,
  login: (newToken: string) => {},
  logout: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<AuthState>({
    access_token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token'),
  });
  const navigate = useNavigate();

  const login = (newToken: FullJwtToken) => {
    updateToken(newToken);
    navigate('/my');
  };

  const updateToken = (newToken: FullJwtToken) => {
    localStorage.setItem('access_token', newToken.access_token);
    localStorage.setItem('refresh_token', newToken.refresh_token);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
    navigate('/login');
  };

  useEffect(() => {
    const onStorageChange = () => setToken(localStorage.getItem('jwtToken'));
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
