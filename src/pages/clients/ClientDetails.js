import React, { useContext } from 'react';
import { Grid, Tab, Button } from 'semantic-ui-react';
import { NavLink, useHistory } from 'react-router-dom';
import ClientAvatar from 'components/ClientAvatar';
import useResource from 'hooks/useResource';
import useUrlParams from 'hooks/useUrlParams';
import DetailsPage from 'pages/DetailsPage';
import { ClientField } from 'pages/clients/components';
import { formatApiError } from 'utils/apiUtils';
import { fullName } from 'utils/modelUtils';
import { formatDate } from 'utils/typeUtils';
import { AppContext } from 'AppStore';
import ResponsesTab from './ResponsesTab';
import EligibilityTab from './EligibilityTab';
import EnrollmentsTab from './EnrollmentsTab';
import ReferralsTab from './ReferralsTab';
import TestTab from './TestTab';

export default function ClientDetails() {
  const history = useHistory();
  const [{ user }] = useContext(AppContext);
  const [urlParams, queryParams, fragment] = useUrlParams();
  const { data, error, loading } = useResource(`/clients/${urlParams.id}/`);

  const {
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    dob,
    ssn,
  } = data;

  const clientFullName = fullName({ firstName, middleName, lastName });

  const tabPanes = [
    // {
    //   menuItem: 'Overview',
    //   render: () => <Tab.Pane>TODO: Overview</Tab.Pane>,
    // },
    // {
    //   menuItem: 'History',
    //   render: () => <Tab.Pane>TODO: History</Tab.Pane>,
    // },
    // {
    //   menuItem: 'ROIs',
    //   render: () => <Tab.Pane>TODO: ROIs</Tab.Pane>,
    // },
    // {
    //   menuItem: 'Referrals',
    //   render: () => <Tab.Pane>TODO: Referrals</Tab.Pane>,
    // },
    {
      menuItem: 'Responses',
      render: () => (
        <Tab.Pane>
          <ResponsesTab client={data} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Eligibility',
      render: () => (
        <Tab.Pane>
          <EligibilityTab client={data} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Enrollments',
      render: () => (
        <Tab.Pane>
          <EnrollmentsTab client={data} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Referrals',
      render: () => (
        <Tab.Pane>
          <ReferralsTab client={data} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Test',
      render: () => (
        <Tab.Pane>
          <TestTab client={data} />
        </Tab.Pane>
      ),
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
          <ClientField label="Middle Name">{middleName || '-'}</ClientField>
          <ClientField label="Last Name">{lastName}</ClientField>
        </Grid.Column>
        <Grid.Column computer={7} mobile={16}>
          <ClientField label="Date of Birth">{formatDate(dob)}</ClientField>
          <ClientField label="SSN">{ssn || '-'}</ClientField>
        </Grid.Column>

        <Grid.Column computer={16} mobile={16}>
          <Tab
            panes={tabPanes}
            activeIndex={fragment || 0}
            renderActiveOnly
            onTabChange={(event, { activeIndex }) => {
              history.push(`${window.location.pathname}#${activeIndex}`);
            }}
          />
        </Grid.Column>

        <Button as={NavLink} to={`/clients/${data.id}/edit`} primary>
          Edit
        </Button>
      </Grid>
    </DetailsPage>
  );
}
