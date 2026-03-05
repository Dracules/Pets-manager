import { useEffect, useState } from 'react';
import DogTable from './DogTable';
import { getDogs } from './apiClient';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDogs;
  }, []);

  const loadDogs = async () => {
    try {
      setLoading(true);
      const result = (await getDogs()) as [];
      setData(result);
    } catch (err) {
      err instanceof Error
        ? setError(err.stack!)
        : setError('Undefined error!');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  if (error)
    return (
      <div>
        <h1>Error: {error}</h1>
      </div>
    );

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dogs</h1>
      <button onClick={loadDogs}>Update</button>
      <DogTable data={data} />
    </div>
  );
}
