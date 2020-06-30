import React from 'react';
import { NavLink } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { formatDateTime } from 'utils/typeUtils';
import { EditActionLink } from 'components/tableComponents';
import PaginatedDataTable from 'components/PaginatedDataTable';
import { formatOwner } from 'utils/modelUtils';
import { clientFullName } from 'utils/modelUtils';
import ListPage from '../ListPage';

export default function ResponseList() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Survey',
        accessor: 'survey',
        Cell: ({ value, row }) => {
          return (
            <NavLink to={`/responses/${row.original.id}`}>{value.name}</NavLink>
          );
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
        Header: 'Answers',
        accessor: 'answers',
        Cell: ({ value, row }) => {
          return value.length;
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
    <ListPage>
      <Header>Responses</Header>
      <PaginatedDataTable columns={columns} url="/responses/" />
    </ListPage>
  );
}
