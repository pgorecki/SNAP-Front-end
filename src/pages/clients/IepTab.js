import React, { useState } from 'react';
import { Button, Form, Header, Modal } from 'semantic-ui-react';
import { Formik } from 'formik';
import moment from 'moment';
import { NavLink, useHistory } from 'react-router-dom';
import { ErrorMessage, IEPStatus } from 'components/common';
import { FormInput, FormDatePicker, FormErrors } from 'components/FormFields';
import PaginatedDataTable from 'components/PaginatedDataTable';
import useNewResource from 'hooks/useNewResource';
import { EditActionLink } from 'components/tableComponents';
import toaster from 'components/toaster';
import { formatApiError, apiErrorToFormError } from '../../utils/apiUtils';

import { formatDate } from 'utils/typeUtils';
import { formatOwner } from 'utils/modelUtils';

import useResourceIndex from 'hooks/useResourceIndex';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import useApiClient from 'hooks/useApiClient';

export default function IEPTab({ client }) {
  const apiClient = useApiClient();
  const [showNewIEPModal, setShowNewIEPModal] = useState(false);
  const table = usePaginatedDataTable({
    url: `/iep/?client=${client.id}`,
  });

  const columns = React.useMemo(
    () => [
      {
        Header: 'Start Date',
        accessor: 'start_date',
        Cell: ({ value }) => (value ? formatDate(value) : ''),
      },
      {
        Header: 'End Date',
        accessor: 'end_date',
        Cell: ({ value }) => (value ? formatDate(value) : ''),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => <IEPStatus value={value} />,
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row, actions }) => (
          <>
            <EditActionLink disabled to={`#`} />
            {/* <Button
              onClick={(...args) => {
                actions.updateRow(row, { created_at: new Date() });
              }}
            /> */}
          </>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Button onClick={() => setShowNewIEPModal(true)}>New IEP</Button>
      <Modal size="tiny" open={showNewIEPModal}>
        <Modal.Header>New IEP</Modal.Header>
        <Modal.Content>
          <Formik
            enableReinitialize
            initialValues={{ start_date: new Date(), client: client.id }}
            onSubmit={async (values, actions) => {
              try {
                await apiClient.post('/iep/', {
                  ...values,
                  start_date: moment(values.start_date).format('YYYY-MM-DD'),
                  end_date: moment(values.start_date).format('YYYY-MM-DD'),
                });
                toaster.success('New IEP created');
                setShowNewIEPModal(false);
                table.reload();
              } catch (err) {
                actions.setErrors(apiErrorToFormError(err));
              }
              actions.setSubmitting(false);
            }}
          >
            {(form) => (
              <Form error onSubmit={form.handleSubmit}>
                <FormDatePicker
                  label="Start Date"
                  name="start_date"
                  form={form}
                  required
                />
                <FormDatePicker
                  label="Projected End Date"
                  name="projected_end_date"
                  form={form}
                />
                <FormErrors form={form} />
                <Button primary type="submit" disabled={form.isSubmitting}>
                  Request Eligibility
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setShowNewIEPModal(false)}>Cancel</Button>
        </Modal.Actions>
      </Modal>
      <Header as="h4">IEPs</Header>
      <PaginatedDataTable columns={columns} table={table} />
    </>
  );
}
