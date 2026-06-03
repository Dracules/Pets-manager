import { type ColumnDef } from '@tanstack/react-table';
import { BaseTableProps } from '../../base/model/BaseTableProps';
import { DogResponse } from '../model/dog.response.interface';
import AnimalTableBase from '../../base/ui/AnimalTableBase';

function DogTable(props: BaseTableProps<DogResponse>) {
  return (
    <AnimalTableBase
      {...props}
      additionalColumns={
        [
          { accessorKey: 'trainedCommands', header: 'Commands' },
        ] as ColumnDef<DogResponse>[]
      }
    />
  );
}

export default DogTable;
