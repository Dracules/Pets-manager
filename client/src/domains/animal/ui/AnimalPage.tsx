import BaseAnimalPage from '../../base/ui/BaseAnimalPage';
import AnimalsApi from '../api/animalsApi';
import AnimalTable from './AnimalTable';

export const AnimalsPage = () => {
  return BaseAnimalPage(AnimalTable, AnimalsApi.getAnimals);
};

export const UserAnimalsPage = () => {
  return BaseAnimalPage(
    AnimalTable,
    AnimalsApi.getUserAnimals,
    AnimalsApi.deleteAnimals,
  );
};

export const AnimalsPageByOwner = () => {
  return BaseAnimalPage(AnimalTable, AnimalsApi.getUserAnimals);
};
