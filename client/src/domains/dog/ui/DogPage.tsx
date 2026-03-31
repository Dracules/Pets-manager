import { getDogs, getUserDogs } from '../../../shared/api/apiClient';
import BaseAnimalPage from '../../base/ui/BaseAnimalPage';
import DogTable from './DogTable';

export const DogsPage = () => {
  return BaseAnimalPage(getDogs, DogTable);
};

export const UserDogsPage = () => {
  return BaseAnimalPage(getUserDogs, DogTable);
};
