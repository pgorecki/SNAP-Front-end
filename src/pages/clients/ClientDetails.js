import React from 'react';
import { Grid, Tab, Button } from 'semantic-ui-react';
import useResource from '../../hooks/useResource';
import useUrlParams from '../../hooks/useUrlParams';
import { formatApiError } from '../../utils/apiUtils';
import { fullName } from '../../utils/modelUtils';
import DetailsPage from '../DetailsPage';
import { ClientField } from './components';
import ClientAvatar from '../../components/ClientAvatar';
import { formatDate } from '../../utils/typeUtils';
import { NavLink } from 'react-router-dom';
import ResponsesTab from './ResponsesTab';

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

  console.log(data);

  const clientFullName = fullName({ firstName, middleName, lastName });

  const tabPanes = [
    {
      menuItem: 'Overview',
      render: () => <Tab.Pane>TODO: Overview</Tab.Pane>,
    },
    {
      menuItem: 'History',
      render: () => <Tab.Pane>TODO: History</Tab.Pane>,
    },
    {
      menuItem: 'ROIs',
      render: () => <Tab.Pane>TODO: ROIs</Tab.Pane>,
    },
    {
      menuItem: 'Referrals',
      render: () => <Tab.Pane>TODO: Referrals</Tab.Pane>,
    },
    {
      menuItem: 'Responses',
      render: () => (
        <Tab.Pane>
          <ResponsesTab client={data} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Case Notes',
      render: () => <Tab.Pane>TODO: CaseNotes</Tab.Pane>,
    },
    {
      menuItem: 'Tags',
      render: () => <Tab.Pane>TODO: Tags</Tab.Pane>,
    },
  ];

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

        <Grid.Column computer={16} mobile={16}>
          <Tab panes={tabPanes} activeIndex={4} renderActiveOnly />
        </Grid.Column>

        <Button as={NavLink} to={`/clients/${data.id}/edit`} primary>
          Edit
        </Button>
      </Grid>
    </DetailsPage>
  );
}
