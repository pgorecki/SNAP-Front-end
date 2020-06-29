import { useState, useCallback, useEffect } from 'react';
import useApiClient from './useApiClient';

function useFetchData(url, initialData = null) {
  const apiClient = useApiClient();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = useCallback(
    async (query) => {
      setLoading(true);
      try {
        const result = await apiClient.get(url + query);
        setData(result.data);
        setError(false);
      } catch (e) {
        setError(e.response);
        setData(false);
      }
      setLoading(false);
    },
    [apiClient, url]
  );

  useEffect(() => {
    fetchData(url);
  }, [fetchData, url]);

  return [data, error, loading, fetchData];
}

export default useFetchData;
