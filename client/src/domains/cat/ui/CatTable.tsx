import { type ColumnDef } from '@tanstack/react-table';
import { BaseTableProps } from '../../base/model/BaseTableProps';
import { CatResponse } from '../model/cat.response.interface';
import AnimalTableBase from '../../base/ui/AnimalTableBase';

function CatTable(props: BaseTableProps<CatResponse>) {
  return (
    <AnimalTableBase
      {...props}
      additionalColumns={
        [
          {
            accessorKey: 'litterStatus',
            header: 'Litter Status',
          },
        ] as ColumnDef<CatResponse>[]
      }
    />
  );
}

export default CatTable;
