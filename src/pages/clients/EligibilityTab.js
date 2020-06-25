import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import ControlledTable from 'components/ControlledTable';
import toaster from 'components/toaster';
import useApiClient from 'hooks/useApiClient';
import usePaginatedResourceIndex from 'hooks/usePaginatedResourceIndex';
import useResourceIndex from 'hooks/useResourceIndex';
import { formatDateTime } from 'utils/typeUtils';
import { formatApiError } from 'utils/apiUtils';

export default function EligibilityTab({ client, currentUser }) {
  const programsIndex = usePaginatedResourceIndex(`/programs/agency_configs/`);
  const [apiClient] = useApiClient();

  const eligibilityIndex = useResourceIndex(
    `/programs/eligibility/?client=${client.id}`
  );

  async function handleSetEligibility({ program, eligibility }, status) {
    console.log(program, eligibility, status);
    if (eligibility) {
      // update existing
      try {
        await apiClient.patch(`/programs/eligibility/${eligibility.id}`, {
          status,
        });
        toaster.success('Eligibility updated');
      } catch (err) {
        const apiError = formatApiError(err.response);
        toaster.error(apiError);
      }
    } else {
      // create new
      try {
        await apiClient.post('/programs/eligibility/', {
          status,
        });
        toaster.success('Eligibility updated');
      } catch (err) {
        const apiError = formatApiError(err.response);
        toaster.error(apiError);
      }
    }
  }

  const loading = programsIndex.loading || eligibilityIndex.loading;
  const error = programsIndex.error || eligibilityIndex.error;
  const ready = programsIndex.ready && eligibilityIndex.ready;

  const tableData = ready
    ? programsIndex.data.results
        .map(({ program }) => ({ program }))
        .map((pe) => {
          const { program } = pe;
          const eligibility = eligibilityIndex.data.find(
            (e) => e.program.id === program.id
          );
          return {
            program,
            eligibility,
          };
        })
    : [];

  const columns = React.useMemo(
    () => [
      {
        Header: 'Program',
        accessor: 'program.name',
      },
      {
        Header: 'Status',
        accessor: 'eligibility.status',
        Cell: ({ value }) => value || 'n/a',
      },
      {
        Header: 'Date Modified',
        accessor: 'eligibility.modified_at',
        Cell: ({ value }) => (value ? formatDateTime(value, true) : ''),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <>
            <Button
              color="green"
              onClick={() => handleSetEligibility(row.original, 'eligible')}
            >
              Eligible
            </Button>
            <Button
              color="yellow"
              onClick={() => handleSetEligibility(row.original, 'not eligible')}
            >
              Not eligible
            </Button>
          </>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Header as="h4">Program Eligibility</Header>
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
