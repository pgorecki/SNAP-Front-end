import React from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Formik } from 'formik';
import toaster from 'components/toaster';
import useNewResource from 'hooks/useNewResource';
import useUrlParams from 'hooks/useUrlParams';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import DetailsPage from '../DetailsPage';
import QuestionForm from './QuestionForm';

export default function QuestionNew() {
  const history = useHistory();
  const { data, error, save } = useNewResource(`/questions/`);

  return (
    <Formik
      enableReinitialize
      initialValues={data}
      onSubmit={async (values, actions) => {
        try {
          console.log('saving', values);
          await save(values);
          history.push('/questions');
          toaster.success('Question created');
        } catch (err) {
          actions.setErrors(apiErrorToFormError(err));
        }
        actions.setSubmitting(false);
      }}
    >
      {(form) => (
        <DetailsPage title={`New Question`} error={formatApiError(error)}>
          <Grid>
            <QuestionForm form={form} data={data} />
          </Grid>
        </DetailsPage>
      )}
    </Formik>
  );
}
