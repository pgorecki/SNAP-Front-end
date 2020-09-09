import React, { useEffect, useState, useContext } from 'react';
import { Button, Header, Form, Grid, Modal, Tab, Loader, Message, FormTextArea, FormCheckbox } from 'semantic-ui-react';
import { Formik } from 'formik';
import useApiClient from 'hooks/useApiClient';
import { AppContext } from 'AppStore';
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
import { FormSelect, FormDatePicker, FormErrors, FormInput } from 'components/FormFields';
import { EditActionLink, DeleteActionButton } from '../../components/tableComponents';
import ListPage from '../ListPage';
import { formatOwner } from '../../utils/modelUtils';
import { hasPermission } from 'utils/permissions';

function UpdateSurveyForm({ programsIndex, onSubmit, enrdata }){
  const { data, ready } = programsIndex;
console.log(enrdata);
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
console.log(selectedProgram);
            let intakeSurvey = null;
            if (selectedProgram) {
              intakeSurvey = selectedProgram.enrollment_update_survey;
              
            }

            return (
              <Form error onSubmit={form.handleSubmit}>
                <FormErrors form={form} />
                <Button
                  primary
                  type="submit"
                  disabled={form.isSubmitting}
                  onClick={() => {
                    form.setFieldValue('surveyId', intakeSurvey.id);
                  }}
                >
                  New Update
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Grid.Column>
    </Grid>
  );
}


export default function AssessmentsTab({ enrolldata }) {
    console.log(enrolldata);
    const history = useHistory();
    const apiClient = useApiClient();
    const [{ user }] = useContext(AppContext);
    const programsIndex = useResourceIndex(`/programs/?ordering=name`);
    const [urlParams, queryParams, hash] = useUrlParams();
    const table = usePaginatedDataTable({
        url: `/responses/?context=${enrolldata.id}`
      });
          
    const [modalSurveyData, setModalSurveyData] = useState();
    const { save } = useNewResource('/responses/', {});
    const { data, ready, error } = programsIndex;
    //Modal related
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [modalData, setModaData] = useState({});
    const [initialValues, setInitialValues] = useState({
        client:enrolldata.client.id
        ,survey:enrolldata.program.enrollment_entry_survey.id
        ,response_context: {id: enrolldata.id, type: 'Enrollment'}
        ,answers:[
                {
                    question:'3ab2f933-899c-4229-9c98-ce17e002633f'
                    , value:'TestAns'
                }
            ]
    }            
    );
    
    const options = data
            ? data.map(({ id, name }) => ({
                value: id,
                text: name,
            }))
            : [];
    const cncolumns = React.useMemo(
        () => [
          {
            Header: 'Update Type',
            accessor: 'sourceobject.type',
            Cell: ({ value, row }) => (
                <NavLink to={`/responses/${row.original.id}`}>{value}</NavLink>
            ),
          },
          {
            Header: 'Date',
            accessor: 'modified_at',
            Cell: ({ value }) => (value ? formatDate(value, true) : ''),
          },
          {
            Header: 'User Updating',
            accessor: 'created_by',
            Cell: ({ value }) => formatOwner(value),
          },
          {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }) => (
              <>
                <EditActionLink disabled={enrolldata.status=='COMPLETED'} to={`/responses/${row.original.id}/edit`} />
                <DeleteActionButton disabled={enrolldata.status=='COMPLETED'}
                  onClick={() => setModaData({ ...row.original })} />
              </>
            ),
          },
        ],
        []
      ); 

      return (
        <>          
        {hasPermission(user, 'program.add_enrollment') && (
        <UpdateSurveyForm
          client={enrolldata.client}
          programsIndex={programsIndex}
          enrdata={enrolldata}
          onSubmit={async (values) => {
            const { program } = values;
            const result = await apiClient.get(
              `/programs/enrollments/?client=${enrolldata.client.id}&program=${program.id}`
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
        )}
        <PaginatedDataTable columns={cncolumns} table={table} />
            <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={async (values, actions) => {
                    try {
                      const result = await save({
                        ...initialValues,
                      });
                      //history.push(`/responses/${result.id}`);
                      toaster.success('Assessment created');
                    } catch (err) {
                      actions.setErrors(apiErrorToFormError(err));
                    }
                    actions.setSubmitting(false);
                    //handleClose();
                    table.reload();
                  }}
            >
                {(form) => {
                    if (!data) {
                        return null;
                    }
                    const selectedProgram =
                        data &&
                        data.find((program) => program.id === form.values.program);
                    
                    return (
                        <>                          
                          <Modal size="large" open={!!modalSurveyData}>
                            <Modal.Header>Enrollment survey</Modal.Header>
                            <Modal.Content>
                              {modalSurveyData && modalSurveyData.surveyId && (
                                <EnrollmentSurveyModal
                                  client={enrolldata.client}
                                  programId={modalSurveyData.program.id}
                                  surveyId={modalSurveyData.surveyId}
                                  onResponseSubmit={async (newResponseData) => {
                                    const { program, start_date } = modalSurveyData;
                                    debugger;
                                    var sd = start_date.getFullYear() + '-' + ("0" + (start_date.getMonth() + 1)).slice(-2) + '-' + ("0" + start_date.getDate()).slice(-2) ;
                                    try {                                    
                                      
                                      await apiClient.post('/responses/', {
                                        ...newResponseData,
                                        response_context: {
                                          id: enrolldata.id,
                                          type: 'Enrollment',
                                        },
                                      });
                                      toaster.success('Response saved');
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
                }}
            </Formik>
            <Modal closeIcon open={!!modalData.id} onClose={() => setModaData({})}>
            <Modal.Header>Are you sure?</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <p>
                  Are you sure you want to delete assessment{' '}
                  <strong>{modalData.name}</strong>?
                </p>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button
                negative
                onClick={async () => {
                  try {
                    await apiClient.delete(`/responses/${modalData.id}/`);
                    table.reload();
                  } catch (err) {
                    const apiError = formatApiError(err.response);
                    toaster.error(apiError);
                  } finally {
                    setModaData({});
                  }
                }}
              >
                Delete assessment
              </Button>
            </Modal.Actions>
          </Modal>
        </>
      );
}