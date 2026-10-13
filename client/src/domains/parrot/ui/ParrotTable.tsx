import { type ColumnDef } from '@tanstack/react-table';
import { CommonBaseTableProps } from '../../base/model/BaseTableProps';
import { ParrotResponse } from '../model/parrot.response.interface';
import AnimalTableBase from '../../base/ui/AnimalTableBase';
import MultiTags from '../../../shared/ui/MultiTags';

const parrotAdditionalColumns: ColumnDef<ParrotResponse>[] = [
  {
    accessorKey: 'vocabulary',
    header: 'Vocabulary',
    cell: ({ getValue }) => {
      const vocabulary = getValue() as string[] | undefined;
      return <MultiTags elements={vocabulary} />;
    },
  },
];

function ParrotTable(props: CommonBaseTableProps<ParrotResponse>) {
  return (
    <AnimalTableBase {...props} additionalColumns={parrotAdditionalColumns} />
  );
}

export default ParrotTable;
