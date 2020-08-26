import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Grid, Message, Icon } from 'semantic-ui-react';
import { Formik } from 'formik';
import SurveyWarnings from 'components/SurveyWarnings';
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

export default function ResponseDetails() {
  const [urlParams] = useUrlParams();
  const response = useResource(`/responses/${urlParams.id}/`);
  const [submissionErrors, setSubmissionErrors] = useState([]);

  const { error, loading } = response;
  const { client, survey } = response.data;

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
                  ...client,
                  // extra fields for backward compatibility
                  firstName: client.first_name,
                  middleName: client.middle_name,
                  lastName: client.last_name,
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
