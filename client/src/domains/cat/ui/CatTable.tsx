import { type ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../base/ui/BaseTable';
import { BaseTableProps } from '../../base/model/BaseTableProps';
import { CatResponse } from '../model/cat.response.interface';

const catColumns: ColumnDef<CatResponse>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'litterStatus', header: 'Litter Status' },
  { accessorKey: 'owner', header: 'Owner ID' },
];

function CatTable({
  data,
  options,
  footerPaginationComponent,
  loading,
}: BaseTableProps<CatResponse>) {
  return (
    <BaseTable
      data={data}
      columns={catColumns}
      options={options}
      footerPaginationComponent={footerPaginationComponent}
      loading={loading}
    />
  );
}

export default CatTable;
