import { getDogs } from './apiClient';
import BaseAnimalPage from './BaseAnimalPage';
import DogTable from './DogTable';

const DogsPage = () => {
  return BaseAnimalPage(getDogs, DogTable);
};

export default DogsPage;
