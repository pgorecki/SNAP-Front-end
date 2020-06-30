import React from 'react';
import { Button, Form, Header } from 'semantic-ui-react';
import { NavLink, useHistory } from 'react-router-dom';
import { ErrorMessage } from 'components/common';
import PaginatedDataTable from 'components/PaginatedDataTable';
import { EditActionLink } from 'components/tableComponents';
import { formatDateTime } from 'utils/typeUtils';
import { formatOwner } from 'utils/modelUtils';

export default function TestTab({ client }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Survey',
        accessor: 'id',
        Cell: ({ value, row }) => {
          return (
            <NavLink to={`/responses/${value}`}>
              {row.original.survey.name}
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
        Cell: ({ row, actions }) => (
          <>
            <Button
              onClick={(...args) => {
                actions.updateRow(row, {
                  answers: [...row.original.answers, {}],
                  modified_at: new Date(),
                });
              }}
            >
              Update row
            </Button>
            <Button
              onClick={(...args) => {
                actions.reload();
              }}
            >
              Reload
            </Button>
          </>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Header as="h4">Client Responses</Header>
      <PaginatedDataTable
        columns={columns}
        url={`/responses/?client=${client.id}`}
      />
    </>
  );
}
