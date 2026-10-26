import { type ColumnDef } from '@tanstack/react-table';
import BaseTable from './BaseTable';
import type { AnimalTableBaseProps } from '../model/BaseTableProps';
import { useMemo } from 'react';
import type { AnimalResponse } from '../../animal/model/animal.response.interface';
import {
  AnimalIcon,
  CatIcon,
  DogIcon,
  ParrotIcon,
} from '../../../shared/ui/Icons';
import styles from './css/AnimalTableBase.module.css';

const baseColumns: ColumnDef<AnimalResponse>[] = [
  {
    id: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.type;
      let IconComponent = AnimalIcon;

      switch (type) {
        case 'cat':
          IconComponent = CatIcon;
          break;
        case 'dog':
          IconComponent = DogIcon;
          break;
        case 'parrot':
          IconComponent = ParrotIcon;
          break;
      }

      return (
        <div className={styles.iconWrapper}>
          <IconComponent className={styles.icon} />
        </div>
      );
    },
    meta: { size: 70 },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    meta: { size: 170 },
    enableSorting: true,
  },
  {
    accessorKey: 'age',
    header: 'Age',
    meta: { size: 170 },
    enableSorting: true,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    enableSorting: false,
  },
];

function AnimalTableBase<T extends AnimalResponse>({
  data,
  options,
  footerPaginationComponent,
  loading,
  additionalColumns,
}: AnimalTableBaseProps<T>) {
  const sharedColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols = [...baseColumns] as ColumnDef<T>[];

    if (additionalColumns) cols.push(...additionalColumns);

    if ('onOwnerClick' in options) {
      cols.push({
        accessorKey: 'owner.login',
        header: 'Owner',
        cell: ({ row }) => {
          if (!row.original.owner?.login) {
            return <span className={styles.noOwner}>Not found</span>;
          }
          return (
            <a
              href="#"
              className={styles.ownerLink}
              onClick={(e) => {
                e.preventDefault();
                options.onOwnerClick(
                  row.original.owner._id,
                  row.original.owner.login,
                );
              }}
            >
              {row.original.owner.login}
            </a>
          );
        },
        meta: { size: 170 },
        enableSorting: false,
      });
    } else {
      const { onDelete, onEdit } = options;

      const actionColumn: ColumnDef<T> = {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className={styles.actions}>
            <button
              className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
              onClick={() => {
                onEdit(row.original._id, row.original.type);
              }}
            >
              Edit
            </button>
            <button
              className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
              onClick={() => {
                void onDelete(row.original._id, row.original.type);
              }}
            >
              Delete
            </button>
          </div>
        ),
        meta: { size: 150 },
        enableSorting: false,
      };
      cols.push(actionColumn);
    }
    return cols;
  }, [options, additionalColumns]);

  return (
    <BaseTable
      data={data}
      columns={sharedColumns}
      footerPaginationComponent={footerPaginationComponent}
      loading={loading}
    />
  );
}

export default AnimalTableBase;
