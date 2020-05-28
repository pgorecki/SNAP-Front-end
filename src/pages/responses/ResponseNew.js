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
import { findItem } from './../surveys/computations';

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
            onSubmit={async (values, status) => {
              const answers = Object.keys(values)
                .map((id) => {
                  const item = findItem(id, survey.data.definition);
                  return {
                    question: item.questionId,
                    value: values[id],
                  };
                })
                .filter((x) => !!x.question);
              const payload = {
                survey: survey.data.id,
                respondent: {
                  id: client.data.id,
                  type: 'Client',
                },
                answers,
              };
              try {
                await response.save(payload);
                toaster.success('Response created');
              } catch (err) {
                const formError = apiErrorToFormError(err);
                toaster.error(JSON.stringify(formError));
              }
            }}
            debugMode
          />
        </Grid.Column>
      </Grid>
    </DetailsPage>
  );
}
