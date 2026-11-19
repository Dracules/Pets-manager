import { matchPath, Outlet, useLocation, useParams } from 'react-router';
import Header from './Header';
import AppSidebar from './Sidebar';
import { useCallback, useMemo, useRef, useState } from 'react';
import { HeaderType } from '../model/types/header.type';
import styles from './css/AppLayout.module.css';
import { NO_HEADER_PATHS, ROUTES } from '../routes/constants/routes';

export default function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const { id: ownerId } = useParams();

  const pathname = location.pathname;

  const state = location.state as { ownerLogin?: string } | null;
  const [ownerLogin, setOwnerLogin] = useState(() => state?.ownerLogin || '');
  const prevOwnerIdRef = useRef(ownerId);

  if (ownerId !== prevOwnerIdRef.current) {
    setOwnerLogin(state?.ownerLogin || '');
    prevOwnerIdRef.current = ownerId;
  }

  const headerType: HeaderType = useMemo(() => {
    if (NO_HEADER_PATHS.some((path) => matchPath(path, pathname))) return 'no';
    if (matchPath(ROUTES.OWNER + '/*', pathname)) return 'owner';
    if (matchPath(ROUTES.MY + '/*', pathname)) return 'user';
    return 'all';
  }, [pathname]);

  const pageTitle = useMemo(() => {
    if (matchPath(ROUTES.EDIT, pathname)) return 'Create animal';
    if (matchPath(ROUTES.EDIT_ID, pathname)) return 'Update animal';

    if (matchPath(ROUTES.OWNER + '/*', pathname)) {
      return ownerLogin
        ? `Animals of user '${ownerLogin}'`
        : `Animals of user with ID '${ownerId}'`;
    }

    switch (pathname) {
      case ROUTES.HOME:
        return 'Animals';
      case ROUTES.DOGS:
        return 'Dogs';
      case ROUTES.CATS:
        return 'Cats';
      case ROUTES.PARROTS:
        return 'Parrots';
      case ROUTES.MY:
        return 'My animals';
      case ROUTES.MY_CATS:
        return 'My cats';
      case ROUTES.MY_DOGS:
        return 'My dogs';
      case ROUTES.MY_PARROTS:
        return 'My parrots';
      default:
        return null;
    }
  }, [pathname, ownerLogin, ownerId]);

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
