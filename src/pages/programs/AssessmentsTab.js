import React, { useEffect, useState } from 'react';
import { Button, Header, Form, Grid, Modal, Tab, Loader, Message, FormTextArea, FormCheckbox } from 'semantic-ui-react';
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
import { FormSelect, FormDatePicker, FormErrors, FormInput } from 'components/FormFields';
import { EditActionLink, DeleteActionButton } from '../../components/tableComponents';
import ListPage from '../ListPage';
import { formatOwner } from '../../utils/modelUtils';


export default function AssessmentsTab({ enrolldata }) {
    console.log(enrolldata);
    const history = useHistory();
    const apiClient = useApiClient();
    const programsIndex = useResourceIndex(`/programs/?ordering=name`);
    const [urlParams, queryParams, hash] = useUrlParams();
    const table = usePaginatedDataTable({
        url: `/responses/?context=${enrolldata.id}`
      });
      console.log(table);
      const survey = useResource(
        enrolldata.client.id && `/surveys/${enrolldata.program.enrollment_entry_survey.id}/`,
        {}
      );
      console.log(survey);
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
    console.log(initialValues);
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
                <EditActionLink to={`/responses/${row.original.id}/edit`} />
                <DeleteActionButton
                  onClick={() => setModaData({ ...row.original })} />
              </>
            ),
          },
        ],
        []
      ); 

      return (
        <>    
          <Button primary onClick={handleShow}>
            New Update
        </Button>
          <PaginatedDataTable columns={cncolumns} table={table} />
          <Grid>
                <Grid.Column computer={8} mobile={16}>
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
                            handleClose();
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

                            let intakeSurvey = null;
                            if (selectedProgram) {
                                intakeSurvey = selectedProgram.enrollment_entry_survey;
                            }

                            return (
                                <>
                                <Modal open={show} onHide={handleClose}>
                                <Modal.Header>          
                                    New Assessment
                                </Modal.Header>
                                <Modal.Content>
                                    <Form error onSubmit={form.handleSubmit}>
                                        <FormInput label="Subject:" name="subject" form={form} />
                                        <FormDatePicker label="Date" name="date" form={form} />
                                        Client Receiving any income 
                                        <FormCheckbox label="Yes" /><FormCheckbox label="No" />
                                        Earned income 
                                        <FormCheckbox label="Yes" /><FormCheckbox label="No" />
                                        <FormInput label="Amount" name="eiamount" form={form} />
                                        TANF 
                                        <FormCheckbox label="Yes" /><FormCheckbox label="No" />
                                        <FormInput label="Amount" name="tanfamount" form={form} />
                                        SSI
                                        <FormCheckbox label="Yes" /><FormCheckbox label="No" />
                                        <div>
                                        Pension
                                        <FormCheckbox label="Yes" /><FormCheckbox label="No" />
                                        </div>
                                        <FormErrors form={form} />
                                        <Button  primary type="submit" disabled={form.isSubmitting}>
                                            Submit
                                        </Button>
                                        <Button onClick={handleClose}>Cancel</Button>
                                    </Form>                                    
                                </Modal.Content>
                                </Modal>
                                </>
                            );
                        }}
                    </Formik>
                </Grid.Column>
            </Grid>
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