import { useState, useEffect } from 'react';

function useFetchData<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    void load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const result = (await fetchFn()) as T;
      setData(result);
      setError('');
    } catch (err) {
      if (err instanceof Error) setError(err.stack!);
      else setError('Undefined error!');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, reload: load };
}

export default useFetchData;
