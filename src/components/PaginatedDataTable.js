import React, { useState, useEffect } from 'react';
import usePaginatedResourceIndex from 'hooks/usePaginatedResourceIndex';
import ControlledTable from './ControlledTable';

export default function PaginatedDataTable({ url, columns }) {
  const [pageNumber] = useState(1);
  const [pageSize] = useState(2);
  const resourceIndex = usePaginatedResourceIndex(url, pageNumber, pageSize);
  const [indexData, setIndexData] = useState({
    results: [],
    count: 0,
    page_number: 1,
    page_size: 0,
  });
  const [updatedRows, setUpdatedRows] = useState([]);

  const data = indexData.results.map((r, i) => ({ ...r, ...updatedRows[i] }));

  const fetchData = async ({ pageIndex, pageSize }) => {
    const data = await resourceIndex.fetchData(pageIndex + 1, pageSize);
    console.log('PaginatedDataTable page loaded', {
      pageIndex,
      pageSize,
      data,
    });
    setIndexData(data);
    setUpdatedRows(new Array(data.results.length));
  };

  return (
    <ControlledTable
      data={data}
      columns={columns}
      fetchData={fetchData}
      loading={resourceIndex.loading}
      pageNumber={pageNumber}
      pageSize={pageSize}
      totalCount={resourceIndex.data ? resourceIndex.data.count : 0}
      pageCount={resourceIndex.data ? resourceIndex.data.total_pages : 0}
    />
  );
}
