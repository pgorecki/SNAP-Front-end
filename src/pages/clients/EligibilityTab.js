import React, { useState, useEffect, useRef } from 'react';
import { Button, Header, Form, Message } from 'semantic-ui-react';
import { ErrorMessage } from 'components/common';
import PaginatedDataTable from 'components/PaginatedDataTable';
import toaster from 'components/toaster';
import useApiClient from 'hooks/useApiClient';
import { formatDateTime } from 'utils/typeUtils';
import { formatApiError } from 'utils/apiUtils';
import useResourceIndex from 'hooks/useResourceIndex';

function EligibilityUpdateForm({ client, onUpdate }) {
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

  function handleUpdateEligibility(isEligible) {
    onUpdate(selectedEligibility, isEligible, setLoading);
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
          color="yellow"
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
  const tableRef = useRef();
  const apiClient = useApiClient();

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'eligibility.name',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => value || 'n/a',
      },
      {
        Header: 'Date Modified',
        accessor: 'modified_at',
        Cell: ({ value }) => (value ? formatDateTime(value, true) : ''),
      },
    ],
    []
  );

  return (
    <>
      <Header as="h4">Update Eligibility</Header>
      <EligibilityUpdateForm
        client={client}
        onUpdate={async (eligibility, isEligible, setLoading) => {
          setLoading(true);
          try {
            await apiClient.post('/eligibility/clients/', {
              client: client.id,
              status: isEligible ? 'ELIGIBLE' : 'NOT_ELIGIBLE',
              eligibility,
            });
            toaster.success(`Eligibility updated`);
          } catch (err) {
            toaster.error(formatApiError(err.response));
          } finally {
            setLoading(false);
          }
        }}
      />
      <Header as="h4">History</Header>
      <PaginatedDataTable
        columns={columns}
        url={`/eligibility/clients/?client=${client.id}`}
      />
    </>
  );
}
