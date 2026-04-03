import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { BaseTableProps } from '../model/BaseTableProps';
import { Animal } from '../../animal/model/animal.interface';


export default function BaseTable<T extends Animal>({
  data,
  columns = [],
  onDelete,
}: BaseTableProps<T>) {
  const actionColumn: ColumnDef<T> = {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <button
        onClick={async () => {
          await onDelete?.(row.original.id);
        }}
      >
        Delete
      </button>
    ),
  };
  const finalColumns = onDelete ? [...columns, actionColumn] : columns;

  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th colSpan={header.colSpan} key={header.id}>
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
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
