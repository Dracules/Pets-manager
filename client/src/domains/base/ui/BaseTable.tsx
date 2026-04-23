import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { BaseTableProps } from '../model/BaseTableProps';
import { AnimalResponse } from '../../animal/model/animal.response.interface';
import { AnimalType } from '../../animal/model/animal.type';

export default function BaseTable<T extends AnimalResponse>({
  data,
  columns = [],
  options,
}: BaseTableProps<T>) {
  function getFinalColumns() {
    if (options) {
      const { onDelete, onEdit } = options;

      const actionColumn: ColumnDef<T> = {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <>
            <button
              onClick={() => {
                'type' in row.original
                  ? onEdit(row.original._id, row.original.type as AnimalType)
                  : onEdit(row.original._id);
              }}
            >
              Edit
            </button>
            <button
              onClick={async () => {
                'type' in row.original
                  ? await onDelete(
                      row.original._id,
                      row.original.type as AnimalType,
                    )
                  : await onDelete(row.original._id);
              }}
            >
              Delete
            </button>
          </>
        ),
      };
      return [...columns, actionColumn];
    }
    return columns;
  }

  const table = useReactTable({
    data,
    columns: getFinalColumns(),
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
