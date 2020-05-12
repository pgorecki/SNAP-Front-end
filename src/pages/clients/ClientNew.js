import React from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Grid } from 'semantic-ui-react';
import { Formik } from 'formik';
import ClientForm from './ClientForm';
import useNewResource from '../../hooks/useNewResource';
import { formatApiError, apiErrorToFormError } from '../../utils/apiUtils';
import DetailsPage from '../DetailsPage';
import toaster from '../../components/toaster';

export default function ClientNew() {
  const history = useHistory();
  const { data, error, save } = useNewResource('/clients/', {});

  return (
    <Formik
      enableReinitialize
      initialValues={data}
      onSubmit={async (values, actions) => {
        try {
          const result = await save({
            ...values,
            dob: moment(values.dob).format('YYYY-MM-DD'),
          });
          history.push(`/clients/${result.id}`);
          toaster.success('Client created');
        } catch (err) {
          actions.setErrors(apiErrorToFormError(err));
        }
        actions.setSubmitting(false);
      }}
    >
      {(form) => (
        <DetailsPage title="New Client" error={formatApiError(error)}>
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
