import useFetchData from '../model/useFetchData';
import { BaseTableProps } from '../model/BaseTableProps';
import { AnimalType } from '../../animal/model/animal.type';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { AnimalResponse } from '../../animal/model/animal.response.interface';

function BaseAnimalPage<T extends AnimalResponse>(
  AnimalTable: React.ComponentType<BaseTableProps<T>>,
  fetchFn: () => Promise<T[]>,
  deleteFn?: (id: string, type: AnimalType) => Promise<string>,
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

    async function handleEdit(id: string, type: AnimalType) {
      navigate(`/edit/${id}?type=${type}`);
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
