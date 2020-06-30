import useFetchData from './useFetchData';

export default function usePaginatedResourceIndex(
  url,
  pageNumber,
  pageSize,
  initialData = null
) {
  const [baseUrl, query, ...other] = url.split('?');
  const params = new URLSearchParams(query);
  if (pageNumber) {
    params.set('page', pageNumber);
  }
  if (pageSize) {
    params.set('page_size', pageSize);
  }

  const [data, error, loading, fetchDataOriginal] = useFetchData(
    [baseUrl, params.toString(), ...other].join('?'),
    initialData
  );

  const fetchData = async (pageNumber, pageSize, sortBy, filters) => {
    const [baseUrl, query, ...other] = url.split('?');
    const params = new URLSearchParams(query);
    if (pageNumber) {
      params.set('page', pageNumber);
    }
    if (pageSize) {
      params.set('page_size', pageSize);
    }
    if (Array.isArray(sortBy) && sortBy.length) {
      const orderingValue = sortBy.map(({ id, desc }) =>
        desc ? `-${id}` : `${id}`
      );
      params.set('ordering', orderingValue);
    }
    const newUrl = [baseUrl, params.toString(), ...other].join('?');
    console.log({ baseUrl, newUrl, pageNumber, pageSize });
    return await fetchDataOriginal(newUrl);
  };

  return {
    data,
    error,
    loading,
    ready: !loading && !error,
    fetchData,
  };
}
