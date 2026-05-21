import { NavLink } from 'react-router';
import { useAuth } from '../../domains/login/context/AuthContext';
import { setApiAuth } from '../api/axiosApi';
import { HeaderType } from '../model/types/header.type';

export function Header({ type }: { type: HeaderType }) {
  const { getTokenStorage, logout, updateToken } = useAuth();
  setApiAuth(getTokenStorage, logout, updateToken);

  if (type === 'no') return null;

  const links =
    type === 'all'
      ? [
          { to: '/', label: 'All' },
          { to: '/cats', label: 'Cats' },
          { to: '/dogs', label: 'Dogs' },
        ]
      : [
          { to: '/my', label: 'All' },
          { to: '/mycats', label: 'Cats' },
          { to: '/mydogs', label: 'Dogs' },
        ];

  return (
    <nav>
      {links.map(({ to, label }) => (
        <NavLink key={to} to={to}>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
