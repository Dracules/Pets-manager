import { getCats } from './apiClient';
import BaseAnimalPage from './BaseAnimalPage';
import CatTable from './CatTable';

const CatsPage = () => {
  return BaseAnimalPage(getCats, CatTable);
};

export default CatsPage;
