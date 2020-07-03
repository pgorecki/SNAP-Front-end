import React, { useEffect, useState } from 'react';
import { Button, Header, Form } from 'semantic-ui-react';
import ControlledTable from 'components/ControlledTable';
import { ErrorMessage } from 'components/common';
import toaster from 'components/toaster';
import useApiClient from 'hooks/useApiClient';
import usePaginatedResourceIndex from 'hooks/usePaginatedResourceIndex';
import useResourceIndex from 'hooks/useResourceIndex';
import { formatDateTime } from 'utils/typeUtils';
import { formatApiError } from 'utils/apiUtils';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import PaginatedDataTable from 'components/PaginatedDataTable';

function EnrollmentForm({ programsIndex, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const { data, ready, error } = programsIndex;

  const options = data
    ? data.map(({ program }) => ({
        value: program.id,
        text: program.name,
      }))
    : [];

  useEffect(() => {
    if (data && data.length > 0 && selectedProgram === null) {
      setSelectedProgram(data[0].program.id);
    }
  }, [ready]);
  console.log(data, ready, error);

  async function handleEnroll() {
    setLoading(true);
    await onSubmit(selectedProgram);
    setLoading(false);
  }

  return (
    <Form>
      <Form.Group>
        <Form.Select
          options={options}
          placeholder="Select Program"
          value={selectedProgram}
          onChange={(e, { value }) => setSelectedProgram(value)}
          disabled={!ready}
        />
        <Button
          color="green"
          disabled={!selectedProgram || loading}
          onClick={() => handleEnroll()}
        >
          Entry Survey
        </Button>
        <Button
          color="yellow"
          disabled={!selectedProgram || loading}
          onClick={() => handleEnroll()}
        >
          Enroll
        </Button>
      </Form.Group>
      <ErrorMessage error={error} />
    </Form>
  );
}

export default function EnrollmentsTab({ client }) {
  const apiClient = useApiClient();
  const table = usePaginatedDataTable({
    url: `/programs/enrollments/?client=${client.id}`,
  });

  const programsIndex = useResourceIndex(`/programs/agency_configs/`);

  // const enrollmentsIndex = useResourceIndex(
  //   `/programs/enrollments/?client=${client.id}`
  // );
  // const [tableRows, setTableRows] = useState([]);

  // const loading = programsIndex.loading || enrollmentsIndex.loading;
  // const error = programsIndex.error || enrollmentsIndex.error;

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // const fetchData = async ({ pageIndex, pageSize }) => {
  //   const programsResponse = await programsIndex.fetchData();
  //   const enrollmentsResponse = await enrollmentsIndex.fetchData();
  //   const tableData = programsResponse.results.map((pac) => {
  //     const enrollment = enrollmentsResponse.results.find(
  //       (e) => e.program.id === pac.program.id
  //     );
  //     return {
  //       pac,
  //       enrollment,
  //     };
  //   });
  //   setTableRows(tableData);
  // };

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // const handleSetEnrollmentStatus = async (row, status) => {
  //   const { index, original } = row;
  //   const { enrollment, pac } = original;
  //   let result;
  //   try {
  //     if (enrollment) {
  //       result = await apiClient.patch(
  //         `/programs/enrollments/${enrollment.id}/`,
  //         {
  //           program: pac.program.id,
  //           client: client.id,
  //           status,
  //         }
  //       );
  //     } else {
  //       result = await apiClient.post('/programs/enrollments/', {
  //         program: pac.program.id,
  //         client: client.id,
  //         status,
  //       });
  //     }

  //     toaster.success(`Enrollment status for ${pac.program.name} updated`);

  //     const updatedRow = {
  //       ...original,
  //       enrollment: result.data,
  //     };
  //     const newRows = [...tableRows];
  //     newRows[index] = updatedRow;
  //     setTableRows(newRows);
  //   } catch (err) {
  //     toaster.error(formatApiError(err.response));
  //   }
  // };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Program',
        accessor: 'program.name',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => value || 'n/a',
      },
      {
        Header: 'Date Created',
        accessor: 'created_at',
        Cell: ({ value }) => (value ? formatDateTime(value, true) : ''),
      },
      {
        Header: 'Date Modified',
        accessor: 'modified_at',
        Cell: ({ value }) => (value ? formatDateTime(value, true) : ''),
      },
      {
        Header: 'Created By',
        accessor: 'created_by',
        Cell: ({ value }) => (value ? formatDateTime(value, true) : ''),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ value, row }) => {
          return <Button disabled>Details</Button>;
          // const { enrollment } = row.original;
          // const {
          //   enrollment_entry_survey: entrySurvey,
          //   enrollment_update_survey: updateSurvey,
          //   enrollment_exit_survey: exitSurvey,
          // } = row.original.pac;
          // console.log(entrySurvey, updateSurvey, exitSurvey);
          // const entryButton = entrySurvey ? (
          //   <Button
          //     color="green"
          //     onClick={() =>
          //       alert('Enrollment surveys not yet implemented. Skipping.') ||
          //       handleSetEnrollmentStatus(row, 'ENROLLED')
          //     }
          //   >
          //     Entry survey
          //   </Button>
          // ) : (
          //   <Button
          //     color="green"
          //     onClick={() => handleSetEnrollmentStatus(row, 'ENROLLED')}
          //   >
          //     Enter
          //   </Button>
          // );
          // const updateButton = updateSurvey ? (
          //   <Button
          //     color="green"
          //     onClick={() =>
          //       alert('Enrollment surveys not yet implemented. Skipping.') ||
          //       handleSetEnrollmentStatus(row, 'ENROLLED')
          //     }
          //   >
          //     Update survey
          //   </Button>
          // ) : null;
          // const exitButton = exitSurvey ? (
          //   <Button
          //     color="yellow"
          //     onClick={() =>
          //       alert('Enrollment surveys not yet implemented. Skipping.') ||
          //       handleSetEnrollmentStatus(row, 'EXITED')
          //     }
          //   >
          //     Exit survey
          //   </Button>
          // ) : (
          //   <Button
          //     color="yellow"
          //     onClick={() => handleSetEnrollmentStatus(row, 'EXITED')}
          //   >
          //     Exit
          //   </Button>
          // );
          // if (!enrollment) {
          //   // return entryButton;
          // }
          // switch (enrollment.status) {
          //   case 'AWAITING_ENTRY':
          //   // return entryButton;
          //   case 'ENROLLED':
          //     return <>{/* {updateButton}
          //         {exitButton} */}</>;
          //   default:
          //     return null;
          // }
        },
      },
    ],
    []
  );

  console.log(table.data);

  return (
    <>
      <Header as="h4">Enroll to Program</Header>
      <EnrollmentForm
        client={client}
        programsIndex={programsIndex}
        onSubmit={async (program) => {
          try {
            await apiClient.post('/programs/enrollments/', {
              client: client.id,
              status: 'ENROLLED',
              program,
            });
            toaster.success('Enrolled to program');
            table.reload();
          } catch (err) {
            toaster.error(formatApiError(err.response));
          }
        }}
      />

      <Header as="h4">History</Header>
      <PaginatedDataTable columns={columns} table={table} />
    </>
  );
}
