import { type ColumnDef } from '@tanstack/react-table';
import { Dog } from '../model/dog.interface';
import BaseTable from '../../base/ui/BaseTable';
import { BaseTableProps } from '../../base/model/BaseTableProps';

const dogColumns: ColumnDef<Dog>[] = [
  { accessorKey: '_id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'trainedCommands', header: 'Commands' },
  { accessorKey: 'owner', header: 'Owner ID' },
];

function DogTable({ data, options }: BaseTableProps<Dog>) {
  return <BaseTable data={data} columns={dogColumns} options={options} />;
}

export default DogTable;
