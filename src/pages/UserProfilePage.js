import React, { useContext } from 'react';
import { Button, Grid, Header, Label } from 'semantic-ui-react';
import ClientAvatar from 'components/ClientAvatar';
import { ClientField } from 'pages/clients/components';
import { AppContext } from 'AppStore';
import { hasPermission } from 'utils/permissions';
import DetailsPage from './DetailsPage';

export default function UserProfilePage() {
  const [{ user }] = useContext(AppContext);
  const { first_name, last_name, username, agency, permissions } = user;
  console.log(user, permissions);
  return (
    <DetailsPage title="Your account">
      <Grid>
        <Grid.Column computer={2} mobile={16}>
          <ClientAvatar client={user} />
        </Grid.Column>
        <Grid.Column computer={7} mobile={16}>
          <ClientField label="First Name">{first_name}</ClientField>
          <ClientField label="Last Name">{last_name}</ClientField>
          <ClientField label="Agency">{agency && agency.name}</ClientField>
          <ClientField label="Email">{username}</ClientField>
        </Grid.Column>
        <Grid.Column computer={7} mobile={16}>
          <ClientField label="Permissions">
            {Array.isArray(permissions) &&
              permissions.map((p) => (
                <Label style={{ marginBottom: 4 }} key={p}>
                  {p}
                </Label>
              ))}
          </ClientField>
        </Grid.Column>
      </Grid>
    </DetailsPage>
  );
}
