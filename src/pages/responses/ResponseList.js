import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { AppContext } from 'AppStore';
import { formatDateTime } from 'utils/typeUtils';
import { EditActionLink } from 'components/tableComponents';
import PaginatedDataTable from 'components/PaginatedDataTable';
import { formatOwner } from 'utils/modelUtils';
import { clientFullName } from 'utils/modelUtils';
import ListPage from '../ListPage';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import { hasPermission } from 'utils/permissions';

export default function ResponseList() {
  const [{ user }] = useContext(AppContext);
  const table = usePaginatedDataTable({ url: '/responses/' });
  const columns = React.useMemo(
    () => [
      {
        Header: 'Survey',
        accessor: 'survey',
        Cell: ({ value, row }) => {
          return (
            <NavLink to={`/responses/${row.original.id}/edit`}>
              {value.name}
            </NavLink>
          );
        },
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
              to={`/responses/${row.original.id}/edit`}
              exact
              disabled={!hasPermission(user, 'survey.change_response')}
            />
          </>
        ),
      },
    ],
    []
  );

  return (
    <ListPage>
      <Header>Responses</Header>
      <PaginatedDataTable columns={columns} table={table} />
    </ListPage>
  );
}
