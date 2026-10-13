import { ColumnDef } from '@tanstack/react-table';
import type { AnimalType } from '../../animal/model/animal.type';
import type { AnimalResponse } from '../../animal/model/animal.response.interface';
import { JSX } from 'react';

type UserBaseTablePropsOptions = {
  onDelete: (id: string, type: AnimalType) => Promise<void>;
  onEdit: (id: string, type: AnimalType) => void;
};

type BaseTablePropsOptions = {
  onOwnerClick: (id: string, ownerLogin: string) => void;
};

export interface CommonBaseTableProps<T extends AnimalResponse> {
  data: T[];
  options: BaseTablePropsOptions | UserBaseTablePropsOptions;
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
