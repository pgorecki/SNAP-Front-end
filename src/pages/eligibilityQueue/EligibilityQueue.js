import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Tab, Button, Segment } from 'semantic-ui-react';
import { EligibilityStatus } from 'components/common';
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
  const apiClient = useApiClient();
  const table = usePaginatedDataTable({ url: '/eligibility/queue/?type=new' });
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
        Header: 'Requestor',
        accessor: 'requestor.name',
      },
      {
        Header: 'Eligiblity',
        accessor: 'actions',
        Cell: ({ row }) => (
          <>
            <Button
              color="green"
              onClick={async () => {
                const { id } = row.original;
                const fullName = clientFullName(row.original.client);
                try {
                  await apiClient.patch(`/eligibility/queue/${id}/`, {
                    status: 'ELIGIBLE',
                  });
                  toaster.success(`Confirmed eligibilty for ${fullName}`);
                  table.reload();
                } catch (err) {
                  const apiError = formatApiError(err.response);
                  toaster.error(apiError);
                }
              }}
            >
              Eligible
            </Button>
            <Button
              color="red"
              onClick={async () => {
                const { id } = row.original;
                const fullName = clientFullName(row.original.client);
                try {
                  await apiClient.patch(`/eligibility/queue/${id}/`, {
                    status: 'NOT_ELIGIBLE',
                  });
                  toaster.success(`Denied eligibilty for ${fullName}`);
                  table.reload();
                } catch (err) {
                  const apiError = formatApiError(err.response);
                  toaster.error(apiError);
                }
              }}
            >
              Not Eligible
            </Button>
          </>
        ),
      },
    ],
    []
  );
  return <PaginatedDataTable columns={columns} table={table} />;
}

function ExistingClientsTab() {
  const apiClient = useApiClient();
  const table = usePaginatedDataTable({
    url: '/eligibility/queue/?type=existing',
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
        Header: 'Requestor',
        accessor: 'requestor.name',
      },
      {
        Header: 'Eligiblity',
        accessor: 'actions',
        Cell: ({ row }) => (
          <>
            <Button
              color="green"
              onClick={async () => {
                const { id } = row.original;
                const fullName = clientFullName(row.original.client);
                try {
                  await apiClient.patch(`/eligibility/queue/${id}/`, {
                    status: 'ELIGIBLE',
                  });
                  toaster.success(`Confirmed eligibilty for ${fullName}`);
                  table.reload();
                } catch (err) {
                  const apiError = formatApiError(err.response);
                  toaster.error(apiError);
                }
              }}
            >
              Eligible
            </Button>
            <Button
              color="red"
              onClick={async () => {
                const { id } = row.original;
                const fullName = clientFullName(row.original.client);
                try {
                  await apiClient.patch(`/eligibility/queue/${id}/`, {
                    status: 'NOT_ELIGIBLE',
                  });
                  toaster.success(`Denied eligibilty for ${fullName}`);
                  table.reload();
                } catch (err) {
                  const apiError = formatApiError(err.response);
                  toaster.error(apiError);
                }
              }}
            >
              Not Eligible
            </Button>
          </>
        ),
      },
    ],
    []
  );
  return <PaginatedDataTable columns={columns} table={table} />;
}

function HistoricalClientsTab() {
  const table = usePaginatedDataTable({
    url: '/eligibility/queue/?type=historical',
  });
  const columns = React.useMemo(
    () => [
      {
        Header: 'Last Reivew Date',
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
        Header: 'Requestor',
        accessor: 'requestor.name',
      },
      {
        Header: 'Eligiblity',
        accessor: 'status',
        Cell: ({ value }) => <EligibilityStatus value={value} />,
      },
      {
        Header: 'Approved by',
        accessor: 'resolved_by',
        Cell: ({ value }) => formatUser(value),
      },
    ],
    []
  );
  return <PaginatedDataTable columns={columns} table={table} />;
}

export default function EligilibityQueueList() {
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
    <ListPage title="Eligibility">
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
