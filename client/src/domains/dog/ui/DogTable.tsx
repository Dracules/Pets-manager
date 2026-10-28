import { type ColumnDef } from '@tanstack/react-table';
import type { CommonBaseTableProps } from '../../base/model/BaseTableProps';
import type { DogResponse } from '../model/dog.response.interface';
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
    enableSorting: false,
  },
];

function DogTable(props: CommonBaseTableProps<DogResponse>) {
  return (
    <AnimalTableBase {...props} additionalColumns={dogAdditionalColumns} />
  );
}

export default DogTable;
