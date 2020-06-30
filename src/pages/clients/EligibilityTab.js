import React, { useState, useEffect, useCallback } from 'react';
import { Button, Header } from 'semantic-ui-react';
import ControlledTable from 'components/ControlledTable';
import toaster from 'components/toaster';
import useApiClient from 'hooks/useApiClient';
import { formatDateTime } from 'utils/typeUtils';
import { formatApiError } from 'utils/apiUtils';

export default function EligibilityTab({ client, currentUser }) {
  const [tableRows, setTableRows] = useState([]);
  const apiClient = useApiClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = useCallback(
    async ({ pageIndex, pageSize }) => {
      setLoading(true);
      try {
        const p1 = apiClient.get('/programs/agency_configs/');
        const p2 = apiClient.get(`/programs/eligibility/?client=${client.id}`);

        const programsIndex = (await p1).data;
        const eligibilityIndex = (await p2).data;

        const tableData = programsIndex.results
          .map(({ program }) => ({ program }))
          .map((pe) => {
            const { program } = pe;
            const eligibility = eligibilityIndex.results.find(
              (e) => e.program.id === program.id
            );
            return {
              program,
              eligibility,
            };
          });

        setTableRows(tableData);
      } catch (err) {
        setError(err.response);
      } finally {
        setLoading(false);
      }
    },
    [apiClient, client.id]
  );

  const handleSetEligibility = useCallback(
    async (row, isEligible) => {
      const { index, original } = row;
      const { eligibility, program } = original;

      let result;
      try {
        if (eligibility) {
          result = await apiClient.patch(
            `/programs/eligibility/${eligibility.id}/`,
            {
              status: isEligible ? 'ELIGIBLE' : 'NOT_ELIGIBLE',
              client: client.id,
              program: program.id,
            }
          );
        } else {
          result = await apiClient.post('/programs/eligibility/', {
            status: isEligible ? 'ELIGIBLE' : 'NOT_ELIGIBLE',
            client: client.id,
            program: program.id,
          });
        }
        toaster.success(`Eligibility status for ${program.name} updated`);

        const updatedRow = {
          ...original,
          eligibility: result.data,
        };
        const newRows = [...tableRows];
        newRows[index] = updatedRow;
        setTableRows(newRows);
      } catch (err) {
        toaster.error(formatApiError(err.response));
      }
    },
    [tableRows, apiClient, client.id]
  );

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
              onClick={() => handleSetEligibility(row, true)}
            >
              Eligible
            </Button>
            <Button
              color="yellow"
              onClick={() => handleSetEligibility(row, false)}
            >
              Not eligible
            </Button>
          </>
        ),
      },
    ],
    [handleSetEligibility]
  );

  return (
    <>
      <Header as="h4">Program Eligibility</Header>
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
