import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Grid } from 'semantic-ui-react';
import { Formik } from 'formik';
import SurveyWarnings from 'components/SurveyWarnings';
import useNewResource from 'hooks/useNewResource';
import useResource from 'hooks/useResource';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import DetailsPage from '../DetailsPage';
import toaster from 'components/toaster';
import useUrlParams from 'hooks/useUrlParams';
import Survey from '../surveys/Survey';
import { findItem } from '../surveys/computations';

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
  const [submissionErrors, setSubmissionErrors] = useState([]);

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
          <SurveyWarnings survey={survey.data} response={response.data} />
          <Survey
            survey={survey.data}
            client={{
              ...client.data,
              // extra fields for backward compatibility
              firstName: client.data.first_name,
              middleName: client.data.middle_name,
              lastName: client.data.last_name,
            }}
            errors={submissionErrors}
            onSubmit={async (values, status) => {
              setSubmissionErrors([]);
              const answers = Object.keys(values)
                .map((id) => {
                  const item = findItem(id, survey.data.definition);
                  return {
                    question: item && item.questionId,
                    value: values[id],
                  };
                })
                .filter((answer) => !!answer.question);
              const data = {
                survey: survey.data.id,
                respondent: {
                  id: client.data.id,
                  type: 'Client',
                },
                answers,
              };
              try {
                await response.save(data);
                toaster.success('Response created');
                history.goBack();
              } catch (err) {
                const apiError = formatApiError(err.response);
                toaster.error(apiError);
              }
            }}
            debugMode
          />
        </Grid.Column>
      </Grid>
    </DetailsPage>
  );
}
