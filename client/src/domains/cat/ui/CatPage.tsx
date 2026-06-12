import BaseAnimalPage from '../../base/ui/BaseAnimalPage';
import { CatsApi } from '../api/catsApi';
import CatTable from './CatTable';

export const CatsPage = () => {
  return BaseAnimalPage(CatTable, CatsApi.getCats);
};

export const UserCatsPage = () => {
  return BaseAnimalPage(CatTable, CatsApi.getUserCats, CatsApi.deleteCats);
};

export const CatsPageByOwner = () => {
  return BaseAnimalPage(CatTable, CatsApi.getUserCats);
};
