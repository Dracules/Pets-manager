import { getCats } from '../../../shared/api/apiClient';
import BaseAnimalPage from '../../base/ui/BaseAnimalPage';
import CatTable from './CatTable';

const CatsPage = () => {
  return BaseAnimalPage(getCats, CatTable);
};

export default CatsPage;
