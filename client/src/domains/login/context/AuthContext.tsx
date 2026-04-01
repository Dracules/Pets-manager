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
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  const navigate = useNavigate();

  const login = (newToken: string) => {
    localStorage.setItem('jwtToken', newToken);
    setToken(newToken);
    navigate('/my');
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
