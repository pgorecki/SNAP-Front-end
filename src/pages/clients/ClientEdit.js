import React from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Formik } from 'formik';
import ClientForm from './ClientForm';
import DetailsPage from '../DetailsPage';
import { formatApiError, apiErrorToFormError } from '../../utils/apiUtils';
import useUrlParams from '../../hooks/useUrlParams';
import useResource from '../../hooks/useResource';
import toaster from '../../components/toaster';

export default function ClientEdit() {
  const history = useHistory();
  const [urlParams] = useUrlParams();
  const { data, error, save } = useResource(`/clients/${urlParams.id}/`);

  return (
    <Formik
      enableReinitialize
      initialValues={data}
      onSubmit={async (values, actions) => {
        try {
          const result = await save(values);
          history.push(`/clients/${result.id}`);
          toaster.success('Client updated');
        } catch (err) {
          actions.setErrors(apiErrorToFormError(err));
        }
        actions.setSubmitting(false);
      }}
    >
      {(form) => (
        <DetailsPage title="Edit Client" error={formatApiError(error)}>
          <Grid>
            <Grid.Column computer={8} mobile={16}>
              <ClientForm form={form} />
            </Grid.Column>
          </Grid>
        </DetailsPage>
      )}
    </Formik>
  );
}
