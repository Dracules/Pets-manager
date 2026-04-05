import { BrowserRouter } from 'react-router';
import { AppRoutes } from './shared/routes/routes';
import { AuthProvider } from './domains/login/context/AuthContext';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          theme="light"
          limit={3}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
