import {
  deleteDogs,
  getDogs,
  getUserDogs,
} from '../../../shared/api/apiClient';
import BaseAnimalPage from '../../base/ui/BaseAnimalPage';
import DogTable from './DogTable';

export const DogsPage = () => {
  return BaseAnimalPage(DogTable, getDogs);
};

export const UserDogsPage = () => {
  return BaseAnimalPage(DogTable, getUserDogs, deleteDogs);
};
