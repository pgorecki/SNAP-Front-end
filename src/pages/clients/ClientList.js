import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Icon, Grid, Header, Label } from 'semantic-ui-react';
import useFetchData from '../../hooks/useFetchData';
import ControlledTable from '../../components/ControlledTable';
import ListPage from '../ListPage';
import { formatDateTime } from '../../utils/typeUtils';
import {
  EditActionLink,
  DeleteActionButton,
  PrimaryActionLink,
} from '../../components/tableComponents';
import { formatApiError } from '../../utils/apiUtils';
import { formatOwner } from '../../utils/modelUtils';

// import useUrlParams from '../../hooks/useUrlParams';

export default function ClientList() {
  const [data, error, loading, fetchData] = useFetchData('/clients/');

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
            <EditActionLink to={`/clients/${row.original.id}/edit`} exact />
          </>
        ),
      },
    ],
    []
  );

  return (
    <ListPage loading={loading} error={formatApiError(error)}>
      <Header>Clients</Header>
      <Button primary as={NavLink} exact to={'/clients/new'}>
        New Client
      </Button>
      <ControlledTable
        columns={columns}
        data={data}
        loading={loading}
        fetchData={fetchData}
      />
    </ListPage>
  );
}
