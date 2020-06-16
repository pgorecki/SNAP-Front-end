import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Icon, Grid, Header, Label } from 'semantic-ui-react';
import useFetchData from '../../hooks/useFetchData';
import ControlledTable from '../../components/ControlledTable';
import { formatDateTime } from '../../utils/typeUtils';
import {
  EditActionLink,
  DeleteActionButton,
  PrimaryActionLink,
} from '../../components/tableComponents';
import { formatOwner } from '../../utils/modelUtils';
import ListPage from '../ListPage';
import { formatApiError } from '../../utils/apiUtils';

// import useUrlParams from '../../hooks/useUrlParams';

export default function QuestionList() {
  const [data, error, loading, fetchData] = useFetchData('/questions/');
  // const [, queryParams] = useUrlParams();
  console.log(data, loading);

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
            <EditActionLink to={`/questions/${row.original.id}/edit`} />
            <DeleteActionButton onClick={() => alert('Not yet implemented')} />
          </>
        ),
      },
    ],
    []
  );

  return (
    <ListPage title="Questions" loading={loading} error={formatApiError(error)}>
      <Button primary as={NavLink} exact to={'/questions/new'}>
        New Question
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
