import React, { useEffect, useState } from 'react';
import {
  Button,
  Header,
  Form,
  Grid,
  Modal,
  Tab,
  Loader,
  Message,
} from 'semantic-ui-react';
import { Formik } from 'formik';
import useApiClient from 'hooks/useApiClient';
import useResourceIndex from 'hooks/useResourceIndex';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import PaginatedDataTable from 'components/PaginatedDataTable';
import { NavLink, useHistory } from 'react-router-dom';
import useResource from 'hooks/useResource';
import useNewResource from 'hooks/useNewResource';
import useUrlParams from 'hooks/useUrlParams';
import { formatDateTime, FieldError, formatDate } from 'utils/typeUtils';
import toaster from 'components/toaster';
import EnrollmentSurveyModal from 'modals/EnrollmentSurveyModal';
import useFetchData from 'hooks/useFetchData';
import {
  FormSelect,
  FormDatePicker,
  FormErrors,
  FormInput,
  FormTextArea,
} from 'components/FormFields';
import {
  EditActionLink,
  DeleteActionButton,
  EditActionButton,
} from '../../components/tableComponents';
import ListPage from '../ListPage';
import { formatOwner } from '../../utils/modelUtils';

export default function CaseNotesTab({ enrollData }) {
  //console.log(enrollData);
  const history = useHistory();
  const apiClient = useApiClient();
  const programsIndex = useResourceIndex(`/programs/?ordering=name`);
  const table = usePaginatedDataTable({
    url: `/notes/?source_id=${enrollData.id}`,
  });
  console.log(table);
  const { save } = useNewResource('/notes/', {});
  const { data, ready, error } = programsIndex;
  //Modal related
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [modalData, setModaData] = useState({});
  const [modalDataEd, setModaDataEd] = useState({});
  //console.log(modalDataEd);
  const [initialValues, setInitialValues] = useState({
    source: {
      id: enrollData.id,
      type: 'Enrollment',
    },
    //,text:'a message'
  });
  const options = data
    ? data.map(({ id, name }) => ({
      value: id,
      text: name,
    }))
    : [];
  //console.log(options);
  const cncolumns = React.useMemo(
    () => [
      {
        Header: 'Case Note Type',
        accessor: 'title',
      },
      {
        Header: 'Date',
        accessor: 'created_at',
        Cell: ({ value }) => (value ? formatDate(value) : ''),
      },
      {
        Header: 'User Creating',
        accessor: 'created_by',
        Cell: ({ value }) => formatOwner(value),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <>
            <EditActionButton
              onClick={() => setModaDataEd({ ...row.original })}
            />
            <DeleteActionButton
              onClick={() => setModaData({ ...row.original })}
            />
          </>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Button primary onClick={handleShow}>
        New Case Note
      </Button>
      <PaginatedDataTable columns={cncolumns} table={table} />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          //debugger;
          try {
            const result = await save({
              ...values,
              title: values.subject,
              text: values.noteDesc,
            });
            //history.push(`/notes/${result.id}`);
            toaster.success('Notes created');
          } catch (err) {
            actions.setErrors(apiErrorToFormError(err));
          }
          actions.setSubmitting(false);
          handleClose();
          actions.resetForm();
          table.reload();
        }}
      >
        {(form) => {
          if (!data) {
            return null;
          }
          const selectedProgram =
            data && data.find((program) => program.id === form.values.program);

          let intakeSurvey = null;
          if (selectedProgram) {
            intakeSurvey = selectedProgram.enrollment_entry_survey;
          }

          return (
            <>
              <Modal open={show} onHide={handleClose}>
                <Modal.Header>New Case Note</Modal.Header>
                <Modal.Content>
                  <Form error onSubmit={form.handleSubmit}>
                    <FormInput label="Subject:" name="subject" form={form} />
                    <FormSelect
                      label="Select Template"
                      name="template"
                      form={form}
                      options={options}
                      placeholder="Select Template"
                      disabled="true"
                    />
                    <FormDatePicker label="Date" name="date" form={form} />
                    <FormTextArea
                      name="noteDesc"
                      placeholder="Enter note here"
                      form={form}
                    />
                    <FormErrors form={form} />
                    <Button primary type="submit" disabled={form.isSubmitting}>
                      Submit
                    </Button>
                    <Button onClick={() => {
                      handleClose();
                      form.resetForm();
                    }}>
                      Cancel
                        </Button>
                  </Form>
                </Modal.Content>
              </Modal>
            </>
          );
        }}
      </Formik>
      <Modal closeIcon open={!!modalData.id} onClose={() => setModaData({})}>
        <Modal.Header>Delete Note</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>
              Are you sure you want to delete note{' '}
              <strong>{modalData.text}</strong>?
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={async () => {
              try {
                await apiClient.delete(`/notes/${modalData.id}/`);
                table.reload();
              } catch (err) {
                const apiError = formatApiError(err.response);
                toaster.error(apiError);
              } finally {
                setModaData({});
              }
            }}
          >
            Delete Note
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal
        closeIcon
        open={!!modalDataEd.id}
        onClose={() => setModaDataEd({})}
      >
        <Modal.Header>Edit Case Note</Modal.Header>
        <Modal.Content>
          <Formik
            enableReinitialize
            initialValues={modalDataEd}
            onSubmit={async (values, actions) => {
              try {
                //debugger;
                await apiClient.patch(`/notes/${values.id}/`, {
                  source: {
                    id: values.source.id,
                    type: 'Enrollment',
                  },
                  title: values.title,
                  text: values.text,
                });
                setModaDataEd({});
                toaster.success('Notes updated');
              } catch (err) {
                actions.setErrors(apiErrorToFormError(err));
              }
              actions.setSubmitting(false);
              //handleClose();
              table.reload();
            }}
          >
            {(formEdit) => {
              return (
                <>
                  <Form
                    error
                    initialValues={modalDataEd}
                    onSubmit={formEdit.handleSubmit}
                  >
                    <FormInput
                      label="Subject:"
                      name="subject"
                      form={formEdit}
                      value={modalDataEd.title}
                      onChange={(e) =>
                        setModaDataEd({ ...modalDataEd, title: e.target.value })
                      }
                    />
                    <FormDatePicker label="Date" name="date" form={formEdit} />
                    <FormTextArea
                      name="note"
                      placeholder="Enter note here"
                      form={formEdit}
                      value={modalDataEd.text}
                      onChange={(e) =>
                        setModaDataEd({ ...modalDataEd, text: e.target.value })
                      }
                    />
                    <Button
                      primary
                      type="submits"
                      disabled={formEdit.isSubmitting}
                    >
                      Submit
                    </Button>
                    <Button
                      onClick={async () => {
                        setModaDataEd({});
                      }}
                    >
                      Cancel
                    </Button>
                    <FormErrors form={formEdit} />
                  </Form>
                </>
              );
            }}
          </Formik>
        </Modal.Content>
      </Modal>
    </>
  );
}
