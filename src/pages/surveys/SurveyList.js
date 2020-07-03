import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Label, Modal } from 'semantic-ui-react';
import toaster from 'components/toaster';
import {
  EditActionLink,
  DeleteActionButton,
  PrimaryActionLink,
} from 'components/tableComponents';
import useApiClient from 'hooks/useApiClient';
import { formatDateTime } from 'utils/typeUtils';
import { formatOwner } from 'utils/modelUtils';
import { formatApiError } from 'utils/apiUtils';
import ListPage from '../ListPage';
import PaginatedDataTable from 'components/PaginatedDataTable';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';

export default function SurveyList() {
  const table = usePaginatedDataTable({ url: '/surveys/' });
  const apiClient = useApiClient();

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
                      await apiClient.delete(`/surveys/${row.original.id}/`);
                      actions.reload();
                    } catch (err) {
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
    []
  );

  return (
    <ListPage title="Surveys">
      <Button primary as={NavLink} exact to="/surveys/new">
        New Survey
      </Button>
      <PaginatedDataTable columns={columns} table={table} />
    </ListPage>
  );
}
