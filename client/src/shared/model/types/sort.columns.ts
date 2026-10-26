const SORT_COLUMNS = ['name', 'birthDate', 'litterStatus'] as const;

export type SortColumns = (typeof SORT_COLUMNS)[number];
