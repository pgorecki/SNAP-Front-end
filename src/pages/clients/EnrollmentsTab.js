import React, { useState } from 'react';
import { Button, Form, Header } from 'semantic-ui-react';
import { NavLink, useHistory } from 'react-router-dom';
import ControlledTable from 'components/ControlledTable';
import { ErrorMessage } from 'components/common';
import { EditActionLink } from 'components/tableComponents';

import { formatDateTime } from 'utils/typeUtils';
import { formatOwner } from 'utils/modelUtils';

import useResourceIndex from 'hooks/useResourceIndex';
import usePaginatedResourceIndex from 'hooks/usePaginatedResourceIndex';

export default function EnrollmentsTab({ client, currentUser }) {
  console.log(client);
  const programsIndex = usePaginatedResourceIndex(`/programs/agency_configs/`);

  const enrollmentsIndex = useResourceIndex(
    `/programs/enrollments/?client=${client.id}`
  );

  const loading = programsIndex.loading || enrollmentsIndex.loading;
  const error = programsIndex.error || enrollmentsIndex.error;
  const ready = !loading && !error;

  const handleSetEnrollmentStatus = (status) => {
    alert('not yet implemented');
  };

  const tableData = ready
    ? programsIndex.data.results.map((pac) => {
        const enrollment = enrollmentsIndex.data.find(
          (e) => e.program.id === pac.program.id
        );
        return {
          pac,
          enrollment,
        };
      })
    : [];

  const columns = React.useMemo(
    () => [
      {
        Header: 'Program',
        accessor: 'pac.program.name',
      },
      {
        Header: 'Status',
        accessor: 'enrollment.status',
        Cell: ({ value }) => value || 'n/a',
      },
      {
        Header: 'Date Modified',
        accessor: 'enrollment.modified_at',
        Cell: ({ value }) => (value ? formatDateTime(value, true) : ''),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ value, row }) => {
          const { enrollment } = row.original;
          const {
            enrollment_entry_survey: entrySurvey,
            enrollment_update_survey: updateSurvey,
            enrollment_exit_survey: exitSurvey,
          } = row.original.pac;

          console.log(entrySurvey, updateSurvey, exitSurvey);

          const entryButton = entrySurvey ? (
            <Button color="green">Entry survey</Button>
          ) : (
            <Button
              color="green"
              onClick={() => handleSetEnrollmentStatus('ENROLLED')}
            >
              Enter
            </Button>
          );
          const updateButton = updateSurvey ? (
            <Button color="green">Update survey</Button>
          ) : null;
          const exitButton = exitSurvey ? (
            <Button color="yellow">Exit survey</Button>
          ) : (
            <Button
              color="yellow"
              onClick={() => handleSetEnrollmentStatus('EXITED')}
            >
              Exit
            </Button>
          );

          if (!enrollment) {
            return entryButton;
          }
          switch (enrollment.status) {
            case 'AWAITING_ENTRY':
              return entryButton;
            case 'ENROLLED':
              return (
                <>
                  {updateButton}
                  {exitButton}
                </>
              );
            case 'EXITED':
              return entryButton;
            default:
              return '';
          }
        },
      },
    ],
    []
  );

  return (
    <>
      <Header as="h4">Program Enrollments</Header>
      <ControlledTable
        columns={columns}
        data={tableData}
        loading={loading}
        fetchData={programsIndex.fetchData}
        error={error}
      />
    </>
  );
}
