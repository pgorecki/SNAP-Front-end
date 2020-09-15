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
import IEPTab from './IepTab';
import ResponsesTab from './ResponsesTab';
import EligibilityTab from './EligibilityTab';
import EnrollmentsTab from './EnrollmentsTab';
import ReferralsTab from './ReferralsTab';
import IepSteps from './IepSteps';
import { hasPermission } from 'utils/permissions';

function findTabIndex(tabPanes, tabName) {
  if (!tabName) {
    return 0;
  }
  const index = tabPanes.findIndex((tab) => tab.name === tabName);
  if (index >= 0) {
    return index;
  }
  return tabName;
}

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
    {
      name: 'iep',
      menuItem: 'IEP',
      render: () => (
        <Tab.Pane>
          <IEPTab client={data} />
        </Tab.Pane>
      ),
      permission: 'iep.view_clientiep',
    },
    {
      name: 'responses',
      menuItem: 'Responses',
      render: () => (
        <Tab.Pane>
          <ResponsesTab client={data} />
        </Tab.Pane>
      ),
      permission: 'survey.view_response',
    },
    {
      name: 'eligibility',
      menuItem: 'Eligibility',
      render: () => (
        <Tab.Pane>
          <EligibilityTab client={data} />
        </Tab.Pane>
      ),
      permission: 'eligibility.view_clienteligibility',
    },
    {
      name: 'enrollments',
      menuItem: 'Enrollments',
      render: () => (
        <Tab.Pane>
          <EnrollmentsTab client={data} />
        </Tab.Pane>
      ),
      permission: 'program.view_enrollment',
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

        {hasPermission(user, 'client.change_client') && (
          <Button as={NavLink} to={`/clients/${data.id}/edit`}>
            Edit Participant
          </Button>
        )}

        <Grid.Column computer={16} mobile={16}>
          <Tab
            panes={tabPanes.filter((tab) =>
              hasPermission(user, tab.permission)
            )}
            activeIndex={findTabIndex(tabPanes, fragment)}
            renderActiveOnly
            onTabChange={(event, { activeIndex }) => {
              const fragment = tabPanes[activeIndex].name || activeIndex;
              history.push(`${window.location.pathname}#${fragment}`);
            }}
          />
        </Grid.Column>
      </Grid>
    </DetailsPage>
  );
}
