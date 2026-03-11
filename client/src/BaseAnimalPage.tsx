import useFetchData from './hooks/useFetchData';
import { Animal } from './interfaces/animal.interface';
import { BaseTableProps } from './interfaces/BaseTableProps';

function BaseAnimalPage<T extends Animal>(
  fetchFn: () => Promise<T[]>,
  AnimalTable: React.ComponentType<BaseTableProps<T>>,
) {
  const { data, loading, error, reload } = useFetchData(fetchFn);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <div>
      <button onClick={reload}>Update</button>
      <AnimalTable data={data ?? []} />
    </div>
  );
}

export default BaseAnimalPage;
