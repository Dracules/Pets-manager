import { type ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../base/ui/BaseTable';
import { BaseTableProps } from '../../base/model/BaseTableProps';
import { DogResponse } from '../model/dog.response.interface';
import { useMemo } from 'react';

const baseColumns: ColumnDef<DogResponse>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'trainedCommands', header: 'Commands' },
  { accessorKey: 'description', header: 'Description' },
];

function DogTable({
  data,
  options,
  footerPaginationComponent,
  loading,
}: BaseTableProps<DogResponse>) {
  const dogColumns = useMemo<ColumnDef<DogResponse>[]>(() => {
    const cols = [...baseColumns];
    if (!options) {
      cols.push({ accessorKey: 'owner.login', header: 'Owner' });
    }
    return cols;
  }, [options]);
  return (
    <BaseTable
      data={data}
      columns={dogColumns}
      options={options}
      footerPaginationComponent={footerPaginationComponent}
      loading={loading}
    />
  );
}

export default DogTable;
