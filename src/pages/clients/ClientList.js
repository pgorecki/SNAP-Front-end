import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Grid, Header } from 'semantic-ui-react';
import { AppContext } from 'AppStore';
import { formatDateTime } from 'utils/typeUtils';
import { EditActionLink } from 'components/tableComponents';
import PaginatedDataTable from 'components/PaginatedDataTable';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import ListPage from 'pages/ListPage';
import { hasPermission } from 'utils/permissions';
import { formatOwner } from 'utils/modelUtils';
import { ClientSearch } from './components';

export default function ClientList() {
  const table = usePaginatedDataTable({ url: '/clients/' });
  const [{ user }] = useContext(AppContext);

  const columns = React.useMemo(
    () => [
      {
        Header: 'First Name',
        accessor: 'first_name',
        Cell: ({ value, row }) => {
          return <NavLink to={`/clients/${row.original.id}`}>{value}</NavLink>;
        },
      },
      {
        Header: 'Middle Name',
        accessor: 'middle_name',
        Cell: ({ value, row }) => (
          <NavLink to={`/clients/${row.original.id}`}>{value}</NavLink>
        ),
      },
      {
        Header: 'Last Name',
        accessor: 'last_name',
        Cell: ({ value, row }) => (
          <NavLink to={`/clients/${row.original.id}`}>{value}</NavLink>
        ),
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
        Cell: ({ row }) => (
          <>
            <EditActionLink
              to={`/clients/${row.original.id}/edit`}
              exact
              disabled={!hasPermission(user, 'client.change_client')}
            />
          </>
        ),
      },
    ],
    []
  );

  return (
    <ListPage>
      <Header>Participants</Header>
      <Grid>
        <Grid.Column width={6}>
          <ClientSearch />
        </Grid.Column>
      </Grid>

      <br />

      <Button
        primary
        as={NavLink}
        exact
        to={'/clients/new'}
        disabled={!hasPermission(user, 'client.add_client')}
      >
        New Participant
      </Button>
      <PaginatedDataTable columns={columns} table={table} />
    </ListPage>
  );
}
