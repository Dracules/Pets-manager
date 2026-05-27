import { useState, useEffect } from 'react';
import { PaginationResult } from '../../../shared/model/interfaces/pagination.result';

function useFetchData<T>(
  fetchFn: (options: string) => Promise<PaginationResult<T>>,
  page: number,
  pageLimit: number,
) {
  const [data, setData] = useState<T | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void load();
  }, [page, pageLimit]);

  const load = async () => {
    setLoading(true);
    try {
      const result = await fetchFn(`?page=${page + 1}&limit=${pageLimit}`);
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
  };

  return { data, totalCount, loading, error, setData, load };
}

export default useFetchData;
