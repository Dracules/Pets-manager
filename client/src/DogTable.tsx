import { type ColumnDef } from '@tanstack/react-table';
import { Dog } from './interfaces/dog.interface';
import BaseTable from './BaseTable';

type DogColumn = ColumnDef<Dog>;

const dogColumns: DogColumn[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'trainedCommands', header: 'Commands' },
  { accessorKey: 'owner', header: 'Owner ID' },
];

interface DogTableProps {
  data: Dog[];
}

function DogTable({ data }: DogTableProps) {
  return <BaseTable data={data} columns={dogColumns} />;
}

export default DogTable;
