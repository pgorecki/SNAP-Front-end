import { useState, useEffect, useCallback } from 'react';
import useApiClient from './useApiClient';

export default function useResource(url, initialData = {}) {
  const [apiClient] = useApiClient();
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    console.log('loading', url);
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
      console.log('saving', payload);
      setSaving(true);
      try {
        const request = payload.id
          ? apiClient.put(url, payload)
          : apiClient.post(url, payload);
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
