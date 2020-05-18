import { useState, useEffect } from 'react';
import useApiClient from './useApiClient';

function useFetchData(url, initialData = null) {
  const [apiClient] = useApiClient();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // function init() {
  //   setData(initialData);
  //   setLoading(true);
  //   setLoading(false);
  // }

  async function fetchData(query) {
    console.log('ff', query, url + query);
    // init();
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
  }

  useEffect(() => {
    fetchData(url);
  }, [apiClient, url]);

  return [data, error, loading, fetchData];
}

export default useFetchData;
