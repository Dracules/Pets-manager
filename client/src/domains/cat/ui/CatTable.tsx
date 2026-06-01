import { type ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../base/ui/BaseTable';
import { BaseTableProps } from '../../base/model/BaseTableProps';
import { CatResponse } from '../model/cat.response.interface';
import { useMemo } from 'react';

const baseColumns: ColumnDef<CatResponse>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'litterStatus', header: 'Litter Status' },
];

function CatTable({
  data,
  options,
  footerPaginationComponent,
  loading,
}: BaseTableProps<CatResponse>) {
  const catColumns = useMemo<ColumnDef<CatResponse>[]>(() => {
    const cols = [...baseColumns];
    if (!options) {
      cols.push({ accessorKey: 'owner.login', header: 'Owner' });
    }
    return cols;
  }, [options]);
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
