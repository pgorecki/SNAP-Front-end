import { useState, useEffect, useCallback } from 'react';
import useApiClient from './useApiClient';

export default function useResource(url, initialData = {}) {
  const apiClient = useApiClient();
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiClient.get(url);
      setData(result.data);
      setError(null);
    } catch (e) {
      setError(e.response);
      setData(false);
    }
    setLoading(false);
  }, [url, apiClient]);

  const save = useCallback(
    async (payload) => {
      setSaving(true);
      try {
        if (payload.address === null) {
          delete payload.address;
        }
        const request = apiClient.put(url, payload);
        const result = await request;
        setData(result.data);
        setError(null);
        return result.data;
      } catch (e) {
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [url, apiClient]
  );

  useEffect(() => {
    if (url) {
      load();
    }
  }, [url, load]);

  return { data, error, load, loading, save, saving };
}
