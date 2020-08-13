import React from 'react';
import { Button, Form, Header, Step } from 'semantic-ui-react';
import { NavLink, useHistory } from 'react-router-dom';
import { ErrorMessage } from 'components/common';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import PaginatedDataTable from 'components/PaginatedDataTable';
import { EditActionLink } from 'components/tableComponents';
import { formatDateTime } from 'utils/typeUtils';
import { formatOwner } from 'utils/modelUtils';

export default function TestTab({ client }) {
  const table = usePaginatedDataTable({
    url: '/responses/',
  });

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
        sortType: 'basic',
        Cell: ({ value }) => formatDateTime(value, true),
      },
      {
        Header: 'Created By',
        accessor: 'created_by',
        Cell: ({ value }) => formatOwner(value),
      },
      {
        Header: 'Actions',
        disableSortBy: true,
        accessor: 'actions',
        Cell: ({ row, actions }) => (
          <>
            <Button
              onClick={(...args) => {
                table.updateRow(row, {
                  answers: [...row.original.answers, {}],
                  modified_at: new Date(),
                });
              }}
            >
              Update row
            </Button>
            <Button
              onClick={(...args) => {
                table.reload();
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
      <Step.Group ordered fluid>
        <Step completed active disabled={0}>
          <Step.Content>
            <Step.Title as={'a'}>Eligibility</Step.Title>
            <Step.Description>eligible</Step.Description>
          </Step.Content>
        </Step>
        <Step completed active disabled={0}>
          <Step.Content>
            <Step.Title as={'a'}>Orientation</Step.Title>
            <Step.Description>completed</Step.Description>
          </Step.Content>
        </Step>
        <Step completed active disabled={0}>
          <Step.Content>
            <Step.Title as={'a'}>IEP Planning</Step.Title>
            <Step.Description>completed</Step.Description>
          </Step.Content>
        </Step>
        <Step active>
          <Step.Content>
            <Step.Title as={'a'}>Enrolled</Step.Title>
            <Step.Description>Taking Customer service program</Step.Description>
          </Step.Content>
        </Step>
        <Step disabled>
          <Step.Content>
            <Step.Title as={'a'}>Done</Step.Title>
            <Step.Description></Step.Description>
          </Step.Content>
        </Step>
      </Step.Group>
    </>
  );
}
