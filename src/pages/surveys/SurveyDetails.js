import React from 'react';
import { Header } from 'semantic-ui-react';
import useFetchData from '../../hooks/useFetchData';
import useUrlParams from '../../hooks/useUrlParams';
import DetailsPage from '../DetailsPage';
import { formatApiError } from '../../utils/apiUtils';

export default function SurveyDetails() {
  const [urlParams, queryParams] = useUrlParams();
  console.log(urlParams);
  const [data, error, loading, fetchData] = useFetchData(
    `/surveys/${urlParams.id}`
  );
  return (
    <DetailsPage loading={loading} error={formatApiError(error)}>
      <Header>{data.name}</Header>
    </DetailsPage>
  );
}
