import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Tab, Button, Segment } from 'semantic-ui-react';
import { EligibilityStatus, IEPStatus } from 'components/common';
import toaster from 'components/toaster';
import PaginatedDataTable from 'components/PaginatedDataTable';
import useApiClient from 'hooks/useApiClient';
import useUrlParams from 'hooks/useUrlParams';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import { formatDateTime } from 'utils/typeUtils';
import { formatApiError } from 'utils/apiUtils';
import { clientFullName, formatUser } from 'utils/modelUtils';
import ListPage from '../ListPage';

function NewClientsTab() {
  const history = useHistory();
  const apiClient = useApiClient();
  const table = usePaginatedDataTable({ url: '/iep/?type=new' });
  const columns = React.useMemo(
    () => [
      {
        Header: 'Request Date',
        accessor: 'created_at',
        Cell: ({ value }) => formatDateTime(value, true),
      },
      {
        Header: 'Client',
        accessor: 'client',
        Cell: ({ value, row }) => {
          return (
            <NavLink to={`/clients/${value.id}`}>
              {clientFullName(value)}
            </NavLink>
          );
        },
      },
      {
        Header: 'SSN',
        accessor: 'client.ssn',
      },
      {
        Header: 'Client County',
        accessor: 'client.address.county',
      },
      {
        Header: 'Reviewer',
        accessor: 'resolved_by',
        Cell: ({ value, row }) => {
          return row.original.resolved_by
            ? formatUser(row.original.resolved_by)
            : '';
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => <IEPStatus value={value} />,
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ value, row }) => {
          const clientId = row.original.client.id;
          switch (row.original.status) {
            case 'in_orientation':
            case 'in_planning':
            case 'in_progress':
              return (
                <Button
                  color="green"
                  onClick={() => history.push(`clients/${clientId}#iep`)}
                >
                  Manage Referral
                </Button>
              );
            case 'not_eligible':
              return (
                <Button
                  color="red"
                  onClick={() => history.push(`clients/${clientId}#iep`)}
                >
                  End Referral
                </Button>
              );
            default:
              return value;
          }
        },
      },
    ],
    []
  );
  return <PaginatedDataTable columns={columns} table={table} />;
}

function ExistingClientsTab() {
  const history = useHistory();
  const apiClient = useApiClient();
  const table = usePaginatedDataTable({
    url: '/iep/?type=existing',
  });
  const columns = React.useMemo(
    () => [
      {
        Header: 'Request Date',
        accessor: 'created_at',
        Cell: ({ value }) => formatDateTime(value, true),
      },
      {
        Header: 'Client',
        accessor: 'client',
        Cell: ({ value, row }) => {
          return (
            <NavLink to={`/clients/${value.id}`}>
              {clientFullName(value)}
            </NavLink>
          );
        },
      },
      {
        Header: 'SSN',
        accessor: 'client.ssn',
      },
      {
        Header: 'Client County',
        accessor: 'client.address.county',
      },
      {
        Header: 'Reviewer',
        accessor: 'resolved_by',
        Cell: ({ value, row }) => {
          return row.original.resolved_by
            ? formatUser(row.original.resolved_by)
            : '';
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => <IEPStatus value={value} />,
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ value, row }) => {
          const status = row.original.status;
          const clientId = row.original.client.id;
          switch (status) {
            case 'in_orientation':
            case 'in_planning':
            case 'in_progress':
              return (
                <Button
                  color="green"
                  onClick={() => history.push(`clients/${clientId}#iep`)}
                >
                  Manage Referral
                </Button>
              );
            case 'not_eligible':
              return (
                <Button
                  color="red"
                  onClick={() => history.push(`clients/${clientId}#iep`)}
                >
                  End Referral
                </Button>
              );
            default:
              return value;
          }
        },
      },
    ],
    []
  );
  return <PaginatedDataTable columns={columns} table={table} />;
}

function HistoricalClientsTab() {
  const table = usePaginatedDataTable({
    url: '/iep/?type=historical',
  });
  const columns = React.useMemo(
    () => [
      {
        Header: 'Last Review Date',
        accessor: 'modified_at',
        Cell: ({ value }) => formatDateTime(value, true),
      },
      {
        Header: 'Request Date',
        accessor: 'created_at',
        Cell: ({ value }) => formatDateTime(value, true),
      },
      {
        Header: 'Client',
        accessor: 'client',
        Cell: ({ value, row }) => {
          return (
            <NavLink to={`/clients/${value.id}`}>
              {clientFullName(value)}
            </NavLink>
          );
        },
      },
      {
        Header: 'Reviewer',
        accessor: 'resolved_by',
        Cell: ({ value, row }) => {
          return row.original.resolved_by
            ? formatUser(row.original.resolved_by)
            : '';
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => <IEPStatus value={value} />,
      },
    ],
    []
  );
  return <PaginatedDataTable columns={columns} table={table} />;
}

export default function EnrollmentQueueList() {
  const history = useHistory();
  const [urlParams, queryParams, fragment] = useUrlParams();

  const tabPanes = [
    {
      menuItem: 'New Clients',
      render: () => (
        <Segment basic={true}>
          <NewClientsTab />
        </Segment>
      ),
    },
    {
      menuItem: 'Existing Clients',
      render: () => (
        <Segment basic={true}>
          <ExistingClientsTab />
        </Segment>
      ),
    },
    {
      menuItem: 'History',
      render: () => (
        <Tab.Pane>
          <HistoricalClientsTab />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <ListPage title="Enrollments Queue - Outcomes">
      <Tab
        panes={tabPanes}
        activeIndex={fragment || 0}
        menu={{ secondary: true, pointing: true }}
        renderActiveOnly
        onTabChange={(event, { activeIndex }) => {
          history.push(`${window.location.pathname}#${activeIndex}`);
        }}
      />
    </ListPage>
  );
}
