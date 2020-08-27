import React, { useState, useEffect, useRef } from 'react';
import { Button, Header, Form, Message, Label } from 'semantic-ui-react';
import { EligibilityStatus, ErrorMessage } from 'components/common';
import PaginatedDataTable from 'components/PaginatedDataTable';
import toaster from 'components/toaster';
import useApiClient from 'hooks/useApiClient';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import { formatDateTime } from 'utils/typeUtils';
import { formatApiError } from 'utils/apiUtils';
import useResourceIndex from 'hooks/useResourceIndex';
import { formatOwner } from 'utils/modelUtils';

function EligibilityUpdateForm({ onUpdate }) {
  const [loading, setLoading] = useState(false);
  const { data, ready, error } = useResourceIndex(
    '/eligibility/agency_configs/'
  );
  const [selectedEligibility, setSelectedEligibility] = useState(null);

  const options = data
    ? data.map(({ id, eligibility }) => ({
        value: eligibility.id,
        text: eligibility.name,
      }))
    : [];

  useEffect(() => {
    if (data && data.length > 0 && selectedEligibility === null) {
      setSelectedEligibility(data[0].eligibility.id);
    }
  }, [ready]);

  async function handleUpdateEligibility(isEligible) {
    setLoading(true);
    await onUpdate(selectedEligibility, isEligible);
    setLoading(false);
  }

  return (
    <Form>
      <Form.Group>
        <Form.Select
          options={options}
          placeholder="Select Eligibility"
          value={selectedEligibility}
          onChange={(e, { value }) => setSelectedEligibility(value)}
          disabled={!ready}
        />
        <Button
          color="green"
          disabled={!selectedEligibility || loading}
          onClick={() => handleUpdateEligibility(true)}
        >
          Eligible
        </Button>
        <Button
          color="red"
          disabled={!selectedEligibility || loading}
          onClick={() => handleUpdateEligibility(false)}
        >
          Not Eligible
        </Button>
      </Form.Group>
      <ErrorMessage error={error} />
    </Form>
  );
}

export default function EligibilityTab({ client, currentUser }) {
  const table = usePaginatedDataTable({
    url: `/eligibility/clients/?client=${client.id}`,
  });
  // const apiClient = useApiClient();

  const columns = React.useMemo(
    () => [
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          return <EligibilityStatus value={value} />;
        },
      },
      {
        Header: 'Date Created',
        accessor: 'created_at',
        Cell: ({ value }) => (value ? formatDateTime(value, true) : ''),
      },
      {
        Header: 'Created By',
        accessor: 'created_by',
        Cell: ({ value }) => formatOwner(value),
      },
    ],
    []
  );

  return (
    <>
      {/* <Header as="h4">Update Eligibility</Header>
      <EligibilityUpdateForm
        client={client}
        onUpdate={async (eligibility, isEligible) => {
          try {
            await apiClient.post('/eligibility/clients/', {
              client: client.id,
              status: isEligible ? 'ELIGIBLE' : 'NOT_ELIGIBLE',
              eligibility,
            });
            toaster.success(`Eligibility updated`);
            table.reload();
          } catch (err) {
            toaster.error(formatApiError(err.response));
          }
        }}
      /> */}
      <Header as="h4">Eligibility History</Header>
      <PaginatedDataTable columns={columns} table={table} />
    </>
  );
}
