import { Route, Routes } from 'react-router';
import {
  DogsPage,
  DogsPageByOwner,
  UserDogsPage,
} from '../../domains/dog/ui/DogPage';
import {
  CatsPage,
  CatsPageByOwner,
  UserCatsPage,
} from '../../domains/cat/ui/CatPage';
import LoginPage from '../../domains/login/ui/LoginPage';
import AppLayout from '../ui/AppLayout';
import {
  AnimalsPage,
  AnimalsPageByOwner,
  UserAnimalsPage,
} from '../../domains/animal/ui/AnimalPage';
import AnimalEditorPage from '../../domains/editor/ui/AnimalEditorPage';
import RegistrationPage from '../../domains/login/ui/RegistrationPage';
import {
  ParrotsPage,
  ParrotsPageByOwner,
  UserParrotsPage,
} from '../../domains/parrot/ui/ParrotPage';
import { UnfoundedErrorComponent } from '../../domains/base/ui/ErrorComponent';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<AnimalsPage />} />
        <Route path="dogs" element={<DogsPage />} />
        <Route path="cats" element={<CatsPage />} />
        <Route path="parrots" element={<ParrotsPage />} />
        <Route path="my/">
          <Route index element={<UserAnimalsPage />} />
          <Route path="cats" element={<UserCatsPage />} />
          <Route path="dogs" element={<UserDogsPage />} />
          <Route path="parrots" element={<UserParrotsPage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegistrationPage />} />
        <Route path="edit" element={<AnimalEditorPage mode="create" />} />
        <Route path="edit/:id" element={<AnimalEditorPage mode="edit" />} />
        <Route path="owner/:id/">
          <Route index element={<AnimalsPageByOwner />} />
          <Route path="cats" element={<CatsPageByOwner />} />
          <Route path="dogs" element={<DogsPageByOwner />} />
          <Route path="parrots" element={<ParrotsPageByOwner />} />
        </Route>
      </Route>
      <Route path="*" element={<UnfoundedErrorComponent />} />
    </Routes>
  );
}
