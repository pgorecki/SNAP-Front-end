import React, { useState } from 'react';
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
import { findItem } from '../surveys/computations';

export default function ResponseDetails() {
  const [urlParams] = useUrlParams();
  const response = useResource(`/responses/${urlParams.id}/`);
  const [submissionErrors, setSubmissionErrors] = useState([]);

  const { error, loading } = response;

  const { respondent, survey } = response.data;

  console.log(response.data, loading, error);

  return (
    <DetailsPage
      title="Response"
      loading={loading}
      error={formatApiError(error)}
    >
      <Grid>
        <Grid.Column computer={8} mobile={16}>
          {!loading && (
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
              debugMode
            />
          )}
        </Grid.Column>
      </Grid>
    </DetailsPage>
  );
}
