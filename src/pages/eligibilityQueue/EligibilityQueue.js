import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Grid, Tab, Button, Segment } from 'semantic-ui-react';
import { EligibilityLabel, ErrorMessage } from 'components/common';
import toaster from 'components/toaster';
import {
  EditActionLink,
  DeleteActionButton,
  PrimaryActionLink,
} from 'components/tableComponents';
import useApiClient from 'hooks/useApiClient';
import { formatDateTime } from 'utils/typeUtils';
import { formatUser } from 'utils/modelUtils';
import { formatApiError } from 'utils/apiUtils';
import ListPage from '../ListPage';
import PaginatedDataTable from 'components/PaginatedDataTable';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import useUrlParams from 'hooks/useUrlParams';
import { clientFullName } from 'utils/modelUtils';

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
            <Button color="red">Not Eligible</Button>
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
            <Button color="red">Not Eligible</Button>
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
        Cell: ({ value }) => <EligibilityLabel value={value} />,
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

  /*
  const table = usePaginatedDataTable({ url: '/eligibility/queue/' });
  const apiClient = useApiClient();
  const [modalData, setModaData] = useState({});

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value, row }) => (
          <NavLink to={`/surveys/${row.original.id}`}>{value}</NavLink>
        ),
      },
      {
        Header: 'Access',
        accessor: 'is_public',
        Cell: ({ value }) => <Label>{value ? 'Public' : 'Private'}</Label>,
      },
      {
        Header: 'Date Created',
        accessor: 'created_at',
        Cell: ({ value }) => formatDateTime(value, true),
      },
      {
        Header: 'Date Modified',
        accessor: 'modified_at',
        Cell: ({ value }) => formatDateTime(value, true),
      },
      {
        Header: 'Created By',
        accessor: 'created_by',
        Cell: ({ value }) => formatOwner(value),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row, actions }) => (
          <>
            <EditActionLink to={`/surveys/${row.original.id}/edit`} />
            <PrimaryActionLink
              icon="table"
              label="Builder"
              to={`/surveys/${row.original.id}/builder`}
              disabled
            />
            <DeleteActionButton
              onClick={() => setModaData({ ...row.original })}
            />
          </>
        ),
      },
    ],
    []
  );

  return (
    <ListPage title="Surveys">
      <Button primary as={NavLink} exact to="/surveys/new">
        New Survey
      </Button>
      <PaginatedDataTable columns={columns} table={table} />
      <Modal closeIcon open={!!modalData.id} onClose={() => setModaData({})}>
        <Modal.Header>Are you sure?</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>
              Are you sure you want to delete survey{' '}
              <strong>{modalData.name}</strong>?
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={async () => {
              try {
                await apiClient.delete(`/surveys/${modalData.id}/`);
                table.reload();
              } catch (err) {
                const apiError = formatApiError(err.response);
                toaster.error(apiError);
              } finally {
                setModaData({});
              }
            }}
          >
            Delete Survey
          </Button>
        </Modal.Actions>
      </Modal>
    </ListPage>
  );
  */
}
