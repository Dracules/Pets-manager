import { type ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../base/ui/BaseTable';
import { BaseTableProps } from '../../base/model/BaseTableProps';
import { DogResponse } from '../model/dog.response.interface';

const dogColumns: ColumnDef<DogResponse>[] = [
  { accessorKey: '_id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'trainedCommands', header: 'Commands' },
  { accessorKey: 'owner', header: 'Owner ID' },
];

function DogTable({
  data,
  options,
  footerPaginationComponent,
  loading,
}: BaseTableProps<DogResponse>) {
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
