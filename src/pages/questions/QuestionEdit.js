import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Formik } from 'formik';
import { AppContext } from 'AppStore';
import useResource from 'hooks/useResource';
import useUrlParams from 'hooks/useUrlParams';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import DetailsPage from '../DetailsPage';
import toaster from '../../components/toaster';
import QuestionForm from './QuestionForm';
import { hasPermission } from 'utils/permissions';

export default function QuestionDetails() {
  const [{ user }] = useContext(AppContext);
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
          title={
            hasPermission(user, 'survey.change_question')
              ? `Edit ${form.values.title}`
              : form.values.title
          }
          loading={loading}
          error={formatApiError(error)}
        >
          <Grid>
            <QuestionForm form={form} user={user} />
          </Grid>
        </DetailsPage>
      )}
    </Formik>
  );
}
