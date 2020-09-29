import React, { useEffect, useState, useContext } from 'react';
import {
  Button,
  Grid,
  Checkbox,
  Label,
  Modal,
  Header,
  Form,
  Dropdown,
  Icon
} from 'semantic-ui-react';
import { hasPermission } from 'utils/permissions';
import toaster from 'components/toaster';
import EnrollmentSurveyModal from 'modals/EnrollmentSurveyModal';
import IepSurveyModal from 'modals/IepSurveyModal';
import useResourceIndex from 'hooks/useResourceIndex';
import { AppContext } from 'AppStore';
import { Formik } from 'formik';
import {
  FormSelect,
  FormDatePicker,
  FormErrors,
  FormInput,
  FormTextArea,
} from 'components/FormFields';
import { formatDateTime, FieldError, formatDate } from 'utils/typeUtils';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import useApiClient from 'hooks/useApiClient';
import useNewResource from 'hooks/useNewResource';
import PaginatedDataTable from 'components/PaginatedDataTable';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import { CheckBoxIep } from '../../components/CheckBoxIep';
import moment from 'moment';
import useFetchData from 'hooks/useFetchData';
import { formatOwner } from 'utils/modelUtils';
import IepResponses from '../clients/IepResponses';

export const InProgressStep = (props) => {
  //console.log(props);
  const [data, error, loading] = useFetchData(`/programs/`, {});
  const [checkPrograms, setCheckedPrograms] = useState(null);
  const [isModidystate, setIsModifyState] = useState(false);
  const [isSurveyModel, setIsSurveyModelState] = useState(false);
  const [isBeginEnrollment, setIsBeginEnrollmentState] = useState(false);
  const [isCompleteEnrollment, setIsCompleteEnrollmentState] = useState(false);
  const [isNotesModel, setIsNotesModelState] = useState(false);
  const [listInitialPrograms, setListInitialPrograms] = useState(
    props.listPrograms
  );
  const [initProgram, setInitialProgram] = useState(null);
  const [initSurveyProgram, setInitialSurveyProgram] = useState(null);
  const [initClient, setClientState] = useState(props.client.client);
  const [initIep, setIepState] = useState(props.client);
  const [modalSurveyData, setModalSurveyData] = useState();
  const [modalSurveyDataOpen, setModalSurveyDataOpen] = useState(false);
  const [modalEndSurveyData, setModalEndSurveyData] = useState();
  const [surveyId, setSurveyId] = useState();
  const [enrollmentStartDate, setEnrollmentStartDate] = useState();
  const [enrollmentPendDate, setEnrollmentPendDate] = useState();
  // const [surveyIep, setsurveyIep] = useState(false);
  const [{ user }] = useContext(AppContext);
  const programsIndex = useResourceIndex(`/programs/?ordering=name`);
  const apiClient = useApiClient();
  const { save } = useNewResource('/notes/', {});
  const notestable = usePaginatedDataTable({
    url: `/notes/?source_id=${initIep.id}`,
  });
  //console.log(notestable);
  const [
    existingEnrollmentPrograms,
    setExistingEnrollmentPrograms,
  ] = useState();

  const [showIepSurveyResponses, setShowIepSurveyResponses] = useState(false);
  const [iepSurveyId, setIepSurveyId] = useState();
  const [SurveyData, ready] = useFetchData(`/surveys/`, {});
  const optionSurveys = !!SurveyData.results
    ? SurveyData.results.map(({ id, name }) => ({
      key: id,
      value: id,
      flag: id,
      text: name
    }))
    : [];

  function showResponses(event, data) {
    event.preventDefault();
    setIepSurveyId(data.value);
    setShowIepSurveyResponses(false);
    setSurveyId(data.value);
  }

  function opensurveyforiep() {
    setIsSurveyModelState(true);
    setSurveyId(null);
    setShowIepSurveyResponses(false);
  }

  function SelectSurvey() {
    setShowIepSurveyResponses(true);
    setIsSurveyModelState(false);
  }

  const exitingP = SavedPrograms();

  const modifyiep = () => {
    setIsModifyState(true);
    //setCheckedPrograms(listInitialPrograms);
  };

  function confirmEndClicked() {
    props.confirmEndIEPClicked();
  }

  async function SavedPrograms() {
    if (typeof existingEnrollmentPrograms === 'undefined') {
      const clientIEP = await apiClient.get(`/iep/${initIep['id']}`);
      const existingEnrolmments = clientIEP.data.enrollments;
      if (typeof existingEnrolmments !== 'undefined') {
        setExistingEnrollmentPrograms(existingEnrolmments);
        //console.log(existingEnrollmentPrograms);
      }
    }
  }

  async function modifyOkButtonClicked() {
    let updatedEnrollments = [];
    let newEnrollments = [];
    const clientIEP = await apiClient.get(`/iep/${initIep['id']}`);
    const existingEnrolmments = clientIEP.data.enrollments;
    checkPrograms.forEach(async (element) => {
      if (
        existingEnrolmments.findIndex(
          (x) =>
            x.program == element.id &&
            (x.status == 'ENROLLED' || x.status == 'PLANNED')
        ) == -1
      ) {
        //updatedEnrollments = [...updatedEnrollments, ]
        newEnrollments = {
          program: element.id,
          status: 'PLANNED',
        };
        updatedEnrollments = [...updatedEnrollments, newEnrollments];
      }
    });
    updatedEnrollments = [...existingEnrolmments, ...updatedEnrollments];
    const resultEnrollments = await apiClient.patch(`/iep/${initIep['id']}/`, {
      enrollments: updatedEnrollments,
    });
    setExistingEnrollmentPrograms(resultEnrollments.data.enrollments);
    setIsModifyState(null);
  }

  const handleChecks = (checks, category) => {
    setCheckedPrograms(checks);
    //console.log(checks)
  };

  function setPreData() {
    setCheckedPrograms(listInitialPrograms);
  }

  function BeginEnrollment(event, programId) {
    event.preventDefault();
    setInitialProgram(programId);
    setIsBeginEnrollmentState(true);
  }

  async function CompleteEnrollment(event, initP, programsIndex) {
    event.preventDefault();
    const { data, ready } = programsIndex;

    ///useEffect(() => {
    if (data && data.length > 0) {
      const selectedProgram =
        data && data.find((program) => program.id === initP.program);
      //setInitialValues({ ...initialValues, program: initP });
      setInitialProgram(initP);
      setModalEndSurveyData(selectedProgram);
    }
    // }, [ready]);

    setIsCompleteEnrollmentState(true);
  }

  async function CloseEnrollment() {
    setIsBeginEnrollmentState(false);
    setModalSurveyData(null);
    const clientIEP = await apiClient.get(`/iep/${initIep['id']}`);
    const existingEnrolmments = clientIEP.data.enrollments;
    if (typeof existingEnrolmments !== 'undefined') {
      setExistingEnrollmentPrograms(existingEnrolmments);
      //console.log(existingEnrollmentPrograms);
    }
  }

  function CloseNotes() {
    setIsNotesModelState(false);
    //setModalSurveyData(null);
  }

  function OpenNotes(event) {
    event.preventDefault();
    setIsNotesModelState(true);
  }

  function EnrollmentForm({ programsIndex, onSubmit, initP }) {
    //console.log(initP)
    //preventDefault();
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
        setInitialValues({ ...initialValues, program: initP.program });
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
                setInitialValues({ ...initialValues, ...values });
                await onSubmit({
                  ...values,
                  program: data.find(
                    (program) => program.id === values.program
                  ),
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
                    disabled
                  />
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
                  <Button
                    primary
                    type="submit"
                    disabled={!intakeSurvey || form.isSubmitting}
                    onClick={() => {
                      //event.preventDefault();
                      if (initP['status'] === 'ENROLLED') {
                        throw new FieldError(
                          'program',
                          `Client already enrolled to ${selectedProgram.name}`
                        );
                      }
                      setEnrollmentStartDate(form.values.start_date);
                      setEnrollmentPendDate(form.values.projected_end_date);
                      form.setFieldValue('surveyId', intakeSurvey.id);
                      setModalSurveyData(selectedProgram);
                      setIsBeginEnrollmentState(false);
                      setModalSurveyDataOpen(true);
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

  function NotesForm({ iepIndex }) {
    const [initialValues, setInitialValues] = useState({
      source: {
        id: iepIndex['id'],
        type: 'ClientIEP',
      },
    });
    return (
      <>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            try {
              const result = await save({
                ...values,
                title: values.subject,
                text: values.noteDesc,
                effective_date: values.date,
              });
              //history.push(`/notes/${result.id}`);
              toaster.success('Notes created');
            } catch (err) {
              actions.setErrors(apiErrorToFormError(err));
            }
            actions.setSubmitting(false);
            setIsNotesModelState(false);
            //actions.resetForm();
            notestable.reload();
          }}
        >
          {(form) => {
            return (
              <>
                <Form error onSubmit={form.handleSubmit}>
                  <FormInput label="Subject:" name="subject" form={form} />
                  {/* <FormSelect label="Select Template" name="template" form={form} options={options} placeholder="Select Template" disabled="true" /> */}
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
                </Form>
              </>
            );
          }}
        </Formik>
      </>
    );
  }

  const notescolumns = React.useMemo(
    () => [
      {
        Header: 'Subject',
        accessor: 'title',
      },
      {
        Header: 'Note',
        accessor: 'text',
      },
      {
        Header: 'Date',
        accessor: 'effective_date',
        Cell: ({ value }) => (value ? formatDate(value) : ''),
      },
      {
        Header: 'User Creating',
        accessor: 'created_by',
        Cell: ({ value }) => formatOwner(value),
      },
      // {
      //   Header: 'Actions',
      //   accessor: 'actions',
      //   Cell: ({ row }) => (
      //     <>
      //       <EditActionButton
      //         onClick={() => setModaDataEd({ ...row.original })}
      //       />
      //       <DeleteActionButton
      //         onClick={() => setModaData({ ...row.original })}
      //       />
      //     </>
      //   ),
      // },
    ],
    []
  );

  return (
    <>
      <div style={{ marginLeft: '1rem' }}>
        {existingEnrollmentPrograms == null ? (
          <h4>No programs are planned yet.Please modify IEP plan </h4>
        ) : (
            existingEnrollmentPrograms.map((p, index) => (
              <Grid>
                <Grid.Row key={p.program}>
                  <Label>
                    {data.results
                      ? data.results.find((q) => q.id == p.program).name
                      : p.program}
                  </Label>
                  <Label basic color={p['status'] == 'PLANNED' ? 'blue' : ''}>
                    Planned
                </Label>
                  <Label basic color={p['status'] == 'ENROLLED' ? 'blue' : ''}>
                    Enrolled
                </Label>
                  <Label basic color={p['status'] == 'COMPLETED' ? 'blue' : ''}>
                    Completed
                </Label>
                  <Button
                    color="green"
                    disabled={p['status'] == 'PLANNED' ? false : true}
                    onClick={(event) => BeginEnrollment(event, p)}
                  >
                    Begin Enrollment
                </Button>
                  <Button
                    color="green"
                    disabled={p['status'] == 'ENROLLED' ? false : true}
                    onClick={(event) =>
                      CompleteEnrollment(event, p, programsIndex)
                    }
                  >
                    Complete Enrollment
                </Button>
                </Grid.Row>
              </Grid>
            ))
          )}
      </div>
      {/* <h4>No programs are planned yet.Please modify IEP plan </h4> */}
      <Grid>
        <Grid.Row>
        <Button onClick={opensurveyforiep} style={{ marginLeft: '1rem' }} size="tiny">
            Assess Client
          </Button>
          <Button onClick={modifyiep} size="tiny"><Icon name="edit" />
            Modify IEP plan
          </Button>
          <Button
            onClick={confirmEndClicked}
            size="tiny"
            negative
          ><Icon name="close" />
            End IEP
          </Button>
        </Grid.Row>
      </Grid>

      <h2>NOTES</h2>
      <Button onClick={(event) => OpenNotes(event)} size="tiny"><Icon name="add" />
        Add Notes
      </Button>
      <PaginatedDataTable columns={notescolumns} table={notestable} />
      {isModidystate && (
        <Modal size="tiny" open={true}>
          <Modal.Header>Select program for this IEP</Modal.Header>
          <Modal.Content scrolling={true}>
            <CheckBoxIep
              handleChecks={(checks) => handleChecks(checks, 'programs')}
              setPreData={existingEnrollmentPrograms}
              client={initClient}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={modifyOkButtonClicked}
              primary
              style={{ marginTop: '1rem', marginLeft: '1rem' }}
            >
              Ok
            </Button>
            <Button
              style={{ marginLeft: '1rem' }}
              onClick={() => setIsModifyState(null)}
            >
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      )}
      {isBeginEnrollment && (
        <>
          <Modal size="tiny" open={isBeginEnrollment}>
            <Modal.Header>Enroll to Program</Modal.Header>
            <Modal.Content>
              <EnrollmentForm
                client={initClient}
                programsIndex={programsIndex}
                initP={initProgram}
                onSubmit={async (values) => {
                  //event.preventDefault();
                  const { program } = values;
                }}
              />
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={CloseEnrollment}>Cancel</Button>
            </Modal.Actions>
          </Modal>
        </>
      )}
      {isNotesModel && (
        <>
          <Modal size="large" open={isNotesModel}>
            <Modal.Header>Notes</Modal.Header>
            <Modal.Content>
              {/* <Header as="h4">Enroll to Program</Header> */}
              <NotesForm iepIndex={initIep} />
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => setIsNotesModelState(false)}>
                Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </>
      )}
      {modalSurveyDataOpen && !!modalSurveyData && (
        <Modal size="large" open={modalSurveyDataOpen}>
          <Modal.Header>Enrollment survey</Modal.Header>
          <Modal.Content>
            <EnrollmentSurveyModal
              client={initClient}
              programId={modalSurveyData.id}
              surveyId={modalSurveyData.enrollment_entry_survey.id}
              onResponseSubmit={async (newResponseData) => {
                const { program, start_date } = modalSurveyData;

                try {
                  const enrollmentResponse = await apiClient.patch(
                    `/programs/enrollments/${initProgram.id}/`,
                    {
                      client: initClient.id,
                      status: 'ENROLLED',
                      program: modalSurveyData.id,
                      start_date: moment(enrollmentStartDate).format(
                        'YYYY-MM-DD'
                      ),
                      projected_end_date: moment(enrollmentPendDate).format(
                        'YYYY-MM-DD')
                    }
                  );
                  const enrollment = enrollmentResponse.data;
                  //console.log(enrollmentResponse.data);
                  toaster.success('Enrolled to program');
                  // await apiClient.patch(`/iep/${initIep["id"]}/`,
                  // {
                  //   enrollments: {

                  //   },
                  // });

                  // console.log('xxxx', enrollment);
                  // console.log(enrollment, {
                  //   ...newResponseData,
                  //   response_context: {
                  //     id: enrollment.id,
                  //     type: 'Enrollment',
                  //   },
                  // });
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
                setModalSurveyDataOpen(false);
                CloseEnrollment();
              }}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setModalSurveyDataOpen(false)}>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      )}
      <Modal size="large" open={!!modalEndSurveyData}>
        <Modal.Header>Exit survey</Modal.Header>
        <Modal.Content>
          {modalEndSurveyData &&
            (modalEndSurveyData.enrollment_exit_survey == null
              ? ''
              : modalEndSurveyData.enrollment_exit_survey.id) && (
              <EnrollmentSurveyModal
                client={initClient}
                programId={modalEndSurveyData.id}
                surveyId={
                  modalEndSurveyData.enrollment_exit_survey == null
                    ? ''
                    : modalEndSurveyData.enrollment_exit_survey.id
                }
                onResponseSubmit={async (newResponseData) => {
                  const { program, end_date } = modalEndSurveyData;
                  //console.log(modalEndSurveyData.id);
                  try {
                    const enrollmentResponse = await apiClient.patch(
                      `/programs/enrollments/${initProgram.id}/`,
                      {
                        client: initClient.id,
                        status: 'COMPLETED',
                        program: modalEndSurveyData.id,
                        end_date: moment(new Date()).format('YYYY-MM-DD'),
                      }
                    );
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
                  setModalEndSurveyData(null);
                  CloseEnrollment();
                }}
              />
            )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalEndSurveyData(null)}>Cancel</Button>
        </Modal.Actions>
      </Modal>
      {isSurveyModel && (
        <>
          <Modal
            size="large"
            open={isSurveyModel}
            closeIcon
            onClose={() => setIsSurveyModelState(false)}
          >
            <Modal.Header>IEP Assessment(s)</Modal.Header>
            <Modal.Content>
              <Grid
                style={{
                  background: '#fff',
                  margin: 0,
                  padding: 0,
                }}
              >
                <Grid.Column computer={16} mobile={16}>
                  <Dropdown
                    placeholder='Select Assessment'
                    compact
                    search
                    selection
                    options={optionSurveys}
                    onChange={showResponses}
                  />
                  <>
                    {hasPermission(user, 'survey.add_response') && (
                      <Button
                        onClick={SelectSurvey}
                        disabled={!iepSurveyId}>
                        New Assessment
                      </Button>
                    )}
                  </>
                </Grid.Column>
              </Grid>
              <IepResponses
                iepId={initIep.id}
                surveyId={iepSurveyId}>
              </IepResponses>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => setIsSurveyModelState(false)}>Cancel</Button>
            </Modal.Actions>
          </Modal>
        </>
      )}
      {showIepSurveyResponses && (
        <>
          <Modal
            size="large"
            open={showIepSurveyResponses}
            closeIcon
            onClose={opensurveyforiep}
          >
            <Modal.Header>IEP Assessment</Modal.Header>
            <Modal.Content>

              <IepSurveyModal
                client={initClient}
                surveyId={surveyId}
                onResponseSubmit={async (newResponseData) => {
                  try {
                    await apiClient.post('/responses/', {
                      ...newResponseData,
                      response_context: {
                        id: initIep['id'],
                        type: 'ClientIEP',
                      },
                    });
                    toaster.success('Entry response saved');
                  } catch (err) {
                    const apiError = formatApiError(err.response);
                    toaster.error(apiError);
                  }
                  opensurveyforiep();
                }}
              />

            </Modal.Content>
            <Modal.Actions>
              <Button onClick={opensurveyforiep}>Cancel</Button>
            </Modal.Actions>
          </Modal>
        </>
      )}
    </>
  );
};
