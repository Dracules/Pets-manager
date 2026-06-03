import { type ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../base/ui/BaseTable';
import { BaseTableProps } from '../../base/model/BaseTableProps';
import { AnimalResponse } from '../model/animal.response.interface';
import { useMemo } from 'react';

const baseColumns: ColumnDef<AnimalResponse>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'description', header: 'Description' },
];

function AnimalTable({
  data,
  options,
  footerPaginationComponent,
  loading,
}: BaseTableProps<AnimalResponse>) {
  const animalColumns = useMemo<ColumnDef<AnimalResponse>[]>(() => {
    const cols = [...baseColumns];
    if (!options) {
      cols.push({ accessorKey: 'owner.login', header: 'Owner' });
    }
    return cols;
  }, [options]);

  return (
    <BaseTable
      data={data}
      columns={animalColumns}
      options={options}
      footerPaginationComponent={footerPaginationComponent}
      loading={loading}
    />
  );
}

export default AnimalTable;
