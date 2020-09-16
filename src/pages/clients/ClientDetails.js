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
import ProfileTab from './ProfileTab';
import ReferralsTab from './ReferralsTab';
import IepSteps from './IepSteps';
import { hasPermission } from 'utils/permissions';
import { EligibilityStatus } from 'components/common';

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
  const eligibilityResurce = useResource(
    `/eligibility/clients/?client=${urlParams.id}`
  );

  const latestEligiblity = (eligibilityResurce.data &&
    eligibilityResurce.data.results &&
    eligibilityResurce.data.results[0]) || {
    status: eligibilityResurce.loading ? null : 'unknown',
  };

  const {
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    dob,
    ssn,
    snap_id,
  } = data;

  const clientFullName = fullName({ firstName, middleName, lastName });

  const tabPanes = [
    {
      name: 'profile',
      menuItem: 'Profile',
      render: () => (
        <Tab.Pane>
          <ProfileTab client={data} />
        </Tab.Pane>
      ),
      permission: 'client.view_client',
    },
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
          <ClientField
            label={
              latestEligiblity.modified_at
                ? `Status (updated: ${formatDate(
                    latestEligiblity.modified_at
                  )})`
                : 'Status'
            }
          >
            {latestEligiblity.status && (
              <>
                <EligibilityStatus value={latestEligiblity.status} />
              </>
            )}
          </ClientField>
          <ClientField label="Date of Birth">{formatDate(dob)}</ClientField>
        </Grid.Column>
        <Grid.Column computer={7} mobile={16}>
          <ClientField label="Snap ID">{snap_id || '-'}</ClientField>
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
