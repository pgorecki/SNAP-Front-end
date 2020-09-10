import React, { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import toaster from 'components/toaster';
import SurveyWarnings from 'components/SurveyWarnings';
import useResourceIndex from 'hooks/useResourceIndex';
import useNewResource from 'hooks/useNewResource';
import Survey from 'pages/surveys/Survey';
import { findItem } from 'pages/surveys/computations';
import { formatApiError } from 'utils/apiUtils';

function EnrollmentServiceForm({}) {
  return <p>Form</p>;
}

export default function EnrollmentServiceModal({ service, onResponseSubmit }) {
  const serviceTypeIndex = useResourceIndex('/programs/services/types/');
  // const response = useNewResource('/responses/', {});
  // const [submissionErrors, setSubmissionErrors] = useState([]);

  // if (!client || !surveyId || !survey.data.definition) {
  //   return null;
  // }

  return (
    <Grid>
      <Grid.Column computer={16} mobile={16}>
        <EnrollmentServiceForm />
        <br />
        <pre>{JSON.stringify(serviceTypeIndex, null, 2)}</pre>
      </Grid.Column>
    </Grid>
  );
}
