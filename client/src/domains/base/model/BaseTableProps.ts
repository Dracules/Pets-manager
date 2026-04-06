import { ColumnDef } from '@tanstack/react-table';
import { Animal } from '../../animal/model/animal.interface';
import { AnimalType } from '../../animal/model/animal.type';

export interface BaseTableProps<T extends Animal> {
  data: T[];
  columns?: ColumnDef<T>[];
  onDelete?: ((id: string, type?: AnimalType) => Promise<void>) | undefined;
}
