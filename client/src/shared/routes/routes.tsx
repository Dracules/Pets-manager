import { Route, Routes } from 'react-router';
import { DogsPage, UserDogsPage } from '../../domains/dog/ui/DogPage';
import { CatsPage, UserCatsPage } from '../../domains/cat/ui/CatPage';
import LoginPage from '../../domains/login/ui/LoginPage';
import AppLayout from '../ui/AppLayout';
import {
  AnimalsPage,
  UserAnimalsPage,
} from '../../domains/animal/ui/AnimalPage';
import AnimalEditorPage from '../../domains/editor/ui/AnimalEditorPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<AnimalsPage />} />
        <Route path="dogs" element={<DogsPage />} />
        <Route path="cats" element={<CatsPage />} />
        <Route path="my" element={<UserAnimalsPage />} />
        <Route path="mycats" element={<UserCatsPage />} />
        <Route path="mydogs" element={<UserDogsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="edit" element={<AnimalEditorPage mode="create" />} />
        <Route path="edit/:id" element={<AnimalEditorPage mode="edit" />} />
      </Route>
    </Routes>
  );
}
