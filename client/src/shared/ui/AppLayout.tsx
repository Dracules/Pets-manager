import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';

export default function AppLayout() {
  const location = useLocation();
  const pathname = location.pathname;

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
      <Header />
      <Outlet />
    </div>
  );
}
