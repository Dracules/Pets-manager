import { ColumnDef } from '@tanstack/react-table';
import { Animal } from './animal.interface';

export interface BaseTableProps<T extends Animal> {
  data: T[];
  columns?: ColumnDef<T>[];
  onDelete?: ((id: string) => Promise<string>) | undefined;
}
