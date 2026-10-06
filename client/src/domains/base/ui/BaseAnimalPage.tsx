import useFetchData from '../model/useFetchData';
import { CommonBaseTableProps } from '../model/BaseTableProps';
import { AnimalType } from '../../animal/model/animal.type';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { AnimalResponse } from '../../animal/model/animal.response.interface';
import { useCallback, useMemo } from 'react';
import { PaginationResult } from '../../../shared/model/interfaces/pagination.result';
import PaginationComponent from './PaginationComponent';
import { LoadErrorComponent } from './ErrorComponent';

const EMPTY_ARRAY: never[] = [];

function BaseAnimalPage<T extends AnimalResponse>(
  AnimalTable: React.ComponentType<CommonBaseTableProps<T>>,
  fetchFn: (options: string, id?: string) => Promise<PaginationResult<T[]>>,
  deleteFn?: (id: string, type: AnimalType) => Promise<string>,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '0', 10);
  const pageLimit = parseInt(searchParams.get('limit') || '10', 10);
  const { id } = useParams();

  const { data, totalCount, loading, error, setData, load } = useFetchData(
    fetchFn,
    page,
    pageLimit,
    id,
  );
  const navigate = useNavigate();

  const updatePageParams = useCallback(
    (newPage: number, newLimit: number) => {
      setSearchParams({
        page: newPage.toString(),
        limit: newLimit.toString(),
      });
    },
    [setSearchParams],
  );

  const paginationComponent = useMemo(
    () => (
      <PaginationComponent
        page={page}
        setPage={(newPage) => updatePageParams(newPage, pageLimit)}
        pageLimit={pageLimit}
        setPageLimit={(newLimit) => updatePageParams(0, newLimit)} // При смене лимита сбрасываем на первую страницу
        totalCount={totalCount}
      />
    ),
    [page, pageLimit, totalCount, updatePageParams],
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
