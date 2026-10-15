import BaseAnimalPage from '../../base/ui/BaseAnimalPage';
import ParrotsApi from '../api/parrotsApi';
import ParrotTable from './ParrotTable';

export const ParrotsPage = () => {
  return BaseAnimalPage(ParrotTable, ParrotsApi.getParrots);
};

export const UserParrotsPage = () => {
  return BaseAnimalPage(
    ParrotTable,
    ParrotsApi.getUserParrots,
    ParrotsApi.deleteParrots,
  );
};

export const ParrotsPageByOwner = () => {
  return BaseAnimalPage(ParrotTable, ParrotsApi.getUserParrots);
};
