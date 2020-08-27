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

var enrollmentid = '';

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
  const [isOpened, setIsOpened] = useState(false);
  const apiClient = useApiClient();
  const [urlParams, queryParams, fragment] = useUrlParams();
  const clientFullName = 'Test';
  const table = usePaginatedDataTable({
    url: `/programs/enrollments/?client=${client.id}`,
  });

  const programsIndex = useResourceIndex(`/programs/?ordering=name`);

  function toggle(enrolid) {
    console.log(enrolid);
    setIsOpened((wasOpened) => !wasOpened);
    enrollmentid = enrolid;
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'Program',
        accessor: 'program.name',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => value || 'n/a',
      },
      {
        Header: 'Date Created',
        accessor: 'created_at',
        Cell: ({ value }) => (value ? formatDateTime(value, true) : ''),
      },
      {
        Header: 'Date Modified',
        accessor: 'modified_at',
        Cell: ({ value }) => (value ? formatDateTime(value, true) : ''),
      },
      {
        Header: 'Created By',
        accessor: 'created_by',
        Cell: ({ value }) => (value ? formatDateTime(value, true) : ''),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ value, row }) => {
          return (
            <>
              <Button onClick={() => toggle(row.original.id)}>Edit</Button>
              <Button disabled>Details</Button>
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
        <EnrollmentDetails
          title={clientFullName}
          enrollmentid={enrollmentid}

          //loading={loading}
          //error={formatApiError(error)}
        ></EnrollmentDetails>
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
                      start_date,
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
    </>
  );
}
