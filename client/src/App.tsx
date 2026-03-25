import { BrowserRouter } from 'react-router';
import { AppRoutes } from './shared/routes/routes';
import { AuthProvider } from './domains/login/context/AuthContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
