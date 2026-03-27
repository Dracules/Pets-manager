import { Link } from 'react-router';
import { useAuth } from '../../domains/login/context/AuthContext';
import { setApiAuth } from '../api/axiosApi';

export function Header() {
  const { token, logout } = useAuth();
  setApiAuth(() => token, logout);
  return (
    <nav>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link to="/">All</Link>
        <Link to="/cats">Cats</Link>
        <Link to="/dogs">Dogs</Link>
        {token ? (
          <>
            <Link to="/mycats">My Cats</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}
