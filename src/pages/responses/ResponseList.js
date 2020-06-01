import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Icon, Grid, Search, Header, Label } from 'semantic-ui-react';
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
import { ClientSearch } from '../clients/components';
import { clientFullName } from '../../utils/modelUtils';

// import useUrlParams from '../../hooks/useUrlParams';

export default function ResponseList() {
  const [data, error, loading, fetchData] = useFetchData('/responses/');

  const columns = React.useMemo(
    () => [
      {
        Header: 'Survey',
        accessor: 'survey',
        Cell: ({ value, row }) => {
          return <NavLink to={`/responses/${value.id}`}>{value.name}</NavLink>;
        },
      },
      {
        Header: 'Client',
        accessor: 'respondent',
        Cell: ({ value, row }) => {
          return (
            <NavLink to={`/clients/${value.id}`}>
              {clientFullName(value)}
            </NavLink>
          );
        },
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
      <Header>Responses</Header>
      <Grid>
        <Grid.Column width={6}>
          <ClientSearch />
        </Grid.Column>
      </Grid>

      {/* <Button primary as={NavLink} exact to={'/responses/new'}>
        New Response
      </Button> */}
      <ControlledTable
        columns={columns}
        data={data}
        loading={loading}
        fetchData={fetchData}
      />
    </ListPage>
  );
}
