import React, { useState, useContext } from 'react';
import { Button, Form, Header, Modal } from 'semantic-ui-react';
import { Formik } from 'formik';
import moment from 'moment';
import { NavLink, useHistory } from 'react-router-dom';
import { AppContext } from 'AppStore';
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
import { hasPermission } from 'utils/permissions';
import TestTab from './TestTab';

let programValues = {};
let iepRow = {};

export default function IEPTab({ client }) {
  const [{ user }] = useContext(AppContext);
  const apiClient = useApiClient();
  const [showNewIEPModal, setShowNewIEPModal] = useState(false);
  const [StepModal, setStepModal] = useState(true);
  const table = usePaginatedDataTable({
    url: `/iep/?client=${client.id}`,
  });
  const [isOpened, setIsOpened] = useState(false);
  // const handleClose = () => setIsOpened(false);
  // const handleShow = () => setIsOpened(true);

  function toggle(row) {
    setIsOpened(true);
    programValues = row;
  }

  function handleClose() {
    table.reload();
    setIsOpened(false);
  }

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
            <Button onClick={() => toggle(row)}>Details</Button>
            {/* <EditActionLink disabled to={`#`} /> */}
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
      <Button
        onClick={() => setShowNewIEPModal(true)}
        disabled={!hasPermission(user, 'iep.add_clientiep')}
      >
        New IEP
      </Button>
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
      {isOpened && (
        <Modal size="large" open={isOpened}>
          <Modal.Header></Modal.Header>
          <Modal.Content>
            <TestTab ieprow={programValues}>
            </TestTab>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleClose}>Cancel</Button>
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}
