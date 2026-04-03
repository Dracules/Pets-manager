import useFetchData from '../model/useFetchData';
import { Animal } from '../model/animal.interface';
import { BaseTableProps } from '../model/BaseTableProps';

function BaseAnimalPage<T extends Animal>(
  AnimalTable: React.ComponentType<BaseTableProps<T>>,
  fetchFn: () => Promise<T[]>,
) {
  const { data, loading, error } = useFetchData(fetchFn);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <div>
      <AnimalTable data={data ?? []} />
    </div>
  );
}

export default BaseAnimalPage;
