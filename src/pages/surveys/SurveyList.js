import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Label, Modal } from 'semantic-ui-react';
import useFetchData from '../../hooks/useFetchData';
import useApiClient from '../../hooks/useApiClient';
import ControlledTable from '../../components/ControlledTable';
import { formatDateTime } from '../../utils/typeUtils';
import toaster from '../../components/toaster';
import {
  EditActionLink,
  DeleteActionButton,
  PrimaryActionLink,
} from '../../components/tableComponents';
import { formatOwner } from '../../utils/modelUtils';
import ListPage from '../ListPage';
import { formatApiError } from '../../utils/apiUtils';

export default function SurveyList() {
  const [data, error, loading, fetchData] = useFetchData('/surveys/');
  const [apiClient] = useApiClient();
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
            <Modal trigger={<DeleteActionButton />} closeIcon>
              <Modal.Header>Are you sure?</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <p>
                    Are you sure you want to delete survey{' '}
                    <strong>{row.original.name}</strong>?
                  </p>
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button
                  negative
                  onClick={async () => {
                    try {
                      console.log('a');
                      await apiClient.delete(`/surveys/${row.original.id}/`);
                      console.log('b');
                      await fetchData();
                      console.log('c');
                    } catch (err) {
                      console.log('d');
                      const apiError = formatApiError(err.response);
                      toaster.error(apiError);
                    }
                  }}
                >
                  Delete Survey
                </Button>
              </Modal.Actions>
            </Modal>
          </>
        ),
      },
    ],
    [apiClient, fetchData]
  );

  return (
    <ListPage title="Surveys" loading={loading} error={formatApiError(error)}>
      <Button primary as={NavLink} exact to="/surveys/new">
        New Survey
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
