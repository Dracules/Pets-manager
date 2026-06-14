import { type ColumnDef } from '@tanstack/react-table';
import { CommonBaseTableProps } from '../../base/model/BaseTableProps';
import { ParrotResponse } from '../model/parrot.response.interface';
import AnimalTableBase from '../../base/ui/AnimalTableBase';
import { MultiTags } from '../../../shared/ui/MultiTags';

function ParrotTable(props: CommonBaseTableProps<ParrotResponse>) {
  return (
    <AnimalTableBase
      {...props}
      additionalColumns={
        [
          {
            accessorKey: 'vocabulary',
            header: 'Vocabulary',
            cell: ({ getValue }) => {
              const vocabulary = getValue() as string[] | undefined;
              return <MultiTags elements={vocabulary} />;
            },
          },
        ] as ColumnDef<ParrotResponse>[]
      }
    />
  );
}

export default ParrotTable;
