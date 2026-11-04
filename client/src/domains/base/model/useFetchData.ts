import { useState, useEffect, useCallback } from 'react';
import type { PaginationResult } from '../../../shared/model/interfaces/pagination.result';
import { SortDirection } from '@tanstack/react-table';
import { SortColumns } from '../../../shared/model/types/sort.columns';
import axios, { AxiosError } from 'axios';

function useFetchData<T>(
  fetchFn: (options: string, id?: string) => Promise<PaginationResult<T>>,
  page: number,
  pageLimit: number,
  sortBy: SortColumns | undefined,
  sortOrder: SortDirection,
  id?: string,
) {
  const [data, setData] = useState<T | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let options = `?page=${page + 1}&limit=${pageLimit}`;
      if (sortBy) options += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      const result = await fetchFn(options, id);
      setData(result.animals);
      setTotalCount(result.totalCount);
      setError('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;
        const serverMessage = axiosError.response?.data?.message;
        setError(serverMessage || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Undefined error! Failed to load data.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageLimit, id, sortBy, sortOrder]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, totalCount, loading, error, setData, load };
}

export default useFetchData;
