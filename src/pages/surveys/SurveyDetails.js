import React from 'react';
import { Header } from 'semantic-ui-react';
import useFetchData from '../../hooks/useFetchData';
import useUrlParams from '../../hooks/useUrlParams';
import { formatApiError } from '../../utils/apiUtils';
import DetailsPage from '../DetailsPage';
import Survey from './Survey';

export default function SurveyDetails() {
  const [urlParams] = useUrlParams();
  const [data, error, loading] = useFetchData(`/surveys/${urlParams.id}`, {});
  console.log(data);
  return (
    <DetailsPage
      title={`Preview survey ${data.name}`}
      loading={loading}
      error={formatApiError(error)}
    >
      <Survey survey={data} debugMode />
    </DetailsPage>
  );
}
