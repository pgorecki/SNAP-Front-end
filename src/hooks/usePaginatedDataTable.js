import React, { useState } from 'react';
import usePaginatedResourceIndex from 'hooks/usePaginatedResourceIndex';

export default function usePaginatedDataTable({
  url,
  initialPageNumber = 0,
  initialPageSize = 50,
}) {
  const [pageNumber] = useState(initialPageNumber);
  const [pageSize] = useState(initialPageSize);
  const resourceIndex = usePaginatedResourceIndex(url, pageNumber, pageSize);
  const [lastFetchParams, setLastFetchParams] = useState({});
  const [updatedRows, setUpdatedRows] = useState([]);

  const [indexData, setIndexData] = useState({
    results: [],
    count: 0,
    page_number: 1,
    page_size: 0,
  });

  const fetchData = async ({ pageIndex, pageSize, sortBy, filters }) => {
    setLastFetchParams({ pageIndex, pageSize, sortBy, filters });
    const data = await resourceIndex.fetchData(
      pageIndex + 1,
      pageSize,
      sortBy,
      filters
    );
    console.log('PaginatedDataTable page loaded', {
      pageIndex,
      pageSize,
      sortBy,
      filters,
      data,
    });
    setIndexData(data);
    setUpdatedRows(new Array(data.results.length));
  };

  const updateRow = (row, data) => {
    setUpdatedRows((prev) => {
      const current = [...prev];
      current[row.index] = {
        ...row.original,
        ...data,
      };
      return current;
    });
  };

  const data = indexData.results.map((r, i) => ({ ...r, ...updatedRows[i] }));

  return {
    url,
    data,
    totalCount: indexData.count,
    totalPages: indexData.total_pages,
    pageNumber,
    pageSize,
    loading: resourceIndex.loading,
    error: resourceIndex.error,
    ready: resourceIndex.ready,
    updateRow,
    fetchData,
    reload: () => fetchData(lastFetchParams),
  };
}
