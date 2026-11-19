import { generatePath, NavLink } from 'react-router';
import { HeaderType } from '../model/types/header.type';
import styles from './css/Header.module.css';
import { AnimalIcon, CatIcon, DogIcon, ParrotIcon } from './Icons';
import { memo, useMemo } from 'react';
import { ROUTES } from '../routes/constants/routes';

interface HeaderProps {
  type: HeaderType;
  id: string | undefined;
}

interface HeaderLinks {
  all: string;
  cats: string;
  dogs: string;
  parrots: string;
}

function actualHeaders(links: HeaderLinks | null) {
  if (!links) return [];
  return [
    { to: links.all, label: 'All', icon: <AnimalIcon />, end: true },
    { to: links.cats, label: 'Cats', icon: <CatIcon /> },
    { to: links.dogs, label: 'Dogs', icon: <DogIcon /> },
    { to: links.parrots, label: 'Parrots', icon: <ParrotIcon /> },
  ];
}

function routeMap(type: HeaderType, id: string | undefined) {
  if (type === 'all') {
    return {
      all: ROUTES.HOME,
      cats: ROUTES.CATS,
      dogs: ROUTES.DOGS,
      parrots: ROUTES.PARROTS,
    };
  }

  if (type === 'user') {
    return {
      all: ROUTES.MY,
      cats: ROUTES.MY_CATS,
      dogs: ROUTES.MY_DOGS,
      parrots: ROUTES.MY_PARROTS,
    };
  }

  if (type === 'owner' && id) {
    return {
      all: generatePath(ROUTES.OWNER, { id }),
      cats: generatePath(ROUTES.OWNER_CATS, { id }),
      dogs: generatePath(ROUTES.OWNER_DOGS, { id }),
      parrots: generatePath(ROUTES.OWNER_PARROTS, { id }),
    };
  }

  return null;
}

function Header({ type, id }: HeaderProps) {
  if (type === 'no') return null;

  const links = useMemo(() => {
    const config = routeMap(type, id);
    return actualHeaders(config);
  }, [type, id]);

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

export default memo(Header);
