import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';
import { AppSidebar } from './Sidebar';
import { useEffect, useState } from 'react';
import { HeaderType } from '../model/types/header.type';

export default function AppLayout() {
  const [headerType, setHeaderType] = useState<HeaderType>('all');
  const location = useLocation();
  const pathname = location.pathname;

  const userHeaderPaths = ['/my', '/mycats', '/mydogs'];
  const noHeaderPaths = ['/login', '/edit', '/register'];

  useEffect(() => {
    if (noHeaderPaths.some((path) => pathname.startsWith(path))) {
      return setHeaderType('no');
    }
    if (userHeaderPaths.includes(pathname)) {
      return setHeaderType('user');
    }
    return setHeaderType('all');
  }, [pathname]);

  const getPageTitle = (): string => {
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
      case '/login':
        return 'Login';
      case '/register':
        return 'Create an account';
      default:
        return '';
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
