import { getAnimals, getUserAnimals } from '../../../shared/api/apiClient';
import BaseAnimalPage from '../../base/ui/BaseAnimalPage';
import AnimalTable from './AnimalTable';

export const AnimalsPage = () => {
  return BaseAnimalPage(getAnimals, AnimalTable);
};

export const UserAnimalsPage = () => {
  return BaseAnimalPage(getUserAnimals, AnimalTable);
};
