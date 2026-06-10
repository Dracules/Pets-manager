import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';
import { AppSidebar } from './Sidebar';
import { useEffect, useState } from 'react';
import { HeaderType } from '../model/types/header.type';
import styles from './css/AppLayout.module.css';

export default function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const pathname = location.pathname;

  const noHeaderPaths = ['/login', '/edit', '/register'];

  const headerType: HeaderType = useMemo(() => {
    if (noHeaderPaths.some((path) => pathname.startsWith(path))) return 'no';

    if (pathname.startsWith('/my')) return 'user';
    return 'all';
  }, [pathname]);

  const pageTitle = useMemo(() => {
    if (pathname.startsWith('/edit')) {
      if (pathname === '/edit') return 'Create animal';
      else return 'Update animal';
    }
    switch (pathname) {
      case '/':
        return 'Animals';
      case '/dogs':
        return 'Dogs';
      case '/cats':
        return 'Cats';
      case '/my':
        return 'My animals';
      case '/mycats':
        return 'My cats';
      case '/mydogs':
        return 'My dogs';
      case '/parrots':
        return 'Parrots';
      case '/myparrots':
        return 'My parrots';
      default:
        return null;
    }
  }, [pathname]);

  return (
    <div className={styles.layout}>
      <div
        className={`${styles.backdrop} ${!collapsed ? styles.backdropActive : ''}`}
        onClick={() => setCollapsed(true)}
      />
      <div
        className={`${styles.sidebarWrapper} ${!collapsed ? styles.sidebarOverlay : ''}`}
      >
        <AppSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>
      <div className={styles.contentArea}>
        {headerType !== 'no' ? (
          <div className={styles.header}>
            <Header type={headerType} />
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
