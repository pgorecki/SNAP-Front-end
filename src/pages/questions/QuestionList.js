import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Label } from 'semantic-ui-react';
import { AppContext } from 'AppStore';
import PaginatedDataTable from 'components/PaginatedDataTable';
import { formatDateTime } from 'utils/typeUtils';
import {
  EditActionLink,
  DeleteActionButton,
} from '../../components/tableComponents';
import { formatOwner } from 'utils/modelUtils';
import ListPage from '../ListPage';
import { formatApiError } from 'utils/apiUtils';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import { hasPermission } from 'utils/permissions';

export default function QuestionList() {
  const [{ user }] = useContext(AppContext);
  const table = usePaginatedDataTable({ url: '/questions/' });

  const columns = React.useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
        Cell: ({ value, row }) => (
          <NavLink to={`/questions/${row.original.id}`}>{value}</NavLink>
        ),
      },
      {
        Header: 'Access',
        accessor: 'is_public',
        Cell: ({ value }) => <Label>{value ? 'Public' : 'Private'}</Label>,
      },
      {
        Header: 'Category',
        accessor: 'category',
      },
      {
        Header: 'Usage',
        accessor: 'usage_count',
        disableSortBy: true,
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
            <DeleteActionButton
              onClick={() => alert('Not yet implemented')}
              disabled={!hasPermission(user, 'survey.change_question')}
            />
          </>
        ),
      },
    ],
    []
  );

  return (
    <ListPage
      title="Questions"
      // loading={table.loading}
      // error={formatApiError(table.error)}
    >
      <Button
        primary
        as={NavLink}
        exact
        to={'/questions/new'}
        disabled={!hasPermission(user, 'survey.add_question')}
      >
        New Question
      </Button>
      <PaginatedDataTable columns={columns} table={table} />
    </ListPage>
  );
}
