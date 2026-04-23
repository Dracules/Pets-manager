import useFetchData from '../model/useFetchData';
import { BaseTableProps } from '../model/BaseTableProps';
import { AnimalType } from '../../animal/model/animal.type';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { AnimalResponse } from '../../animal/model/animal.response.interface';
type BaseAnimalPageOptions = {
  deleteFn: (id: string, type?: AnimalType) => Promise<string>;
  animalType?: AnimalType;
};

function BaseAnimalPage<T extends AnimalResponse>(
  AnimalTable: React.ComponentType<BaseTableProps<T>>,
  fetchFn: () => Promise<T[]>,
  options?: BaseAnimalPageOptions,
) {
  const { data, loading, error, setData } = useFetchData(fetchFn);
  const navigate = useNavigate();

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  if (options) {
    const { deleteFn, animalType } = options;

    async function handleDelete(id: string, type?: AnimalType | undefined) {
      const toastId = toast.loading('Deleting...');
      try {
        const response = await deleteFn(id, type);
        setData((current) => current!.filter((animal) => animal._id !== id));
        toast(response);
      } catch {
        toast('Deletion failed!');
      } finally {
        toast.dismiss(toastId);
      }
    }

    async function handleEdit(id: string, type?: AnimalType | undefined) {
      if (!!type === !!animalType)
        throw new Error(
          'AnimalTypeError: AnimalType value duplication detected - cannot proceed to editor.',
        );
      navigate(`/edit/${id}?type=${type || animalType}`);
    }

    return (
      <div>
        <AnimalTable
          data={data ?? []}
          options={{ onDelete: handleDelete, onEdit: handleEdit }}
        />
      </div>
    );
  } else
    return (
      <div>
        <AnimalTable data={data ?? []} />
      </div>
    );
}

export default BaseAnimalPage;
