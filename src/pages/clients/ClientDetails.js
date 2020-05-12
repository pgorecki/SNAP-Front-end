import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import useResource from '../../hooks/useResource';
import useUrlParams from '../../hooks/useUrlParams';
import { formatApiError } from '../../utils/apiUtils';
import { fullName } from '../../utils/modelUtils';
import DetailsPage from '../DetailsPage';
import { ClientAvatar, ClientField } from './components';
import { formatDate } from '../../utils/typeUtils';
import { NavLink } from 'react-router-dom';

export default function ClientDetails() {
  const [urlParams] = useUrlParams();
  const { data, error, loading } = useResource(`/clients/${urlParams.id}/`);

  const {
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    dob,
    ssn,
  } = data;

  const clientFullName = fullName({ firstName, middleName, lastName });

  return (
    <DetailsPage
      title={clientFullName}
      loading={loading}
      error={formatApiError(error)}
    >
      <Grid>
        <Grid.Column computer={2} mobile={16}>
          <ClientAvatar client={data} />
        </Grid.Column>
        <Grid.Column computer={7} mobile={16}>
          <ClientField label="First Name">{firstName}</ClientField>
          <ClientField label="Middle Name">{middleName}</ClientField>
          <ClientField label="Last Name">{lastName}</ClientField>
        </Grid.Column>
        <Grid.Column computer={7} mobile={16}>
          <ClientField label="Date of Birth">{formatDate(dob)}</ClientField>
          <ClientField label="SSN">{ssn || 'n/a'}</ClientField>
        </Grid.Column>

        <Button as={NavLink} to={`/clients/${data.id}/edit`} primary>
          Edit
        </Button>
      </Grid>
    </DetailsPage>
  );
}
