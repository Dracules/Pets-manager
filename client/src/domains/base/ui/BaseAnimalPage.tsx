import useFetchData from '../model/useFetchData';
import { CommonBaseTableProps } from '../model/BaseTableProps';
import { AnimalType } from '../../animal/model/animal.type';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { AnimalResponse } from '../../animal/model/animal.response.interface';
import { useState } from 'react';
import { PaginationResult } from '../../../shared/model/interfaces/pagination.result';
import PaginationComponent from './PaginationComponent';
import { ErrorComponent } from './ErrorComponent';

function BaseAnimalPage<T extends AnimalResponse>(
  AnimalTable: React.ComponentType<CommonBaseTableProps<T>>,
  fetchFn: (options: string, id?: string) => Promise<PaginationResult<T[]>>,
  deleteFn?: (id: string, type: AnimalType) => Promise<string>,
) {
  const [page, setPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);

  const { data, totalCount, loading, error, setData, load } = useFetchData(
    fetchFn,
    page,
    pageLimit,
  );
  const navigate = useNavigate();

  if (error)
    return <ErrorComponent error={error} load={load} loading={loading} />;

  const paginationComponent = (
    <PaginationComponent
      page={page}
      setPage={setPage}
      pageLimit={pageLimit}
      setPageLimit={setPageLimit}
      totalCount={totalCount}
    />
  );

  if (deleteFn) {
    async function handleDelete(id: string, type: AnimalType) {
      const toastId = toast.loading('Deleting...');
      try {
        const response = await deleteFn!(id, type);
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
          footerPaginationComponent={paginationComponent}
          loading={loading}
        />
      </div>
    );
  } else
    return (
      <div>
        <AnimalTable
          data={data ?? []}
          footerPaginationComponent={paginationComponent}
          loading={loading}
        />
      </div>
    );
}

export default BaseAnimalPage;
