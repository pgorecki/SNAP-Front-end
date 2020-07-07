import React, { useEffect, useState } from 'react';
import { Button, Header, Form, Grid, Modal } from 'semantic-ui-react';
import { Formik } from 'formik';
import SurveyWarnings from 'components/SurveyWarnings';
import Survey from 'pages/surveys/Survey';
import ControlledTable from 'components/ControlledTable';
import { ErrorMessage } from 'components/common';
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

function EnrollmentForm({ programsIndex, onSubmit }) {
  const { data, ready, error } = programsIndex;
  const [initialValues, setInitialValues] = useState({
    surveyId: null,
    program: null,
    start_date: new Date(),
  });

  const options = data
    ? data.map(({ program }) => ({
        value: program.id,
        text: program.name,
      }))
    : [];

  useEffect(() => {
    if (data && data.length > 0 && initialValues.program === null) {
      setInitialValues({ ...initialValues, program: data[0].program.id });
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
                program: data.find((pac) => pac.program.id === values.program)
                  .program,
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
            const selectedPac =
              data &&
              data.find((pac) => pac.program.id === form.values.program);

            let intakeSurvey = null;
            if (selectedPac) {
              intakeSurvey =
                selectedPac.enrollment_entry_survey ||
                selectedPac.program.enrollment_entry_survey;
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
                {intakeSurvey && (
                  <Button
                    primary
                    type="submit"
                    disabled={form.isSubmitting}
                    onClick={() => {
                      form.setFieldValue('surveyId', intakeSurvey.id);
                    }}
                  >
                    Enroll with {intakeSurvey.name}
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={form.isSubmitting}
                  onClick={() => {
                    form.setFieldValue('surveyId', null);
                  }}
                >
                  Enroll
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Grid.Column>
    </Grid>
  );
}

export default function EnrollmentsTab({ client }) {
  const history = useHistory();
  const [modalSurveyData, setModalSurveyData] = useState();
  const apiClient = useApiClient();
  const table = usePaginatedDataTable({
    url: `/programs/enrollments/?client=${client.id}`,
  });

  const programsIndex = useResourceIndex(
    `/programs/agency_configs/?ordering=program__name`
  );

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
          return <Button disabled>Details</Button>;
          // const { enrollment } = row.original;
          // const {
          //   enrollment_entry_survey: entrySurvey,
          //   enrollment_update_survey: updateSurvey,
          //   enrollment_exit_survey: exitSurvey,
          // } = row.original.pac;
          // console.log(entrySurvey, updateSurvey, exitSurvey);
          // const entryButton = entrySurvey ? (
          //   <Button
          //     color="green"
          //     onClick={() =>
          //       alert('Enrollment surveys not yet implemented. Skipping.') ||
          //       handleSetEnrollmentStatus(row, 'ENROLLED')
          //     }
          //   >
          //     Entry survey
          //   </Button>
          // ) : (
          //   <Button
          //     color="green"
          //     onClick={() => handleSetEnrollmentStatus(row, 'ENROLLED')}
          //   >
          //     Enter
          //   </Button>
          // );
          // const updateButton = updateSurvey ? (
          //   <Button
          //     color="green"
          //     onClick={() =>
          //       alert('Enrollment surveys not yet implemented. Skipping.') ||
          //       handleSetEnrollmentStatus(row, 'ENROLLED')
          //     }
          //   >
          //     Update survey
          //   </Button>
          // ) : null;
          // const exitButton = exitSurvey ? (
          //   <Button
          //     color="yellow"
          //     onClick={() =>
          //       alert('Enrollment surveys not yet implemented. Skipping.') ||
          //       handleSetEnrollmentStatus(row, 'EXITED')
          //     }
          //   >
          //     Exit survey
          //   </Button>
          // ) : (
          //   <Button
          //     color="yellow"
          //     onClick={() => handleSetEnrollmentStatus(row, 'EXITED')}
          //   >
          //     Exit
          //   </Button>
          // );
          // if (!enrollment) {
          //   // return entryButton;
          // }
          // switch (enrollment.status) {
          //   case 'AWAITING_ENTRY':
          //   // return entryButton;
          //   case 'ENROLLED':
          //     return <>{/* {updateButton}
          //         {exitButton} */}</>;
          //   default:
          //     return null;
          // }
        },
      },
    ],
    []
  );

  return (
    <>
      <Header as="h4">Enroll to Program</Header>
      <EnrollmentForm
        client={client}
        programsIndex={programsIndex}
        onSubmit={async (values) => {
          const { surveyId, program, start_date } = values;
          console.log('onSubmit', values);
          const result = await apiClient.get(
            `/programs/enrollments/?client=${client.id}&program=${program.id}`
          );
          // if (result.data.count > 0) {
          //   throw new FieldError(
          //     'program',
          //     `Client already enrolled to ${program.name}`
          //   );
          // }
          if (!!surveyId) {
            setModalSurveyData(values);
          } else {
            await apiClient.post('/programs/enrollments/', {
              client: client.id,
              status: 'ENROLLED',
              program: program.id,
              start_date,
            });
            toaster.success('Enrolled to program');
            table.reload();
          }
        }}
      />

      <Header as="h4">History</Header>
      <PaginatedDataTable columns={columns} table={table} />

      <Modal size="large" open={!!modalSurveyData}>
        <Modal.Header>Enrollment survey</Modal.Header>
        <Modal.Content>
          {modalSurveyData && modalSurveyData.surveyId && (
            <EnrollmentSurveyModal
              client={client}
              surveyId={modalSurveyData.surveyId}
              onResponseSubmit={async (newResponse) => {
                console.log('done!', modalSurveyData, newResponse);
                const { program, start_date } = modalSurveyData;
                await apiClient.post('/programs/enrollments/', {
                  client: client.id,
                  status: 'ENROLLED',
                  program: program.id,
                  start_date,
                  response: newResponse.id,
                });
                toaster.success('Enrolled to program');
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
