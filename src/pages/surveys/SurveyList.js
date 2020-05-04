import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Icon, Grid, Header, Label } from 'semantic-ui-react';
import useFetchData from '../../hooks/useFetchData';
import ControlledTable from '../../components/ControlledTable';
import { formatDateTime } from '../../utils/dateUtils';
import {
  EditActionLink,
  DeleteActionButton,
  PrimaryActionLink,
} from '../../components/tableComponents';
import { formatOwner } from '../../utils/modelUtils';

// import useUrlParams from '../../hooks/useUrlParams';

export default function SurveyList() {
  const [data, error, loading, fetchData] = useFetchData('/surveys/');
  // const [, queryParams] = useUrlParams();

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
        Cell: ({ row }) => (
          <>
            <EditActionLink to={`/surveys/${row.original.id}/edit`} />
            <PrimaryActionLink
              icon="table"
              label="Builder"
              to={`/surveys/${row.original.id}/builder`}
            />
            <DeleteActionButton onClick={() => alert('Not yet implemented')} />
          </>
        ),
      },
    ],
    []
  );

  function renderLoading() {
    return <p>Loading...</p>;
  }

  function renderError() {
    return <p>Error</p>;
  }

  function renderData() {
    return (
      <ControlledTable
        columns={columns}
        data={data}
        loading={loading}
        fetchData={fetchData}
      />
    );
  }

  return (
    <>
      <Grid
        style={{
          background: '#fff',
          margin: 0,
          paddingTop: 30,
        }}
      >
        <Header>Surveys</Header>
        {loading
          ? renderLoading()
          : error
          ? renderError()
          : data && renderData()}
      </Grid>
    </>
  );
}
