import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Grid } from 'semantic-ui-react';
import { Formik } from 'formik';
import useNewResource from '../../hooks/useNewResource';
import useResource from '../../hooks/useResource';
import {
  formatApiError,
  getSurveyValuesFromResponse,
} from '../../utils/apiUtils';
import DetailsPage from '../DetailsPage';
import toaster from '../../components/toaster';
import useUrlParams from '../../hooks/useUrlParams';
import Survey from '../surveys/Survey';
import { findItem } from '../surveys/computations';

export default function ResponseEdit() {
  const [urlParams] = useUrlParams();
  const response = useResource(`/responses/${urlParams.id}/`);
  const [submissionErrors, setSubmissionErrors] = useState([]);

  const { error, loading } = response;

  const { respondent, survey } = response.data;

  const ready = !loading && !error;

  const initialValues = ready
    ? getSurveyValuesFromResponse(response.data, survey)
    : {};

  console.log(ready, response);
  return (
    <DetailsPage
      title="Response"
      loading={loading}
      error={formatApiError(error)}
    >
      <Grid>
        <Grid.Column computer={8} mobile={16}>
          {ready && (
            <Survey
              survey={survey}
              client={{
                ...respondent,
                // extra fields for backward compatibility
                firstName: respondent.first_name,
                middleName: respondent.middle_name,
                lastName: respondent.last_name,
              }}
              response={response.data}
              errors={submissionErrors}
              initialValues={initialValues}
              onSubmit={async (values, status) => {
                setSubmissionErrors([]);
                const answers = Object.keys(values).map((id) => {
                  const item = findItem(id, survey.definition);
                  return {
                    question: item && item.questionId,
                    value: values[id],
                  };
                });
                const data = {
                  survey: survey.id,
                  respondent: {
                    id: respondent.id,
                    type: 'Client',
                  },
                  answers,
                };
                try {
                  await response.save(data);
                  toaster.success('Response updated');
                } catch (err) {
                  const apiError = formatApiError(err.response);
                  toaster.error(apiError);
                }
              }}
              debugMode
            />
          )}
        </Grid.Column>
      </Grid>
    </DetailsPage>
  );
}
