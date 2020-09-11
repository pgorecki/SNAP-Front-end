import React, { useEffect, useState, useContext } from 'react';
import { Button, Grid, Checkbox, Label, Modal, Header, Form } from 'semantic-ui-react';
import { handleChecks, PlanningStep } from './PlanningStep';
import { hasPermission } from 'utils/permissions';
import toaster from 'components/toaster';
import EnrollmentSurveyModal from 'modals/EnrollmentSurveyModal';
import useResourceIndex from 'hooks/useResourceIndex';
import { AppContext } from 'AppStore';
import { Formik } from 'formik';
import { FormSelect, FormDatePicker, FormErrors } from 'components/FormFields';
import { formatDateTime, FieldError } from 'utils/typeUtils';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import useApiClient from 'hooks/useApiClient';

export const InProgressStep = (props) => {
  console.log(props);
  const [isModidystate, setIsModifyState] = useState(false)
  const [isSurveyModel, setIsSurveyModelState] = useState(false)
  const [isBeginEnrollment, setIsBeginEnrollmentState] = useState(false)
  const [listInitialPrograms, setListInitialPrograms] = useState(props.listPrograms);
  const [initProgram, setInitialProgram] = useState(null);
  const [initClient, setClientState] = useState(props.client.client);
  const [modalSurveyData, setModalSurveyData] = useState();
  const [{ user }] = useContext(AppContext);
  const programsIndex = useResourceIndex(`/programs/?ordering=name`);
  const apiClient = useApiClient();

  const modifyiep = () => {
    setIsModifyState(true);
  }

  function opensurveyforiep() {
    setIsSurveyModelState(true);
  }

  function BeginEnrollment(programId) {
    setInitialProgram(programId);
    setIsBeginEnrollmentState(true);
  }

  function CloseEnrollment() {
    setIsBeginEnrollmentState(false);
    setModalSurveyData(null);
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

  return (
    <>
      <div style={{ marginLeft: "1rem" }}>
        {listInitialPrograms == null ? <h4>No programs are planned yet.Please modify IEP plan </h4> : listInitialPrograms.map((p, index) => (
          <Grid>
            <Grid.Row key={p["id"]}>
              <Label>{p["name"]}</Label>
              <Label basic color="blue" >Planned</Label>
              <Label basic>Enrolled</Label>
              <Label basic>Completed</Label>
              <Button color="green" onClick={() => BeginEnrollment(p["id"])}>Begin Enrollment</Button>
            </Grid.Row>
          </Grid>
        ))}
      </div>
      {/* <h4>No programs are planned yet.Please modify IEP plan </h4> */}
      <Grid>
        <Grid.Row>
          <Button onClick={opensurveyforiep} style={{ marginLeft: "1rem" }}>Assess Client</Button>
          <Button onClick={modifyiep} button >
            Modify IEP plan
                </Button>
          <Button color="red" style={{ marginLeft: "1rem" }}>End IEP</Button>
        </Grid.Row>
      </Grid>

      <h2>NOTES</h2>
      <Button style={{ marginLeft: "1rem" }}>Add Notes</Button>
      {hasPermission(user, 'program.add_enrollment') && isBeginEnrollment && (
        <>
          <Modal size="large" open={isBeginEnrollment}>
            <Modal.Header>Enroll to Program</Modal.Header>
            <Modal.Content>
              {/* <Header as="h4">Enroll to Program</Header> */}
              <EnrollmentForm
                client={initClient}
                programsIndex={programsIndex}
                initP={initProgram}
                onSubmit={async (values) => {
                  console.log(initClient)
                  const { program } = values;
                  const result = await apiClient.get(
                    `/programs/enrollments/?client=${initClient.id}&program=${program.id}`
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
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={CloseEnrollment}>Cancel</Button>
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
                debugger;
                var sd = start_date.getFullYear() + '-' + ("0" + (start_date.getMonth() + 1)).slice(-2) + '-' + ("0" + start_date.getDate()).slice(-2);
                try {
                  const enrollmentResponse = await apiClient.post(
                    '/programs/enrollments/',
                    {
                      client: initClient.id,
                      status: 'ENROLLED',
                      program: program.id,
                      sd,
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
                //table.reload();
              }}
            />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalSurveyData(null)}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}