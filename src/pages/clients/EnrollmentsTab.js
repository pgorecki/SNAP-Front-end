import React, { useEffect, useState } from 'react';
import { Button, Header } from 'semantic-ui-react';
import ControlledTable from 'components/ControlledTable';
import toaster from 'components/toaster';
import useApiClient from 'hooks/useApiClient';
import { formatDateTime } from 'utils/typeUtils';
import { formatApiError } from 'utils/apiUtils';

import useResourceIndex from 'hooks/useResourceIndex';
import usePaginatedResourceIndex from 'hooks/usePaginatedResourceIndex';

export default function EnrollmentsTab({ client, currentUser }) {
  const programsIndex = usePaginatedResourceIndex(`/programs/agency_configs/`);
  const enrollmentsIndex = useResourceIndex(
    `/programs/enrollments/?client=${client.id}`
  );
  const [tableRows, setTableRows] = useState([]);
  const [apiClient] = useApiClient();

  const loading = programsIndex.loading || enrollmentsIndex.loading;
  const error = programsIndex.error || enrollmentsIndex.error;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async ({ pageIndex, pageSize }) => {
    const programsResponse = await programsIndex.fetchData();
    const enrollmentsResponse = await enrollmentsIndex.fetchData();
    const tableData = programsResponse.results.map((pac) => {
      const enrollment = enrollmentsResponse.results.find(
        (e) => e.program.id === pac.program.id
      );
      return {
        pac,
        enrollment,
      };
    });
    setTableRows(tableData);
  };

  const handleSetEnrollmentStatus = async (row, status) => {
    const { index, original } = row;
    const { enrollment, pac } = original;
    let result;
    try {
      if (enrollment) {
        result = await apiClient.patch(
          `/programs/enrollments/${enrollment.id}/`,
          {}
        );
      } else {
        result = await apiClient.post('/programs/enrollments/', {});
      }

      toaster.success(`Enrollment status for ${pac.program.name} updated`);

      const updatedRow = {
        ...original,
        enrollment: result.data,
      };
      const newRows = [...tableRows];
      newRows[index] = updatedRow;
      setTableRows(newRows);
    } catch (err) {
      toaster.error(formatApiError(err.response));
    }
  };

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
            <Button
              color="green"
              onClick={() =>
                alert('Enrollment surveys not yet implemented. Skipping.') ||
                handleSetEnrollmentStatus(row, 'ENROLLED')
              }
            >
              Entry survey
            </Button>
          ) : (
            <Button
              color="green"
              onClick={() => handleSetEnrollmentStatus(row, 'ENROLLED')}
            >
              Enter
            </Button>
          );
          const updateButton = updateSurvey ? (
            <Button
              color="green"
              onClick={() =>
                alert('Enrollment surveys not yet implemented. Skipping.') ||
                handleSetEnrollmentStatus(row, 'ENROLLED')
              }
            >
              Update survey
            </Button>
          ) : null;
          const exitButton = exitSurvey ? (
            <Button
              color="yellow"
              onClick={() =>
                alert('Enrollment surveys not yet implemented. Skipping.') ||
                handleSetEnrollmentStatus(row, 'EXITED')
              }
            >
              Exit survey
            </Button>
          ) : (
            <Button
              color="yellow"
              onClick={() => handleSetEnrollmentStatus(row, 'EXITED')}
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

  useEffect(() => {
    fetchData({ pageIndex: 0, pageSize: 10 });
  }, []);

  return (
    <>
      <Header as="h4">Program Enrollments</Header>
      <ControlledTable
        columns={columns}
        data={tableRows}
        loading={loading}
        fetchData={fetchData}
        error={error}
      />
    </>
  );
}
