import React from 'react';

import ControlledTable from './ControlledTable';

export default function PaginatedDataTable({ table, columns }) {
  // use in conjunction with usePaginatedDataTable
  return (
    <ControlledTable
      columns={columns}
      data={table.data}
      fetchData={table.fetchData}
      pageNumber={table.pageNumber}
      pageSize={table.pageSize}
      totalCount={table.totalCount}
      loading={table.loading}
      pageCount={table.totalPages}
      setUpdatedRows={table.setUpdatedRows}
    />
  );
}
