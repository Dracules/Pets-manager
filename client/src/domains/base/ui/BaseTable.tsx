import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { BaseTableProps } from '../model/BaseTableProps';
import { AnimalResponse } from '../../animal/model/animal.response.interface';
import styles from './css/BaseTable.module.css';

export default function BaseTable<T extends AnimalResponse>({
  data,
  columns = [],
  options,
  footerPaginationComponent,
}: BaseTableProps<T>) {
  const finalColumns = (function getFinalColumns() {
    if (options) {
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
              onClick={async () => {
                await onDelete(row.original._id, row.original.type);
              }}
            >
              Delete
            </button>
          </div>
        ),
      };
      return [...columns, actionColumn];
    }
    return columns;
  })();

  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className={styles.th}
                  colSpan={header.colSpan}
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={styles.tbody}>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className={styles.td} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={finalColumns.length}
                className={`${styles.td} ${styles.noData}`}
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
        {!!table.getRowModel().rows.length && (
          <tfoot className={styles.tfoot}>
            <tr>
              <td colSpan={finalColumns.length} className={styles.td}>
                {footerPaginationComponent}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
