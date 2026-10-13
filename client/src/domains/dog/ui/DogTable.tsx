import { type ColumnDef } from '@tanstack/react-table';
import { CommonBaseTableProps } from '../../base/model/BaseTableProps';
import { DogResponse } from '../model/dog.response.interface';
import AnimalTableBase from '../../base/ui/AnimalTableBase';
import MultiTags from '../../../shared/ui/MultiTags';

const dogAdditionalColumns: ColumnDef<DogResponse>[] = [
  {
    accessorKey: 'trainedCommands',
    header: 'Commands',
    cell: ({ getValue }) => {
      const commands = getValue() as string[] | undefined;
      return <MultiTags elements={commands} />;
    },
  },
];

function DogTable(props: CommonBaseTableProps<DogResponse>) {
  return (
    <AnimalTableBase {...props} additionalColumns={dogAdditionalColumns} />
  );
}

export default DogTable;
