import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import type { BaseTableProps } from '../model/BaseTableProps';
import type { AnimalResponse } from '../../animal/model/animal.response.interface';
import styles from './css/BaseTable.module.css';
import LoadingComponent from '../../../shared/ui/LoadingComponent';
import { memo, useMemo } from 'react';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    size?: number;
  }
}

function BaseTable<T extends AnimalResponse>({
  data,
  columns = [],
  footerPaginationComponent,
  loading,
  sortingOptions,
}: BaseTableProps<T>) {
  const sortingOptionsObj = useMemo(
    () =>
      sortingOptions
        ? {
            manualSorting: true,
            state: {
              sorting: sortingOptions.sorting,
            },
            onSortingChange: sortingOptions.onSortingChange,
          }
        : {},
    [sortingOptions],
  );

  const table = useReactTable({
    ...sortingOptionsObj,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const gridTemplateColumns = useMemo(() => {
    const columns = table.getVisibleLeafColumns();

    return columns
      .map((column) => {
        const size = column.columnDef.meta?.size;

        if (size) {
          return `${size}px`;
        } else return '1fr';
      })
      .join(' ');
  }, [table.options.columns]);

  return (
    <div className={styles.tableContainer}>
      <div
        className={styles.table}
        style={{ '--grid-cols': gridTemplateColumns } as React.CSSProperties}
      >
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const isSorted = header.column.getIsSorted();

            return (
              <div
                className={`${styles.th} ${styles.headerCell} ${canSort ? styles.sortableHeader : ''}`}
                key={header.id}
                onClick={
                  canSort ? header.column.getToggleSortingHandler() : undefined
                }
                style={{
                  cursor: canSort ? 'pointer' : 'default',
                  userSelect: 'none',
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}

                {canSort && (
                  <span
                    className={`${styles.sortIcon} ${isSorted ? styles.sortIconActive : ''}`}
                  >
                    {isSorted === 'asc' ? (
                      header.id === 'birthDate' ? (
                        <FaSortDown />
                      ) : (
                        <FaSortUp />
                      )
                    ) : isSorted === 'desc' ? (
                      header.id === 'birthDate' ? (
                        <FaSortUp />
                      ) : (
                        <FaSortDown />
                      )
                    ) : (
                      <FaSort />
                    )}
                  </span>
                )}
              </div>
            );
          }),
        )}

        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.flatMap((row) =>
            row.getVisibleCells().map((cell) => (
              <div key={cell.id} className={styles.td}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            )),
          )
        ) : (
          <div className={`${styles.td} ${styles.noData} ${styles.fullWidth}`}>
            No data available
          </div>
        )}

        {!!table.getRowModel().rows.length && (
          <div
            className={`${styles.td} ${styles.fullWidth} ${styles.tfootCell}`}
          >
            {footerPaginationComponent}
          </div>
        )}
      </div>

      {loading && (
        <div className={styles.tableLoaderOverlay}>
          <LoadingComponent />
        </div>
      )}
    </div>
  );
}

export default memo(BaseTable) as typeof BaseTable;
