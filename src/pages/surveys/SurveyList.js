import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Label, Modal } from 'semantic-ui-react';
import { AppContext } from 'AppStore';
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
import { hasPermission } from 'utils/permissions';

export default function SurveyList() {
  const [{ user }] = useContext(AppContext);
  const table = usePaginatedDataTable({ url: '/surveys/' });
  const apiClient = useApiClient();
  const [modalData, setModaData] = useState({});

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
            <EditActionLink
              to={`/surveys/${row.original.id}/edit`}
              disabled={!hasPermission(user, 'survey.change_survey')}
            />
            <DeleteActionButton
              onClick={() => setModaData({ ...row.original })}
              disabled={!hasPermission(user, 'survey.delete_survey')}
            />
          </>
        ),
      },
    ],
    []
  );

  return (
    <ListPage title="Surveys">
      <Button
        primary
        as={NavLink}
        exact
        to="/surveys/new"
        disabled={!hasPermission(user, 'survey.add_survey')}
      >
        New Survey
      </Button>
      <PaginatedDataTable columns={columns} table={table} />
      <Modal closeIcon open={!!modalData.id} onClose={() => setModaData({})}>
        <Modal.Header>Are you sure?</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>
              Are you sure you want to delete survey{' '}
              <strong>{modalData.name}</strong>?
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={async () => {
              try {
                await apiClient.delete(`/surveys/${modalData.id}/`);
                table.reload();
              } catch (err) {
                const apiError = formatApiError(err.response);
                toaster.error(apiError);
              } finally {
                setModaData({});
              }
            }}
          >
            Delete Survey
          </Button>
        </Modal.Actions>
      </Modal>
    </ListPage>
  );
}
