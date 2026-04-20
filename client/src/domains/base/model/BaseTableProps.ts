import { ColumnDef } from '@tanstack/react-table';
import { Animal } from '../../animal/model/animal.interface';
import { AnimalType } from '../../animal/model/animal.type';

type BaseTablePropsOptions = {
  onDelete: (id: string, type?: AnimalType) => Promise<void>;
  onEdit: (id: string, type?: AnimalType) => Promise<void>;
};

export interface BaseTableProps<T extends Animal> {
  data: T[];
  columns?: ColumnDef<T>[];
  options?: BaseTablePropsOptions | undefined;
}
