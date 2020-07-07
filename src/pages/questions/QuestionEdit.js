import React from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Formik } from 'formik';
import useResource from 'hooks/useResource';
import useUrlParams from 'hooks/useUrlParams';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import DetailsPage from '../DetailsPage';
import toaster from '../../components/toaster';
import QuestionForm from './QuestionForm';

export default function QuestionDetails() {
  const history = useHistory();
  const [urlParams] = useUrlParams();
  const { data, error, loading, save } = useResource(
    `/questions/${urlParams.id}/`
  );

  return (
    <Formik
      enableReinitialize
      initialValues={data}
      onSubmit={async (values, actions) => {
        try {
          console.log('saving', values);
          await save(values);
          history.push('/questions');
          toaster.success('Question updated');
        } catch (err) {
          actions.setErrors(apiErrorToFormError(err));
        }
        actions.setSubmitting(false);
      }}
    >
      {(form) => (
        <DetailsPage
          title={`Edit ${form.values.title}`}
          loading={loading}
          error={formatApiError(error)}
        >
          <Grid>
            <QuestionForm form={form} />
          </Grid>
        </DetailsPage>
      )}
    </Formik>
  );
}
