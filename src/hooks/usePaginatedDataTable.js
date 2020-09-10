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

  const initialIndexData = {
    results: [],
    count: 0,
    page_number: 1,
    page_size: 0,
  };

  const [indexData, setIndexData] = useState(initialIndexData);

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
    const rowsCount = data ? data.results.length : 0;
    setUpdatedRows(new Array(rowsCount));
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

  const safeIndexData = indexData || initialIndexData;

  const data = safeIndexData.results.map((r, i) => ({
    ...r,
    ...updatedRows[i],
  }));

  return {
    url,
    data,
    totalCount: safeIndexData.count,
    totalPages: safeIndexData.total_pages,
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
