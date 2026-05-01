import { Link } from 'react-router';
import { useAuth } from '../../domains/login/context/AuthContext';
import { setApiAuth } from '../api/axiosApi';
import { HeaderType } from '../model/types/header.type';

export function Header({ type }: { type: HeaderType }) {
  const { getTokenStorage, logout, updateToken } = useAuth();
  setApiAuth(getTokenStorage, logout, updateToken);

  const getHeaderLinks = () => {
    switch (type) {
      case 'all':
        return (
          <>
            <Link to="/">All</Link>
            <Link to="/cats">Cats</Link>
            <Link to="/dogs">Dogs</Link>
          </>
        );
      case 'user':
        return (
          <>
            <Link to="/my">All</Link>
            <Link to="/mycats">Cats</Link>
            <Link to="/mydogs">Dogs</Link>
          </>
        );
      case 'no':
        return <></>;
    }
  };

  return (
    <nav>
      <div style={{ display: 'flex', gap: '12px' }}>{getHeaderLinks()}</div>
    </nav>
  );
}
