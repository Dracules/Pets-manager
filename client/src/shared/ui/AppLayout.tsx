import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';
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
    <div>
      <h1>{pageTitle}</h1>
      <Header type={headerType} />
      <Outlet />
    </div>
  );
}
