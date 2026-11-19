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
import { ROUTES, SEGMENTS } from './constants/routes';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<AnimalsPage />} />
        <Route path={ROUTES.DOGS} element={<DogsPage />} />
        <Route path={ROUTES.CATS} element={<CatsPage />} />
        <Route path={ROUTES.PARROTS} element={<ParrotsPage />} />
        <Route path={ROUTES.MY}>
          <Route index element={<UserAnimalsPage />} />
          <Route path={SEGMENTS.CATS} element={<UserCatsPage />} />
          <Route path={SEGMENTS.DOGS} element={<UserDogsPage />} />
          <Route path={SEGMENTS.PARROTS} element={<UserParrotsPage />} />
        </Route>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegistrationPage />} />
        <Route
          path={ROUTES.EDIT}
          element={<AnimalEditorPage mode="create" />}
        />
        <Route
          path={ROUTES.EDIT_ID}
          element={<AnimalEditorPage mode="edit" />}
        />
        <Route path={ROUTES.OWNER}>
          <Route index element={<AnimalsPageByOwner />} />
          <Route path={SEGMENTS.CATS} element={<CatsPageByOwner />} />
          <Route path={SEGMENTS.DOGS} element={<DogsPageByOwner />} />
          <Route path={SEGMENTS.PARROTS} element={<ParrotsPageByOwner />} />
        </Route>
      </Route>
      <Route path="*" element={<UnfoundedErrorComponent />} />
    </Routes>
  );
}
