import { getDogs, getUserDogs } from '../../../shared/api/apiClient';
import BaseAnimalPage from '../../base/ui/BaseAnimalPage';
import DogTable from './DogTable';

const DogsPage = () => {
  return BaseAnimalPage(getDogs, DogTable);
};

export const UserDogsPage = () => {
  return BaseAnimalPage(getUserDogs, DogTable);
};

export default DogsPage;
