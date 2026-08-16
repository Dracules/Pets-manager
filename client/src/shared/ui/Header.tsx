import { NavLink } from 'react-router';
import { HeaderType } from '../model/types/header.type';
import styles from './css/Header.module.css';
import { AnimalIcon, CatIcon, DogIcon, ParrotIcon } from './Icons';

export function Header({
  type,
  id,
}: {
  type: HeaderType;
  id: string | undefined;
}) {
  if (type === 'no') return null;

  const prefix =
    type === 'all' ? '/' : type === 'owner' ? `/owner/${id}/` : '/my/';

  const links = [
    { to: `${prefix}`, label: 'All', icon: <AnimalIcon />, end: true },
    { to: `${prefix}cats`, label: 'Cats', icon: <CatIcon /> },
    { to: `${prefix}dogs`, label: 'Dogs', icon: <DogIcon /> },
    { to: `${prefix}parrots`, label: 'Parrots', icon: <ParrotIcon /> },
  ];

  return (
    <nav className={styles.nav}>
      {links.map(({ to, label, icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={!!end}
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
