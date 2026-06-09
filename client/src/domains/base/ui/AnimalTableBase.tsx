import { type ColumnDef } from '@tanstack/react-table';
import BaseTable from './BaseTable';
import { AnimalTableBaseProps } from '../model/BaseTableProps';
import { useMemo } from 'react';
import { AnimalResponse } from '../../animal/model/animal.response.interface';
import {
  AnimalIcon,
  CatIcon,
  DogIcon,
  ParrotIcon,
} from '../../../shared/ui/Icons';

const baseColumns: ColumnDef<AnimalResponse>[] = [
  {
    id: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.type;
      let IconComponent = AnimalIcon;

      switch (type) {
        case 'cat':
          IconComponent = CatIcon;
          break;
        case 'dog':
          IconComponent = DogIcon;
          break;
        case 'parrot':
          IconComponent = ParrotIcon;
          break;
      }

      return (
          <IconComponent />
      );
    },
    meta: { size: 70 },
  },
  { accessorKey: 'name', header: 'Name', meta: { size: 170 } },
  { accessorKey: 'age', header: 'Age', meta: { size: 170 } },
  { accessorKey: 'description', header: 'Description' },
];

function AnimalTableBase<T extends AnimalResponse>({
  data,
  options,
  footerPaginationComponent,
  loading,
  additionalColumns,
}: AnimalTableBaseProps<T>) {
  const sharedColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols = [...baseColumns] as ColumnDef<T>[];

    if (additionalColumns) cols.push(...additionalColumns);

    if (!options) {
      cols.push({
        accessorKey: 'owner.login',
        header: 'Owner',
        meta: { size: 170 },
      });
    }
    return cols;
  }, [options, additionalColumns]);

  return (
    <BaseTable
      data={data}
      columns={sharedColumns}
      options={options}
      footerPaginationComponent={footerPaginationComponent}
      loading={loading}
    />
  );
}

export default AnimalTableBase;
