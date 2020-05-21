import useFetchData from './useFetchData';

export default function useFetchResourceIndex(url, initialData = null) {
  // for now we are using pagination but we should make non-paginated requests in the future
  // (or set max page size to something big)
  const [data, error, loading, fetchData] = useFetchData(url, initialData);

  return {
    data: data.results || initialData,
    error,
    loading,
    fetchData,
  };
}
