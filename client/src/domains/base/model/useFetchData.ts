import { useState, useEffect } from 'react';
import { PaginationResult } from '../../../shared/model/interfaces/pagination.result';

function useFetchData<T>(
  fetchFn: (options: string) => Promise<PaginationResult<T>>,
  page: number,
  pageLimit: number,
) {
  const [data, setData] = useState<T | null>(null);
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
      setError('');
    } catch (err) {
      if (err instanceof Error) setError(err.stack!);
      else setError('Undefined error!');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, setData };
}

export default useFetchData;
