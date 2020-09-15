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
          switch (row.original.status) {
            case 'in_orientation':
            case 'in_planning':
            case 'in_progress':
              return (
                <Button
                  as={NavLink}
                  to={`/clients/${row.original.client.id}#iep`}
                  color="green"
                >
                  Manage Referral
                </Button>
              );
            case 'not_eligible':
              return (
                <Button
                  as={NavLink}
                  to={`/clients/${row.original.client.id}#iep`}
                  color="red"
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
          switch (status) {
            case 'in_orientation':
            case 'in_planning':
            case 'in_progress':
              return (
                <Button
                  as={NavLink}
                  to={`/clients/${row.original.client.id}#iep`}
                  color="green"
                >
                  Manage Referral
                </Button>
              );
            case 'not_eligible':
              return (
                <Button
                  as={NavLink}
                  to={`/clients/${row.original.client.id}#iep`}
                  color="red"
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
