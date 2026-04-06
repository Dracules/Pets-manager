import useFetchData from '../model/useFetchData';
import { Animal } from '../../animal/model/animal.interface';
import { BaseTableProps } from '../model/BaseTableProps';
import { AnimalType } from '../../animal/model/animal.type';

function BaseAnimalPage<T extends Animal>(
  AnimalTable: React.ComponentType<BaseTableProps<T>>,
  fetchFn: () => Promise<T[]>,
  deleteFn?: (id: string, type?: AnimalType) => Promise<string>,
) {
  const { data, loading, error, setData } = useFetchData(fetchFn);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  async function handleDelete(id: string, type?: AnimalType | undefined) {
    setData((current) => current!.filter((animal) => animal._id !== id));
    return deleteFn!(id, type);
  }

  return (
    <div>
      <AnimalTable
        data={data ?? []}
        onDelete={deleteFn ? handleDelete : undefined}
      />
    </div>
  );
}

export default BaseAnimalPage;
