import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

export default function useUrlParams() {
  const urlParams = useParams();
  const location = useLocation();
  const [queryParams, setQueryParams] = useState({});
  const [fragment, setFragment] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const entries = {};
    for (let [key, value] of searchParams.entries()) {
      entries[key] = value;
    }
    setQueryParams(entries);
    setFragment((location.hash.length && location.hash.substring(1)) || '');
  }, [location]);

  return [urlParams, queryParams, fragment];
}
