import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

export default function useUrlParams() {
  const params = useParams();
  const location = useLocation();

  const [searchParams, setSearchParams] = useState(new URLSearchParams());
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setSearchParams(searchParams);
  }, [location]);

  return [params, searchParams];
}
