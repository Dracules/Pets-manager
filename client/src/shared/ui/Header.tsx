import { NavLink } from 'react-router';
import { useAuth } from '../../domains/login/context/AuthContext';
import { setApiAuth } from '../api/axiosApi';
import { HeaderType } from '../model/types/header.type';
import styles from './css/Header.module.css';
import { AnimalIcon, CatIcon, DogIcon, ParrotIcon } from './Icons';

export function Header({ type }: { type: HeaderType }) {
  const { getTokenStorage, logout, updateToken } = useAuth();
  setApiAuth(getTokenStorage, logout, updateToken);

  if (type === 'no') return null;

  const prefix = type === 'all' ? '' : 'my';

  const links = [
    { to: `/${prefix}`, label: 'All', icon: <AnimalIcon /> },
    { to: `/${prefix}cats`, label: 'Cats', icon: <CatIcon /> },
    { to: `/${prefix}dogs`, label: 'Dogs', icon: <DogIcon /> },
    { to: `/${prefix}parrots`, label: 'Parrots', icon: <ParrotIcon /> },
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
