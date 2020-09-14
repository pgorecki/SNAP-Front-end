import React, { useEffect, useState, useContext } from 'react';
import {
  Button,
  Grid,
  Checkbox,
  Label,
  Modal,
  Header,
  Form,
  FormTextArea,
} from 'semantic-ui-react';
import { handleChecks, PlanningStep } from './PlanningStep';
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
} from 'components/FormFields';
import { formatDateTime, FieldError } from 'utils/typeUtils';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import useApiClient from 'hooks/useApiClient';
import useNewResource from 'hooks/useNewResource';
import SurveyList from '../surveys/SurveyList';
import PaginatedDataTable from 'components/PaginatedDataTable';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import { CheckBoxIep } from '../../components/CheckBoxIep';
import moment from 'moment';

export const InProgressStep = (props) => {
  console.log(props);
  const [checkPrograms, setCheckedPrograms] = useState(null);
  const [isModidystate, setIsModifyState] = useState(false);
  const [isSurveyModel, setIsSurveyModelState] = useState(false);
  const [isBeginEnrollment, setIsBeginEnrollmentState] = useState(false);
  const [isNotesModel, setIsNotesModelState] = useState(false);
  const [listInitialPrograms, setListInitialPrograms] = useState(
    props.listPrograms
  );
  const [initProgram, setInitialProgram] = useState(null);
  const [initSurveyProgram, setInitialSurveyProgram] = useState(null);
  const [initClient, setClientState] = useState(props.client.client);
  const [initIep, setIepState] = useState(props.client);
  const [modalSurveyData, setModalSurveyData] = useState();
  const [surveyId, setSurveyId] = useState();
  // const [surveyIep, setsurveyIep] = useState(false);
  const [{ user }] = useContext(AppContext);
  const programsIndex = useResourceIndex(`/programs/?ordering=name`);
  const apiClient = useApiClient();
  const { save } = useNewResource('/notes/', {});
  const table = usePaginatedDataTable({ url: '/surveys/' });
  const [
    existingEnrollmentPrograms,
    setExistingEnrollmentPrograms,
  ] = useState();
  const exitingP = SavedPrograms();

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value }) => <Label>{value}</Label>,
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row, actions }) => (
          <>
            <Button onClick={() => SelectSurvey(row.original.id)}>
              Select
            </Button>
          </>
        ),
      },
    ],
    []
  );

  const modifyiep = () => {
    setIsModifyState(true);
    //setCheckedPrograms(listInitialPrograms);
  };

  function confirmEndClicked() {
    props.confirmEndIEPClicked();
  }

  async function SavedPrograms() {
    console.log(existingEnrollmentPrograms);
    if (typeof existingEnrollmentPrograms === 'undefined') {
      const resultPrograms = await apiClient.get(
        `/programs/enrollments/?client=${initClient.id}`
      );
      if (resultPrograms.data.count > 0) {
        setExistingEnrollmentPrograms(resultPrograms.data.results);
        console.log(existingEnrollmentPrograms);
      }
    }
  }

  async function modifyOkButtonClicked() {
    checkPrograms.forEach(async (element) => {
      const result = await apiClient.get(
        `/programs/enrollments/?client=${initClient.id}&program=${element.id}`
      );
      if (result.data.count > 0) {
      } else {
        try {
          const enrollmentResponse = await apiClient.post(
            '/programs/enrollments/',
            {
              client: initClient.id,
              status: 'PLANNED',
              program: element.id,
              start_date: moment(new Date()).format('YYYY-MM-DD'),
            }
          );
        } catch (err) {
          const apiError = formatApiError(err.response);
          toaster.error(apiError);
        } finally {
          const resultPrograms = await apiClient.get(
            `/programs/enrollments/?client=${initClient.id}`
          );
          if (resultPrograms.data.count > 0) {
            setExistingEnrollmentPrograms(resultPrograms.data.results);
            console.log(existingEnrollmentPrograms);
          }
        }
      }
    });
    //props.modifyOkButtonClicked(checkPrograms);
    setIsModifyState(null);
  }

  const handleChecks = (checks, category) => {
    setCheckedPrograms(checks);
    //console.log(checks)
  };

  function setPreData() {
    setCheckedPrograms(listInitialPrograms);
  }

  function opensurveyforiep() {
    setIsSurveyModelState(true);
  }

  function SelectSurvey(id) {
    setSurveyId(id);
  }

  function BeginEnrollment(event, programId) {
    event.preventDefault();
    setInitialProgram(programId);
    setIsBeginEnrollmentState(true);
  }

  async function CloseEnrollment() {
    setIsBeginEnrollmentState(false);
    setModalSurveyData(null);
    const resultPrograms = await apiClient.get(
      `/programs/enrollments/?client=${initClient.id}`
    );
    if (resultPrograms.data.count > 0) {
      setExistingEnrollmentPrograms(resultPrograms.data.results);
      console.log(existingEnrollmentPrograms);
    }
  }

  function CloseNotes() {
    setIsNotesModelState(false);
    //setModalSurveyData(null);
  }

  function OpenNotes() {
    setIsNotesModelState(true);
  }

  function EnrollmentForm({ programsIndex, onSubmit, initP }) {
    //console.log(initP)
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
        setInitialValues({ ...initialValues, program: initP });
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
                text: values.subject,
              });
              //history.push(`/notes/${result.id}`);
              toaster.success('Notes created');
            } catch (err) {
              actions.setErrors(apiErrorToFormError(err));
            }
            actions.setSubmitting(false);
            setIsNotesModelState(false);
            //table.reload();
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
                    name="note"
                    placeholder="Enter note here"
                    form={form}
                    rows="5"
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

  return (
    <>
      <div style={{ marginLeft: '1rem' }}>
        {existingEnrollmentPrograms == null ? (
          <h4>No programs are planned yet.Please modify IEP plan </h4>
        ) : (
          existingEnrollmentPrograms.map((p, index) => (
            <Grid>
              <Grid.Row key={p.program['id']}>
                <Label>{p.program['name']}</Label>
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
              </Grid.Row>
            </Grid>
          ))
        )}
      </div>
      {/* <h4>No programs are planned yet.Please modify IEP plan </h4> */}
      <Grid>
        <Grid.Row>
          <Button onClick={opensurveyforiep} style={{ marginLeft: '1rem' }}>
            Assess Client
          </Button>
          <Button onClick={modifyiep} button>
            Modify IEP plan
          </Button>
          <Button
            onClick={confirmEndClicked}
            color="red"
            style={{ marginLeft: '1rem' }}
          >
            End IEP
          </Button>
        </Grid.Row>
      </Grid>

      <h2>NOTES</h2>
      <Button onClick={OpenNotes} style={{ marginLeft: '1rem' }}>
        Add Notes
      </Button>
      {isModidystate && (
        <Modal size="tiny" open={true}>
          <Modal.Header>Select program for this IEP</Modal.Header>
          <Modal.Content scrolling={true}>
            <CheckBoxIep
              handleChecks={(checks) => handleChecks(checks, 'programs')}
              setPreData={listInitialPrograms}
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
              {/* <Header as="h4">Enroll to Program</Header> */}
              <EnrollmentForm
                client={initClient}
                programsIndex={programsIndex}
                initP={initProgram.program['id']}
                onSubmit={async (values) => {
                  console.log(initClient);
                  console.log(initProgram);
                  const { program } = values;
                  // const result = await apiClient.get(
                  //   `/programs/enrollments/?client=${initClient.id}&program=${program.id}'`
                  // );
                  if (initProgram['status'] === 'ENROLLED') {
                    throw new FieldError(
                      'program',
                      `Client already enrolled to ${program.name}`
                    );
                  }

                  // open the survey modal
                  setModalSurveyData(values);
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
      <Modal size="large" open={!!modalSurveyData}>
        <Modal.Header>Enrollment survey</Modal.Header>
        <Modal.Content>
          {modalSurveyData && modalSurveyData.surveyId && (
            <EnrollmentSurveyModal
              client={initClient}
              programId={modalSurveyData.program.id}
              surveyId={modalSurveyData.surveyId}
              onResponseSubmit={async (newResponseData) => {
                const { program, start_date } = modalSurveyData;
                //debugger;
                var sd =
                  start_date.getFullYear() +
                  '-' +
                  ('0' + (start_date.getMonth() + 1)).slice(-2) +
                  '-' +
                  ('0' + start_date.getDate()).slice(-2);
                try {
                  const enrollmentResponse = await apiClient.put(
                    `/programs/enrollments/${initProgram.id}/`,
                    {
                      client: initClient.id,
                      status: 'ENROLLED',
                      program: program.id,
                      start_date: moment(new Date()).format('YYYY-MM-DD'),
                    }
                  );
                  const enrollment = enrollmentResponse.data;
                  console.log(enrollmentResponse.data);
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
                setIsBeginEnrollmentState(true);
                console.log(props);
                //props.reloadOrientation();
                //SavedPrograms();
                //props.confirmEndIEPClicked()
                //table.reload();
              }}
            />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalSurveyData(null)}>Cancel</Button>
        </Modal.Actions>
      </Modal>
      <Modal
        size="large"
        open={isSurveyModel}
        closeIcon
        onClose={() => setIsSurveyModelState(false)}
      >
        <Modal.Header>IEP Survey(s)</Modal.Header>
        <Modal.Content>
          <PaginatedDataTable columns={columns} table={table} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsSurveyModelState(false)}>Cancel</Button>
        </Modal.Actions>
      </Modal>
      <Modal
        size="large"
        open={!!surveyId}
        closeIcon
        onClose={() => setSurveyId()}
      >
        <Modal.Header>IEP survey</Modal.Header>
        <Modal.Content>
          {surveyId && (
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
                setSurveyId(null);
              }}
            />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setSurveyId(null)}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};
