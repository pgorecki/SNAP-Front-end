import { useState, useCallback } from 'react';
import useApiClient from './useApiClient';

export default function useNewResource(url, initialData = {}) {
  const apiClient = useApiClient();
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const save = useCallback(
    async (payload) => {
      console.log('saving', payload);
      setSaving(true);
      try {
        const request = apiClient.post(url, payload);
        const result = await request;
        setData(result.data);
        setError(false);
        return result.data;
      } catch (e) {
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [url, apiClient]
  );

  return { data, error, save, saving };
}
