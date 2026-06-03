import { CommonBaseTableProps } from '../../base/model/BaseTableProps';
import { AnimalResponse } from '../model/animal.response.interface';
import AnimalTableBase from '../../base/ui/AnimalTableBase';
import { BaseTableProps } from '../../base/model/BaseTableProps';

function AnimalTable(props: BaseTableProps<AnimalResponse>) {
  return <AnimalTableBase {...props} />;
}

export default AnimalTable;
