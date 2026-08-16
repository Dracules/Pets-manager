import { useState, useEffect, useCallback } from 'react';
import { PaginationResult } from '../../../shared/model/interfaces/pagination.result';

function useFetchData<T>(
  fetchFn: (options: string, id?: string) => Promise<PaginationResult<T>>,
  page: number,
  pageLimit: number,
  id?: string,
) {
  const [data, setData] = useState<T | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchFn(`?page=${page + 1}&limit=${pageLimit}`, id);
      setData(result.animals);
      setTotalCount(result.totalCount);
      setError('');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Undefined error! Failed to load data.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, pageLimit, id]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, totalCount, loading, error, setData, load };
}

export default useFetchData;
