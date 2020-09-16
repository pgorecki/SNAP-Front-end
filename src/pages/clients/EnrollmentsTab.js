import React, { useEffect, useState, useContext } from 'react';
import { Button, Header, Form, Grid, Modal } from 'semantic-ui-react';
import { Formik } from 'formik';
import { AppContext } from 'AppStore';
import { FormSelect, FormDatePicker, FormErrors } from 'components/FormFields';
import toaster from 'components/toaster';
import EnrollmentSurveyModal from 'modals/EnrollmentSurveyModal';
import useApiClient from 'hooks/useApiClient';
import useResourceIndex from 'hooks/useResourceIndex';
import { formatDateTime, FieldError } from 'utils/typeUtils';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import PaginatedDataTable from 'components/PaginatedDataTable';
import { useHistory } from 'react-router-dom';
import useUrlParams from 'hooks/useUrlParams';
import EnrollmentDetails from '../programs/EnrollmentDetails';
import { hasPermission } from 'utils/permissions';
import moment from 'moment';
import { date } from 'yup';
import { EditActionButton } from '../../components/tableComponents';
import { EndActionButton } from '../../components/tableComponents';

var enrollmentId = '';
var programName = '';
var programValues = {};

function EnrollmentForm({ programsIndex, onSubmit }) {
  const { data, ready } = programsIndex;

  const [initialValues, setInitialValues] = useState({
    surveyId: null,
    program: null,
    start_date: new Date(),
  });

  const options = data
    ? data.map(({ id, name }) => ({
      value: id,
      text: name,
    }))
    : [];

  useEffect(() => {
    if (data && data.length > 0 && initialValues.program === null) {
      setInitialValues({ ...initialValues, program: data[0].id });
    }
  }, [ready]);

  return (
    <Grid>
      <Grid.Column computer={8} mobile={16}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            try {
              await onSubmit({
                ...values,
                program: data.find((program) => program.id === values.program),
              });
            } catch (err) {
              actions.setErrors(apiErrorToFormError(err));
            }
            actions.setSubmitting(false);
          }}
        >
          {(form) => {
            if (!data) {
              return null;
            }
            const selectedProgram =
              data &&
              data.find((program) => program.id === form.values.program);

            let intakeSurvey = null;
            if (selectedProgram) {
              intakeSurvey = selectedProgram.enrollment_entry_survey;
            }

            return (
              <Form error onSubmit={form.handleSubmit}>
                <FormSelect
                  label="Progam"
                  name="program"
                  form={form}
                  required
                  options={options}
                  placeholder="Select program"
                />
                <FormDatePicker
                  label="Start Date"
                  name="start_date"
                  form={form}
                  required
                />
                <FormErrors form={form} />
                <Button
                  primary
                  type="submit"
                  disabled={!intakeSurvey || form.isSubmitting}
                  onClick={() => {
                    form.setFieldValue('surveyId', intakeSurvey.id);
                  }}
                >
                  Start enrollment
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Grid.Column>
    </Grid>
  );
}

// function showPasswordPage(enrollmentid) {
//   console.log(enrollmentid);
//   showEdit = true;
//   enrollmentid = enrollmentid;
// }

export default function EnrollmentsTab({ client }) {
  const history = useHistory();
  const [{ user }] = useContext(AppContext);
  const [modalSurveyData, setModalSurveyData] = useState();
  const [modalEndSurveyData, setModalEndSurveyData] = useState();
  const [isOpened, setIsOpened] = useState(false);
  const handleClose = () => setIsOpened(false);
  const handleShow = () => setIsOpened(true);
  const apiClient = useApiClient();
  const [urlParams, queryParams, fragment] = useUrlParams();
  const clientFullName = 'Test';
  const [SummarytabModal, setSummarytabModal] = useState(true);
  const table = usePaginatedDataTable({
    url: `/programs/enrollments/?client=${client.id}`,
  });
  console.log(table);
  const [showEndSurveyForm, setshowEndSurveyForm] = useState();
  const [modalData, setModaData] = useState({});
  const programsIndex = useResourceIndex(`/programs/?ordering=name`);
  //console.log(table);
  function toggle(enrolid, values) {
    setIsOpened((wasOpened) => !wasOpened);
    enrollmentId = enrolid;
    programName = values["program.name"];
    programValues = values;
  }
  const [initialValues, setInitialValues] = useState({
    surveyId: null,
    program: null,
    end_date: new Date(),
  });
  const columns = React.useMemo(
    () => [
      {
        Header: 'Program',
        accessor: 'program.name',
      },
      {
        Header: 'Start Date',
        accessor: 'created_at',
        Cell: ({ value }) => (value ? formatDateTime(value, true) : ''),
      },
      {
        Header: 'End Date',
        accessor: 'end_date',
        Cell: ({ value }) => (value ? formatDateTime(value, true) : ''),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => value || 'n/a',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ value, row }) => {
          // console.log(row)
          return (
            <>
              <EditActionButton onClick={() => toggle(row.original.id, row.values)}></EditActionButton>
              <EndActionButton disabled={row.original.status != 'ENROLLED'} negative onClick={() => setModalEndSurveyData({ ...row.original })}></EndActionButton>
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      {hasPermission(user, 'program.add_enrollment') && (
        <>
          <Header as="h4">Enroll to Program</Header>
          <EnrollmentForm
            client={client}
            programsIndex={programsIndex}
            onSubmit={async (values) => {
              const { program } = values;
              const result = await apiClient.get(
                `/programs/enrollments/?client=${client.id}&program=${program.id}`
              );
              if (result.data.count > 0) {
                throw new FieldError(
                  'program',
                  `Client already enrolled to ${program.name}`
                );
              }

              // open the survey modal
              setModalSurveyData(values);
            }}
          />
        </>
      )}

      <Header as="h4">Enrollments History</Header>
      <PaginatedDataTable columns={columns} table={table} />
      {isOpened && (
        <Modal open={SummarytabModal}>
          <Modal.Header>{programName}</Modal.Header>
          <Modal.Content>
            <EnrollmentDetails
              title={clientFullName}
              enrollmentId={enrollmentId}
              pdata={programValues}
            //loading={loading}
            //error={formatApiError(error)} 
            >
            </EnrollmentDetails>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleClose}>Cancel</Button>
          </Modal.Actions>
        </Modal>
      )}
      <Modal size="large" open={!!modalSurveyData}>
        <Modal.Header>Enrollment survey</Modal.Header>
        <Modal.Content>
          {modalSurveyData && modalSurveyData.surveyId && (
            <EnrollmentSurveyModal
              client={client}
              programId={modalSurveyData.program.id}
              surveyId={modalSurveyData.surveyId}
              onResponseSubmit={async (newResponseData) => {
                const { program, start_date } = modalSurveyData;

                try {
                  const enrollmentResponse = await apiClient.post(
                    '/programs/enrollments/',
                    {
                      client: client.id,
                      status: 'ENROLLED',
                      program: program.id,
                      start_date: moment(start_date).format('YYYY-MM-DD'),
                    }
                  );
                  const enrollment = enrollmentResponse.data;
                  toaster.success('Enrolled to program');
                  console.log('xxxx', enrollment);
                  console.log(enrollment, {
                    ...newResponseData,
                    response_context: {
                      id: enrollment.id,
                      type: 'Enrollment',
                    },
                  });
                  await apiClient.post('/responses/', {
                    ...newResponseData,
                    response_context: {
                      id: enrollment.id,
                      type: 'Enrollment',
                    },
                  });
                  toaster.success('Entry response saved');
                } catch (err) {
                  const apiError = formatApiError(err.response);
                  toaster.error(apiError);
                }
                setModalSurveyData(null);
                table.reload();
              }}
            />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalSurveyData(null)}>Cancel</Button>
        </Modal.Actions>
      </Modal>

      <Modal size="large" open={!!modalEndSurveyData}>
        <Modal.Header>Exit survey</Modal.Header>
        <Modal.Content>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={async (values, actions) => {
              try {
                initialValues.end_date = values.end_date;
              } catch (err) {
                actions.setErrors(apiErrorToFormError(err));
              }
              actions.setSubmitting(false);
            }}
          >
            {(form) => {
              return (
                <Form error onSubmit={form.handleSubmit}>
                  <FormDatePicker
                    label="End Date"
                    name="end_date"
                    form={form}
                    required
                  />
                  <FormErrors form={form} />
                  <Button
                    primary
                    type="submit"
                    onClick={() => {
                      setshowEndSurveyForm(true);
                    }}
                  >
                    Fill Survey
                </Button>
                </Form>
              );
            }}
          </Formik>
          {modalEndSurveyData && showEndSurveyForm &&
            (modalEndSurveyData.program.enrollment_entry_survey == null ? '' : modalEndSurveyData.program.enrollment_entry_survey.id) && (
              <EnrollmentSurveyModal
                client={client}
                programId={modalEndSurveyData.program.id}
                surveyId={modalEndSurveyData.program.enrollment_entry_survey == null ? '' : modalEndSurveyData.program.enrollment_entry_survey.id}
                onResponseSubmit={async (newResponseData) => {
                  const { program, end_date } = modalEndSurveyData;

                  try {
                    //debugger;
                    const enrollmentResponse = await apiClient.patch(`/programs/enrollments/${modalEndSurveyData.id}/`,
                      {
                        client: client.id,
                        status: 'COMPLETED',
                        program: modalEndSurveyData.programId,
                        end_date: moment(initialValues.end_date).format('YYYY-MM-DD'),
                      });
                    const enrollment = enrollmentResponse.data;
                    toaster.success('Enrollment completed');

                    await apiClient.post('/responses/', {
                      ...newResponseData,
                      response_context: {
                        id: enrollment.id,
                        type: 'Enrollment',
                      },
                    });
                    toaster.success('Exit response saved');
                  } catch (err) {
                    const apiError = formatApiError(err.response);
                    toaster.error(apiError);
                  }
                  setshowEndSurveyForm(false);
                  setModalEndSurveyData(null);
                  table.reload();
                }}
              />
            )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => {
            setshowEndSurveyForm(false);
            setModalEndSurveyData(null);
          }}
          >
            Cancel
            </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
