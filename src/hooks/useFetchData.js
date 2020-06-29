import { useCallback, useState, useEffect } from 'react';
import useApiClient from './useApiClient';

function useFetchData(url, initialData = null) {
  const apiClient = useApiClient();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiClient.get(url);
      setData(result.data);
      setError(false);
      return result.data;
    } catch (e) {
      setError(e.response);
      setData(false);
    } finally {
      setLoading(false);
    }
  }, [apiClient, url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [data, error, loading, fetchData];
}

export default useFetchData;
