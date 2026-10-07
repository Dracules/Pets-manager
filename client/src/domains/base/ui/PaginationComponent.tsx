import Pagination from '@mui/material/Pagination';
import styles from './css/PaginationComponent.module.css';

interface PaginationProps {
  setPageLimit: (rowsPerPage: number) => void;
  page: number;
  setPage: (page: number) => void;
  pageLimit: number;
  totalCount: number;
}

export default function PaginationComponent({
  page,
  setPage,
  pageLimit,
  setPageLimit,
  totalCount,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageLimit);

  return (
    <div className={styles.container}>
      <div className={styles.pageSizeControl}>
        <span className={styles.pageSizeLabel}>Rows per page:</span>
        <select
          className={styles.pageSizeSelect}
          value={pageLimit}
          onChange={(e) => {
            setPageLimit(parseInt(e.target.value, 10));
          }}
        >
          {[5, 10, 25].map((limit) => (
            <option key={limit} value={limit}>
              {limit}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.paginationWrapper}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(_, value) => setPage(value - 1)}
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={0}
          color="primary"
          shape="rounded"
        />
      </div>
    </div>
  );
}
