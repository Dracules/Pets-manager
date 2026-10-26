const SORT_COLUMNS = ['name', 'birthDate', 'litterStatus'] as const;

export type SortColumns = (typeof SORT_COLUMNS)[number];

export function isSortColumn(value: string | null): value is SortColumns {
  return value !== null && (SORT_COLUMNS as readonly string[]).includes(value);
}
