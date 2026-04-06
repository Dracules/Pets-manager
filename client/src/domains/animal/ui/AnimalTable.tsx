import { type ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../base/ui/BaseTable';
import { BaseTableProps } from '../../base/model/BaseTableProps';
import { AnimalResponse } from '../model/animal.response.interface';

const animalColumns: ColumnDef<AnimalResponse>[] = [
  { accessorKey: '_id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'owner', header: 'Owner ID' },
];

function AnimalTable({ data }: BaseTableProps<AnimalResponse>) {
  return <BaseTable data={data} columns={animalColumns} />;
}

export default AnimalTable;
