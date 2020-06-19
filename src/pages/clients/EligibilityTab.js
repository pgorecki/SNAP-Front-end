import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import ControlledTable from 'components/ControlledTable';
import useResourceIndex from 'hooks/useResourceIndex';
import usePaginatedResourceIndex from 'hooks/usePaginatedResourceIndex';
import { formatDateTime } from 'utils/typeUtils';

export default function EligibilityTab({ client, currentUser }) {
  const programsIndex = usePaginatedResourceIndex(`/programs/agency_configs/`);

  const eligibilityIndex = useResourceIndex(
    `/programs/eligibility/?client=${client.id}`
  );

  const loading = programsIndex.loading || eligibilityIndex.loading;
  const error = programsIndex.error || eligibilityIndex.error;
  const ready = !loading && !error;

  //const tableData = loading ? [] : programsIndex.data;
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
  ready && console.log(eligibilityIndex.data.results);

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
            <Button color="green">Eligible</Button>
            <Button color="yellow">Not eligible</Button>
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
