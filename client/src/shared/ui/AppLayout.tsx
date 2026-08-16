import { Outlet, useLocation, useParams } from 'react-router';
import Header from './Header';
import AppSidebar from './Sidebar';
import { useCallback, useMemo, useState } from 'react';
import { HeaderType } from '../model/types/header.type';
import styles from './css/AppLayout.module.css';

export default function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const { id: ownerId } = useParams();

  const pathname = location.pathname;

  const state = location.state as { ownerLogin?: string } | null;
  const [ownerData, setOwnerData] = useState(() => ({
    login: state?.ownerLogin || '',
    id: state?.ownerLogin ? ownerId || '' : '',
  }));

  useEffect(() => {
    if (ownerId && ownerId !== ownerData.id) {
      const newState = location.state as { ownerLogin?: string } | null;
      const ownerLogin = newState?.ownerLogin;
      if (ownerLogin) setOwnerData({ login: ownerLogin, id: ownerId });
      else setOwnerData({ login: '', id: '' });
    }
  }, [ownerId, ownerData.id, location.state]);

  const noHeaderPaths = ['/login', '/edit', '/register'];

  const headerType: HeaderType = useMemo(() => {
    if (noHeaderPaths.some((path) => pathname.startsWith(path))) return 'no';
    if (pathname.startsWith('/owner')) return 'owner';
    if (pathname.startsWith('/my')) return 'user';
    return 'all';
  }, [pathname]);

  const pageTitle = useMemo(() => {
    if (pathname.startsWith('/edit')) {
      if (pathname === '/edit') return 'Create animal';
      else return 'Update animal';
    }

    if (headerType === 'owner') {
      return ownerData.login
        ? `Animals of user '${ownerData.login}'`
        : `Animals of user with ID '${ownerId}'`;
    }

    switch (pathname) {
      case '/':
        return 'Animals';
      case '/dogs':
        return 'Dogs';
      case '/cats':
        return 'Cats';
      case '/my/':
        return 'My animals';
      case '/my/cats':
        return 'My cats';
      case '/my/dogs':
        return 'My dogs';
      case '/parrots':
        return 'Parrots';
      case '/my/parrots':
        return 'My parrots';
      default:
        return null;
    }
  }, [pathname, headerType, ownerData, ownerId]);

  const handleToggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <div className={styles.layout}>
      <div
        className={`${styles.backdrop} ${!collapsed ? styles.backdropActive : ''}`}
        onClick={() => setCollapsed(true)}
      />
      <div
        className={`${styles.sidebarWrapper} ${!collapsed ? styles.sidebarOverlay : ''}`}
      >
        <AppSidebar collapsed={collapsed} onToggle={handleToggle} />
      </div>
      <div className={styles.contentArea}>
        {headerType !== 'no' ? (
          <div className={styles.header}>
            <Header type={headerType} id={ownerId} />
          </div>
        ) : undefined}
        {pageTitle ? (
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
        ) : undefined}
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
