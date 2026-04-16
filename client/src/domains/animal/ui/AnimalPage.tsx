import {
  deleteAnimals,
  getAnimals,
  getUserAnimals,
} from '../../../shared/api/apiClient';
import BaseAnimalPage from '../../base/ui/BaseAnimalPage';
import AnimalTable from './AnimalTable';

export const AnimalsPage = () => {
  return BaseAnimalPage(AnimalTable, getAnimals);
};

export const UserAnimalsPage = () => {
  return BaseAnimalPage(AnimalTable, getUserAnimals, {
    deleteFn: deleteAnimals,
  });
};
