import { ColumnDef } from '@tanstack/react-table';
import type { AnimalType } from '../../animal/model/animal.type';
import type { AnimalResponse } from '../../animal/model/animal.response.interface';
import { JSX } from 'react';
import { SortingState } from '@tanstack/react-table';

type SortingOptions = {
  sorting: SortingState;
  onSortingChange: (
    updater: SortingState | ((old: SortingState) => SortingState),
  ) => void;
};

type EditorOptions = {
  onDelete: (id: string, type: AnimalType) => Promise<void>;
  onEdit: (id: string, type: AnimalType) => void;
};

type OwnerClickOptions = {
  onOwnerClick: (id: string, ownerLogin: string) => void;
};

type UserBaseTablePropsOptions = {
  type: 'editor';
  editorOptions: EditorOptions;
};

type BaseTablePropsOptions = {
  type: 'owner';
  ownerClickOptions: OwnerClickOptions;
};

export interface CommonBaseTableProps<T extends AnimalResponse> {
  data: T[];
  actionOptions: BaseTablePropsOptions | UserBaseTablePropsOptions;
  footerPaginationComponent: JSX.Element;
  loading: boolean;
  sortingOptions: SortingOptions | undefined;
}

export interface AnimalTableBaseProps<
  T extends AnimalResponse,
> extends CommonBaseTableProps<T> {
  additionalColumns?: ColumnDef<T>[];
}

export interface BaseTableProps<T extends AnimalResponse> extends Omit<
  CommonBaseTableProps<T>,
  'actionOptions'
> {
  columns: ColumnDef<T>[];
}
