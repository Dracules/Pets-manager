import { NavLink } from 'react-router';
import { useAuth } from '../../domains/login/context/AuthContext';
import { setApiAuth } from '../api/axiosApi';
import { HeaderType } from '../model/types/header.type';
import styles from './css/Header.module.css';
import { PiCat, PiDog, PiPawPrint } from 'react-icons/pi';

export function Header({ type }: { type: HeaderType }) {
  const { getTokenStorage, logout, updateToken } = useAuth();
  setApiAuth(getTokenStorage, logout, updateToken);

  if (type === 'no') return null;

  const prefix = type === 'all' ? '' : 'my';

  const links = [
    { to: `/${prefix}`, label: 'All', icon: <PiPawPrint /> },
    { to: `/${prefix}cats`, label: 'Cats', icon: <PiCat /> },
    { to: `/${prefix}dogs`, label: 'Dogs', icon: <PiDog /> },
  ];

  return (
    <nav className={styles.nav}>
      {links.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.linkActive : ''}`
          }
        >
          {icon}
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
