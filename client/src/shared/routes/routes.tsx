import { Navigate, Route, Routes } from 'react-router';
import DogsPage from '../../domains/dog/ui/DogPage';
import { CatsPage, UserCatsPage } from '../../domains/cat/ui/CatPage';
import LoginPage from '../../domains/login/ui/LoginPage';
import AppLayout from '../ui/AppLayout';
import AnimalsPage from '../../domains/animal/ui/AnimalPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<AnimalsPage />} />
        <Route path="dogs" element={<DogsPage />} />
        <Route path="cats" element={<CatsPage />} />
        <Route path="mycats" element={<UserCatsPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}
