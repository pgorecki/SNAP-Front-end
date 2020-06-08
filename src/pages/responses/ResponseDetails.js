import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Grid, Message, Icon } from 'semantic-ui-react';
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
import { findItem, itemsToArray } from '../surveys/computations';

function SurveyWarnings({ survey, response }) {
  const warnings = [];
  if (survey.modified_at > response.modified_at) {
    warnings.push('Survey was modified after response was submitted');
  }

  // TODO: there is answer to a question which is not in the survey
  // TODO: invalid questionId (i.e. someone revoked public access to a question used in the survey)

  return warnings.length ? (
    <Message
      warning
      icon="bell"
      header="There are some problems"
      content={
        <Message.List>
          {warnings.map((w) => (
            <Message.Item>{w}</Message.Item>
          ))}
        </Message.List>
      }
    ></Message>
  ) : null;
}

export default function ResponseDetails() {
  const [urlParams] = useUrlParams();
  const response = useResource(`/responses/${urlParams.id}/`);
  const [submissionErrors, setSubmissionErrors] = useState([]);

  const { error, loading } = response;
  const { respondent, survey } = response.data;

  console.log(response.data, loading, error);

  const ready = !loading && !error;

  const initialValues = ready
    ? getSurveyValuesFromResponse(response.data, survey)
    : {};

  return (
    <DetailsPage
      title="Response"
      loading={loading}
      error={formatApiError(error)}
    >
      <Grid>
        <Grid.Column computer={8} mobile={16}>
          {!loading && !error && (
            <>
              <SurveyWarnings survey={survey} response={response.data} />
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
                onSubmit={async (values, status) => {}}
                mode="preview"
                initialValues={initialValues}
                debugMode
              />
            </>
          )}
        </Grid.Column>
      </Grid>
    </DetailsPage>
  );
}
