import React from 'react';
import yaml from 'js-yaml';
import { useHistory } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Formik, Field } from 'formik';
import SurveyForm from './SurveyForm';
import useNewResource from '../../hooks/useNewResource';
import { formatApiError, apiErrorToFormError } from '../../utils/apiUtils';
import DetailsPage from '../DetailsPage';
import toaster from '../../components/toaster';

export default function ClientNew() {
  const history = useHistory();
  const { data, error, save } = useNewResource('/surveys/', {});

  return (
    <Formik
      enableReinitialize
      initialValues={data}
      onSubmit={async (values, actions) => {
        try {
          const result = await save({
            ...values,
            definition: yaml.safeLoad(values.definition),
          });
          history.push(`/surveys/${result.id}`);
          toaster.success('Survey created');
        } catch (err) {
          actions.setErrors(apiErrorToFormError(err));
        }
        actions.setSubmitting(false);
      }}
    >
      {(form) => (
        <DetailsPage title="New Survey" error={formatApiError(error)}>
          <Grid>
            <Grid.Column computer={8} mobile={16}>
              <SurveyForm form={form} />
            </Grid.Column>
          </Grid>
        </DetailsPage>
      )}
    </Formik>
  );
}
