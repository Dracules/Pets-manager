import { Outlet } from 'react-router';
import { Header } from './Header';

export default function AppLayout() {
  return (
    <div>
      <h1>Animals</h1>
      <Header />
      <Outlet />
    </div>
  );
}
