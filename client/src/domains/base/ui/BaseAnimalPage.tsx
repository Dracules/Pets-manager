import useFetchData from '../model/useFetchData';
import { Animal } from '../../animal/model/animal.interface';
import { BaseTableProps } from '../model/BaseTableProps';

function BaseAnimalPage<T extends Animal>(
  AnimalTable: React.ComponentType<BaseTableProps<T>>,
  fetchFn: () => Promise<T[]>,
  deleteFn?: (id: string) => Promise<string>,
) {
  const { data, loading, error } = useFetchData(fetchFn);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <div>
      <AnimalTable data={data ?? []} onDelete={deleteFn} />
    </div>
  );
}

export default BaseAnimalPage;
