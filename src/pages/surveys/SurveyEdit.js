import React from 'react';
import yaml from 'js-yaml';
import { useHistory } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Formik } from 'formik';
import SurveyForm from './SurveyForm';
import DetailsPage from '../DetailsPage';
import { formatApiError, apiErrorToFormError } from '../../utils/apiUtils';
import useUrlParams from '../../hooks/useUrlParams';
import useResource from '../../hooks/useResource';
import toaster from '../../components/toaster';

export default function SurveyEdit() {
  const history = useHistory();
  const [urlParams] = useUrlParams();
  const { data, error, save } = useResource(`/surveys/${urlParams.id}/`);

  console.log(data);
  //  form.setFieldValue('definition', )

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...data,
        definition: data.definition ? yaml.safeDump(data.definition) : '',
      }}
      onSubmit={async (values, actions) => {
        try {
          await save({
            ...values,
            definition: yaml.safeLoad(values.definition),
          });
          toaster.success('Survey updated');
        } catch (err) {
          console.log(err);
          actions.setErrors(apiErrorToFormError(err));
        }
        actions.setSubmitting(false);
      }}
    >
      {(form) => (
        <DetailsPage title="Edit Survey" error={formatApiError(error)}>
          <Grid>
            <Grid.Column computer={16} mobile={16}>
              <SurveyForm form={form} />
            </Grid.Column>
          </Grid>
        </DetailsPage>
      )}
    </Formik>
  );
}
