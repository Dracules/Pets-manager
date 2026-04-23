import { ColumnDef } from '@tanstack/react-table';
import { AnimalType } from '../../animal/model/animal.type';
import { AnimalResponse } from '../../animal/model/animal.response.interface';

type BaseTablePropsOptions = {
  onDelete: (id: string, type?: AnimalType) => Promise<void>;
  onEdit: (id: string, type?: AnimalType) => Promise<void>;
};

export interface BaseTableProps<T extends AnimalResponse> {
  data: T[];
  columns?: ColumnDef<T>[];
  options?: BaseTablePropsOptions | undefined;
}
