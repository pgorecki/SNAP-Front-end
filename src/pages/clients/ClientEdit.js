import React from 'react';
import moment from 'moment';
import { Grid } from 'semantic-ui-react';
import { Formik } from 'formik';
import ClientForm from './ClientForm';
import DetailsPage from '../DetailsPage';
import { formatApiError, apiErrorToFormError } from '../../utils/apiUtils';
import useUrlParams from '../../hooks/useUrlParams';
import useResource from '../../hooks/useResource';

export default function ClientEdit() {
  const [urlParams] = useUrlParams();
  const { data, error, loading, save } = useResource(
    `/clients/${urlParams.id}/`,
    {}
  );

  return (
    <Formik
      enableReinitialize
      initialValues={data}
      onSubmit={async (values, actions) => {
        try {
          await save(values);
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
