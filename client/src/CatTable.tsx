import { type ColumnDef } from '@tanstack/react-table';
import BaseTable from './BaseTable';
import { Cat } from './interfaces/cat.interface';
import { BaseTableProps } from './interfaces/BaseTableProps';

const catColumns: ColumnDef<Cat>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'litterStatus', header: 'Litter Status' },
  { accessorKey: 'owner', header: 'Owner ID' },
];

function CatTable({ data }: BaseTableProps<Cat>) {
  return <BaseTable data={data} columns={catColumns} />;
}

export default CatTable;
