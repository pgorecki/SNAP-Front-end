import axios from 'axios';
import { useContext, useMemo } from 'react';
import { AppContext } from '../AppStore';

export default function useApiClient() {
  const [ctx] = useContext(AppContext);
  const accessToken = ctx.user && ctx.user.token;

  const instance = useMemo(() => {
    const headers = {
      Accept: 'application/json',
    };

    const authHeaders = accessToken && {
      Authorization: `Token ${accessToken}`,
    };

    return axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URL,
      headers: {
        ...headers,
        ...authHeaders,
      },
    });
  }, [accessToken]);

  return instance;
}
