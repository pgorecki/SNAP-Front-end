import { useCallback, useState, useEffect } from 'react';
import useFetchData from './useFetchData';

export default function usePaginatedResourceIndex(url, initialData = null) {
  const [data, error, loading, fetchData] = useFetchData(url, initialData);

  return {
    data,
    error,
    loading,
    fetchData,
  };
}
