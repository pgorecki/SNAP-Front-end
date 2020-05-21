import React from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Grid } from 'semantic-ui-react';
import { Formik } from 'formik';
import useNewResource from '../../hooks/useNewResource';
import useResource from '../../hooks/useResource';
import { formatApiError, apiErrorToFormError } from '../../utils/apiUtils';
import DetailsPage from '../DetailsPage';
import toaster from '../../components/toaster';
import useUrlParams from '../../hooks/useUrlParams';
import Survey from '../surveys/Survey';

export default function ResponseNew() {
  const history = useHistory();
  const [urlParams, queryParams, hash] = useUrlParams();

  const client = useResource(
    queryParams.clientId && `/clients/${queryParams.clientId}/`,
    {}
  );
  const survey = useResource(
    queryParams.clientId && `/surveys/${queryParams.surveyId}/`,
    {}
  );

  const response = useNewResource('/responses/', {});

  const error = client.error || survey.error;
  const loading = client.loading || survey.loading;

  return (
    <DetailsPage
      title="Survey Client"
      loading={loading}
      error={formatApiError(error)}
    >
      <Grid>
        <Grid.Column computer={8} mobile={16}>
          <Survey
            survey={survey.data}
            client={{
              ...client.data,
              // extra fields for backward compatibility
              firstName: client.data.first_name,
              middleName: client.data.middle_name,
              lastName: client.data.last_name,
            }}
            onSubmit={(values, status) => {
              console.log(values, status);
            }}
            debugMode
          />
        </Grid.Column>
      </Grid>
    </DetailsPage>
  );
}
