import React, { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import toaster from 'components/toaster';
import SurveyWarnings from 'components/SurveyWarnings';
import useResource from 'hooks/useResource';
import useNewResource from 'hooks/useNewResource';
import Survey from 'pages/surveys/Survey';
import { findItem } from 'pages/surveys/computations';
import { formatApiError } from 'utils/apiUtils';

export default function EnrollmentSurveyModal({
  client,
  surveyId,
  programId,
  onResponseSubmit,
}) {
  const survey = useResource(surveyId && `/surveys/${surveyId}/`);
  const response = useNewResource('/responses/', {});
  const [submissionErrors, setSubmissionErrors] = useState([]);

  if (!client || !surveyId || !survey.data.definition) {
    return null;
  }

  return (
    <Grid>
      <Grid.Column computer={16} mobile={16}>
        <SurveyWarnings survey={survey.data} response={response.data} />
        <Survey
          survey={survey.data}
          client={{
            ...client,
            // extra fields for backward compatibility
            firstName: client.first_name,
            middleName: client.middle_name,
            lastName: client.last_name,
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
              client: client.id,
              response_context: {
                id: programId,
                type: 'Program',
              },
              answers,
            };
            onResponseSubmit(data);
          }}
          debugMode
        />
      </Grid.Column>
    </Grid>
  );
}
