import * as React from 'react';
import Pagination from '@mui/material/Pagination';

export default function PaginationRounded({
  setPage,
  count,
}: {
  setPage: (page:number)=>void;
  count: number;
}) {
  return (
    <Pagination
      count={count}
      variant="outlined"
      shape="rounded"
      onChange={(e, page) => setPage(page)}
    />
  );
}
