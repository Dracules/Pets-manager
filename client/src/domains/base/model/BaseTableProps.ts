import { ColumnDef } from '@tanstack/react-table';
import { AnimalType } from '../../animal/model/animal.type';
import { AnimalResponse } from '../../animal/model/animal.response.interface';
import { JSX } from 'react';

type BaseTablePropsOptions = {
  onDelete: (id: string, type: AnimalType) => Promise<void>;
  onEdit: (id: string, type: AnimalType) => Promise<void>;
};

export interface CommonBaseTableProps<T extends AnimalResponse> {
  data: T[];
  options?: BaseTablePropsOptions | undefined;
  footerPaginationComponent: JSX.Element;
  loading: boolean;
}

export interface AnimalTableBaseProps<
  T extends AnimalResponse,
> extends CommonBaseTableProps<T> {
  additionalColumns?: ColumnDef<T>[];
}

export interface BaseTableProps<T extends AnimalResponse> extends Omit<
  CommonBaseTableProps<T>,
  'options'
> {
  columns: ColumnDef<T>[];
}
