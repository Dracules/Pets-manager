import useFetchData from '../model/useFetchData';
import type { CommonBaseTableProps } from '../model/BaseTableProps';
import type { AnimalType } from '../../animal/model/animal.type';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import type { AnimalResponse } from '../../animal/model/animal.response.interface';
import { useCallback, useMemo } from 'react';
import type { PaginationResult } from '../../../shared/model/interfaces/pagination.result';
import PaginationComponent from './PaginationComponent';
import { LoadErrorComponent } from './ErrorComponent';
import { SortingState } from '@tanstack/react-table';
import {
  isSortColumn,
  SortColumns,
} from '../../../shared/model/types/sort.columns';

const EMPTY_ARRAY: never[] = [];

function BaseAnimalPage<T extends AnimalResponse>(
  AnimalTable: React.ComponentType<CommonBaseTableProps<T>>,
  fetchFn: (options: string, id?: string) => Promise<PaginationResult<T[]>>,
  deleteFn?: (id: string, type: AnimalType) => Promise<string>,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const pageLimit = parseInt(searchParams.get('limit') || '10', 10);
  const page = urlPage - 1;

  const sortByParam = searchParams.get('sortBy');
  const sortBy: SortColumns | undefined = isSortColumn(sortByParam)
    ? sortByParam
    : undefined;
  const sortOrder = searchParams.get('sortOrder') || undefined;

  const { id } = useParams();

  const { data, totalCount, loading, error, setData, load } = useFetchData(
    fetchFn,
    page,
    pageLimit,
    sortBy,
    sortOrder === 'desc' ? 'desc' : 'asc',
    id,
  );
  const navigate = useNavigate();

  const updatePageParams = useCallback(
    (
      newPage: number,
      newLimit: number,
      currentSortBy?: string,
      currentSortOrder?: string,
    ) => {
      const params: Record<string, string> = {
        page: (newPage + 1).toString(),
        limit: newLimit.toString(),
      };

      if (newPage === 0) delete params.page;
      if (currentSortBy) params.sortBy = currentSortBy;
      if (currentSortOrder) params.sortOrder = currentSortOrder;

      setSearchParams(params);
    },
    [setSearchParams],
  );

  const tableSortingState = useMemo<SortingState>(() => {
    if (!sortBy) return [];
    return [{ id: sortBy, desc: sortOrder === 'desc' }];
  }, [sortBy, sortOrder]);

  const handleSortingChange = useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      const newSorting =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(tableSortingState)
          : updaterOrValue;

      const sortState = newSorting[0];

      const params: Record<string, string> = {
        page: (page + 1).toString(),
        limit: pageLimit.toString(),
      };

      if (page === 0) delete params.page;

      if (sortState) {
        params.sortBy = sortState.id;
        params.sortOrder = sortState.desc ? 'desc' : 'asc';
      }

      setSearchParams(params);
    },
    [tableSortingState, page, pageLimit, setSearchParams],
  );

  const paginationComponent = useMemo(
    () => (
      <PaginationComponent
        page={page}
        setPage={(newPage) =>
          updatePageParams(newPage, pageLimit, sortBy, sortOrder)
        }
        pageLimit={pageLimit}
        setPageLimit={(newLimit) =>
          updatePageParams(0, newLimit, sortBy, sortOrder)
        }
        totalCount={totalCount}
      />
    ),
    [page, pageLimit, totalCount, updatePageParams, sortBy, sortOrder],
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

  const tableSortingOptions = useMemo(
    () => ({
      sorting: tableSortingState,
      onSortingChange: handleSortingChange,
    }),
    [tableSortingState, handleSortingChange],
  );

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
        sortingOptions={tableSortingOptions}
      />
    </div>
  );
}

export default BaseAnimalPage;
