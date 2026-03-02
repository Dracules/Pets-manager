import { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/animals/dogs');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.stack);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dogs</h1>
      <button onClick={fetchData}>🔄 Update</button>
      <table>
        {data && Array.isArray(data) ? (
          data.map((element) => {
            return (
              <tr key={element.id}>
                {Object.keys(element).map((key) => (
                  <td key={key}>
                    {key}: {element[key]}
                  </td>
                ))}
              </tr>
            );
          })
        ) : (
          <p></p>
        )}
      </table>
    </div>
  );
}
