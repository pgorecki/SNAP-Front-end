import React from 'react';
import { Grid } from 'semantic-ui-react';
import { ClientField } from 'pages/clients/components';

export default function ProfileTab({ client }) {
  const {
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    address,
  } = client;
  return (
    <Grid>
      <Grid.Column computer={7} mobile={16}>
        <ClientField label="First Name">{firstName}</ClientField>
        <ClientField label="Middle Name">{middleName || '-'}</ClientField>
        <ClientField label="Last Name">{lastName}</ClientField>
      </Grid.Column>
      <Grid.Column computer={7} mobile={16}>
        <ClientField label="Street">
          {(address && address.street) || '-'}
        </ClientField>
        <ClientField label="City">
          {(address && address.city) || '-'}
        </ClientField>
        <ClientField label="State">
          {(address && address.state) || '-'}
        </ClientField>
        <ClientField label="ZIP">{(address && address.zip) || '-'}</ClientField>
        <ClientField label="County of Residence">
          {(address && address.county) || '-'}
        </ClientField>
      </Grid.Column>
    </Grid>
  );
}
