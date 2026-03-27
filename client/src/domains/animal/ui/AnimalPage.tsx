import { getAnimals } from '../../../shared/api/apiClient';
import BaseAnimalPage from '../../base/ui/BaseAnimalPage';
import AnimalTable from './AnimalTable';

const AnimalsPage = () => {
  return BaseAnimalPage(getAnimals, AnimalTable);
};

export default AnimalsPage;
