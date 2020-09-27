import React, { useEffect, useState, useContext } from 'react';
import {
  Button,
  Grid,
  Checkbox,
  Label,
  Modal,
  Header,
  Form,
  Dropdown
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
  FormTextArea
} from 'components/FormFields';
import { formatDateTime, FieldError, formatDate } from 'utils/typeUtils';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import useApiClient from 'hooks/useApiClient';
import useNewResource from 'hooks/useNewResource';
import SurveyList from '../surveys/SurveyList';
import PaginatedDataTable from 'components/PaginatedDataTable';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import { CheckBoxIep } from '../../components/CheckBoxIep';
import moment from 'moment';
import useFetchData from 'hooks/useFetchData';
import { formatOwner } from 'utils/modelUtils';
import IepResponses from '../clients/IepResponses';
import { NavLink, useHistory } from 'react-router-dom';
import { ErrorMessage } from 'components/common';

export const PlanningStep = (props) => {
  const [data, error, loading] = useFetchData(`/programs/`, {});
  const [isModidystate, setIsModifyState] = useState(false);
  const [checkPrograms, setCheckedPrograms] = useState(null);
  const [isSurveyModel, setIsSurveyModelState] = useState(false);
  const [isBeginEnrollment, setIsBeginEnrollmentState] = useState(false);
  const [isNotesModel, setIsNotesModelState] = useState(false);
  const [listInitialPrograms, setListInitialPrograms] = useState(
    props.listPrograms
  );
  const [initProgram, setInitialProgram] = useState(null);
  const [initClient, setClientState] = useState(props.client.client);
  const [initIep, setIepState] = useState(props.client);
  const [modalSurveyData, setModalSurveyData] = useState();
  const [surveyId, setSurveyId] = useState();
  // const [surveyIep, setsurveyIep] = useState(false);
  const [{ user }] = useContext(AppContext);
  const programsIndex = useResourceIndex(`/programs/?ordering=name`);
  const apiClient = useApiClient();
  const { save } = useNewResource('/notes/', {});
  const [
    existingEnrollmentPrograms,
    setExistingEnrollmentPrograms,
  ] = useState();
  const [showIepSurveyResponses, setShowIepSurveyResponses] = useState(false);
  const [iepSurveyId, setIepSurveyId] = useState();
  const exitingP = SavedPrograms();
  const notestable = usePaginatedDataTable({
    url: `/notes/?source_id=${initIep.id}`,
  });

  const [SurveyData, ready] = useFetchData(`/surveys/`, {});
  //console.log(SurveyData);
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

  async function SavedPrograms() {
    if (typeof existingEnrollmentPrograms === 'undefined') {
      const clientIEP = await apiClient.get(
        `/iep/${initIep["id"]}`
      );
      const existingEnrolmments = clientIEP.data.enrollments;
      if (typeof existingEnrolmments !== 'undefined') {
        setExistingEnrollmentPrograms(existingEnrolmments);
        //console.log(existingEnrollmentPrograms);
      }
    }
  }

  // const columns = React.useMemo(
  //   () => [
  //     {
  //       Header: 'Name',
  //       accessor: 'name',
  //       Cell: ({ value }) => <Label>{value}</Label>,
  //     },
  //     {
  //       Header: 'Actions',
  //       accessor: 'actions',
  //       Cell: ({ row, actions }) => (
  //         <>
  //           <Button onClick={() => SelectSurvey(row.original.id)}>
  //             Select
  //           </Button>
  //         </>
  //       ),
  //     },
  //   ],
  //   []
  // );

  function OpenNotes(event) {
    event.preventDefault();
    setIsNotesModelState(true);
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
              });
              //history.push(`/notes/${result.id}`);
              toaster.success('Notes created');
            } catch (err) {
              actions.setErrors(apiErrorToFormError(err));
            }
            actions.setSubmitting(false);
            setIsNotesModelState(false);
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

  function opensurveyforiep() {
    setIsSurveyModelState(true);
    setSurveyId(null);
    setShowIepSurveyResponses(false);
  }

  function SelectSurvey() {
    setShowIepSurveyResponses(true);
    setIsSurveyModelState(false);
  }

  const modifyiep = () => {
    setIsModifyState(true);
  };

  const handleChecks = (checks, category) => {
    setCheckedPrograms(checks);
    //console.log(checks)
  };

  function confirmEndClicked() {
    props.confirmEndIEPClicked();
  }

  async function modifyOkButtonClicked() {
    let updatedEnrollments = [];
    let newEnrollments = [];
    const clientIEP = await apiClient.get(
      `/iep/${initIep["id"]}`
    );
    const existingEnrolmments = clientIEP.data.enrollments;
    checkPrograms.forEach(async (element) => {
      if (existingEnrolmments.findIndex(x => x.program == element.id) == -1) {
        //updatedEnrollments = [...updatedEnrollments, ]
        newEnrollments = {
          program: element.id,
          status: "PLANNED"
        }
        updatedEnrollments = [...updatedEnrollments, newEnrollments]
      }
    });
    updatedEnrollments = [...existingEnrolmments, ...updatedEnrollments]
    await apiClient.patch(`/iep/${initIep["id"]}/`,
      {
        enrollments: updatedEnrollments
      });
    props.modifyOkButtonClicked(updatedEnrollments);
    setIsModifyState(null);
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
        accessor: 'created_at',
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
        {existingEnrollmentPrograms == null || (typeof existingEnrollmentPrograms == 'undefined') || existingEnrollmentPrograms.length == 0 ? (
          <h4>No programs are planned yet.Please modify IEP plan </h4>
        ) : (
            existingEnrollmentPrograms.map((p, index) => (
              <Grid>
                <Grid.Row key={p.program}>
                  <Label>{data.results.find(q => q.id == p.program).name}</Label>
                  <Label basic color={p['status'] == 'PLANNED' ? 'blue' : ''}>
                    Planned
                </Label>
                  <Label basic color={p['status'] == 'ENROLLED' ? 'blue' : ''}>
                    Enrolled
                </Label>
                  <Label basic color={p['status'] == 'COMPLETED' ? 'blue' : ''}>
                    Completed
                </Label>
                </Grid.Row>
              </Grid>
            ))
          )}
      </div>
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
      <Button onClick={(event) => OpenNotes(event)} >
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
