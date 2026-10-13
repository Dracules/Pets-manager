import type { CommonBaseTableProps } from '../../base/model/BaseTableProps';
import type { AnimalResponse } from '../model/animal.response.interface';
import AnimalTableBase from '../../base/ui/AnimalTableBase';

function AnimalTable(props: CommonBaseTableProps<AnimalResponse>) {
  return <AnimalTableBase {...props} />;
}

export default AnimalTable;
