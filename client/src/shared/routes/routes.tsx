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
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<AnimalsPage />} />
        <Route path={ROUTES.DOGS} element={<DogsPage />} />
        <Route path={ROUTES.CATS} element={<CatsPage />} />
        <Route path={ROUTES.PARROTS} element={<ParrotsPage />} />
        <Route path={ROUTES.MY}>
          <Route
            index
            element={
              <ProtectedRoute>
                <UserAnimalsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={SEGMENTS.CATS}
            element={
              <ProtectedRoute>
                <UserCatsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={SEGMENTS.DOGS}
            element={
              <ProtectedRoute>
                <UserDogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={SEGMENTS.PARROTS}
            element={
              <ProtectedRoute>
                <UserParrotsPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegistrationPage />} />
        <Route
          path={ROUTES.EDIT}
          element={
            <ProtectedRoute>
              <AnimalEditorPage mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.EDIT_ID}
          element={
            <ProtectedRoute>
              <AnimalEditorPage mode="edit" />
            </ProtectedRoute>
          }
        />
        <Route path={ROUTES.OWNER}>
          <Route
            index
            element={
              <ProtectedRoute>
                <AnimalsPageByOwner />
              </ProtectedRoute>
            }
          />
          <Route
            path={SEGMENTS.CATS}
            element={
              <ProtectedRoute>
                <CatsPageByOwner />
              </ProtectedRoute>
            }
          />
          <Route
            path={SEGMENTS.DOGS}
            element={
              <ProtectedRoute>
                <DogsPageByOwner />
              </ProtectedRoute>
            }
          />
          <Route
            path={SEGMENTS.PARROTS}
            element={
              <ProtectedRoute>
                <ParrotsPageByOwner />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<UnfoundedErrorComponent />} />
    </Routes>
  );
}
