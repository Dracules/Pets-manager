import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';
import { AppSidebar } from './Sidebar';
import { useEffect, useState } from 'react';
import { HeaderType } from '../model/types/header.type';

export default function AppLayout() {
  const [headerType, setHeaderType] = useState<HeaderType>('all');
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    switch (pathname) {
      case '/':
        return setHeaderType('all');
      case '/mycats':
        return setHeaderType('user');
      case '/login':
        return setHeaderType('login');
    }
  }, [pathname]);

  const getPageTitle = (): string => {
    switch (pathname) {
      case '/':
        return 'Animals';
      case '/dogs':
        return 'Dogs';
      case '/cats':
        return 'Cats';
      case '/mycats':
        return 'My cats';
      case '/login':
        return 'Login';
      default:
        return 'Animals';
    }
  };

  const pageTitle = getPageTitle();
  return (
    <div
      style={{
        display: 'flex',
        height: '100dvh',
        margin: 0,
        padding: 0,
      }}
    >
      <AppSidebar />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginLeft: '10px',
        }}
      >
        <Header type={headerType} />
        <h1>{pageTitle}</h1>
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
