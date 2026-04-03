import { getCats, getUserCats } from '../../../shared/api/apiClient';
import BaseAnimalPage from '../../base/ui/BaseAnimalPage';
import CatTable from './CatTable';

export const CatsPage = () => {
  return BaseAnimalPage(CatTable, getCats);
};

export const UserCatsPage = () => {
  return BaseAnimalPage(CatTable, getUserCats);
};
