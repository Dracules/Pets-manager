import { type ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../base/ui/BaseTable';
import { BaseTableProps } from '../../base/model/BaseTableProps';
import { Animal } from '../../base/model/animal.interface';

const animalColumns: ColumnDef<Animal>[] = [
  { accessorKey: '_id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'owner', header: 'Owner ID' },
];

function AnimalTable({ data }: BaseTableProps<Animal>) {
  console.log(data);
  return <BaseTable data={data} columns={animalColumns} />;
}

export default AnimalTable;
