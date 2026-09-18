import useFetchData from '../model/useFetchData';
import { CommonBaseTableProps } from '../model/BaseTableProps';
import { AnimalType } from '../../animal/model/animal.type';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import { AnimalResponse } from '../../animal/model/animal.response.interface';
import { useMemo, useState } from 'react';
import { PaginationResult } from '../../../shared/model/interfaces/pagination.result';
import PaginationComponent from './PaginationComponent';
import { LoadErrorComponent } from './ErrorComponent';

const EMPTY_ARRAY: never[] = [];

function BaseAnimalPage<T extends AnimalResponse>(
  AnimalTable: React.ComponentType<CommonBaseTableProps<T>>,
  fetchFn: (options: string, id?: string) => Promise<PaginationResult<T[]>>,
  deleteFn?: (id: string, type: AnimalType) => Promise<string>,
) {
  const [page, setPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const { id } = useParams();

  const { data, totalCount, loading, error, setData, load } = useFetchData(
    fetchFn,
    page,
    pageLimit,
    id,
  );
  const navigate = useNavigate();

  const paginationComponent = useMemo(
    () => (
      <PaginationComponent
        page={page}
        setPage={setPage}
        pageLimit={pageLimit}
        setPageLimit={setPageLimit}
        totalCount={totalCount}
      />
    ),
    [page, pageLimit, totalCount],
  );

  const tableOptions = useMemo(() => {
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

      function handleEdit(id: string, type: AnimalType) {
        void navigate(`/edit/${id}?type=${type}`);
      }

      return {
        onDelete: handleDelete,
        onEdit: handleEdit,
      };
    }

    function handleOwnerClick(id: string, ownerLogin: string) {
      void navigate(`/owner/${id}/`, { state: { ownerLogin } });
    }

    return {
      onOwnerClick: handleOwnerClick,
    };
  }, [deleteFn]);

  if (error)
    return (
      <LoadErrorComponent
        error={error}
        load={() => void load()}
        loading={loading}
      />
    );

  return (
    <div>
      <AnimalTable
        data={data ?? EMPTY_ARRAY}
        options={tableOptions}
        footerPaginationComponent={paginationComponent}
        loading={loading}
      />
    </div>
  );
}

export default BaseAnimalPage;
