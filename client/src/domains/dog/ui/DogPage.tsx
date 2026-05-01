import BaseAnimalPage from '../../base/ui/BaseAnimalPage';
import { DogsApi } from '../api/dogsApi';
import DogTable from './DogTable';

export const DogsPage = () => {
  return BaseAnimalPage(DogTable, DogsApi.getDogs);
};

export const UserDogsPage = () => {
  return BaseAnimalPage(DogTable, DogsApi.getUserDogs, DogsApi.deleteDogs);
};
