import { type ColumnDef } from '@tanstack/react-table';
import { CommonBaseTableProps } from '../../base/model/BaseTableProps';
import { CatResponse } from '../model/cat.response.interface';
import AnimalTableBase from '../../base/ui/AnimalTableBase';

function CatTable(props: CommonBaseTableProps<CatResponse>) {
  return (
    <AnimalTableBase
      {...props}
      additionalColumns={
        [
          {
            accessorKey: 'litterStatus',
            header: 'Litter Status',
            meta: { size: 130 },
          },
        ] as ColumnDef<CatResponse>[]
      }
    />
  );
}

export default CatTable;
