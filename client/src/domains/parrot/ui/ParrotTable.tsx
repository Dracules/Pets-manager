import { type ColumnDef } from '@tanstack/react-table';
import { CommonBaseTableProps } from '../../base/model/BaseTableProps';
import { ParrotResponse } from '../model/parrot.response.interface';
import AnimalTableBase from '../../base/ui/AnimalTableBase';

function ParrotTable(props: CommonBaseTableProps<ParrotResponse>) {
  return (
    <AnimalTableBase
      {...props}
      additionalColumns={
        [
          { accessorKey: 'vocabulary', header: 'Vocabulary' },
        ] as ColumnDef<ParrotResponse>[]
      }
    />
  );
}

export default ParrotTable;
