import { type ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../base/ui/BaseTable';
import { Cat } from '../model/cat.interface';
import { BaseTableProps } from '../../base/model/BaseTableProps';

const catColumns: ColumnDef<Cat>[] = [
  { accessorKey: '_id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'litterStatus', header: 'Litter Status' },
  { accessorKey: 'owner', header: 'Owner ID' },
];

function CatTable({ data, options }: BaseTableProps<Cat>) {
  return <BaseTable data={data} columns={catColumns} options={options} />;
}

export default CatTable;
