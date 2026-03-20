import { getCats, getUserCats } from '../../../shared/api/apiClient';
import BaseAnimalPage from '../../base/ui/BaseAnimalPage';
import CatTable from './CatTable';

export const CatsPage = () => {
  return BaseAnimalPage(getCats, CatTable);
};

export const UserCatsPage = () => {
  return BaseAnimalPage(getUserCats, CatTable);
};
