import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { BaseTableProps } from '../model/BaseTableProps';
import { AnimalResponse } from '../../animal/model/animal.response.interface';
import styles from './css/BaseTable.module.css';
import LoadingComponent from '../../../shared/ui/LoadingComponent';
import { useMemo } from 'react';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    size?: number;
  }
}

export default function BaseTable<T extends AnimalResponse>({
  data,
  columns = [],
  footerPaginationComponent,
  loading,
}: BaseTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
          headerGroup.headers.map((header) => (
            <div
              className={`${styles.th} ${styles.headerCell}`}
              key={header.id}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </div>
          )),
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
