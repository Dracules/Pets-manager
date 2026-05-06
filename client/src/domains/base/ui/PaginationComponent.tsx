import Pagination from '@mui/material/Pagination';

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
    <div
      style={{
        marginTop: '10px',
      }}
    >
      <div style={{ marginBottom: '10px' }}>
        <span>Rows per page</span>
        <select
          value={pageLimit}
          onChange={(e) => {
            setPageLimit(parseInt(e.target.value, 10));
            setPage(0);
          }}
        >
          {[5, 10, 25].map((limit) => (
            <option key={limit} value={limit}>
              {limit}
            </option>
          ))}
        </select>
      </div>
      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={(_, value) => setPage(value - 1)}
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={0}
      />
    </div>
  );
}
