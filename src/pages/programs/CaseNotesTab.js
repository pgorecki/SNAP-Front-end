import React, { useEffect, useState } from 'react';
import { Button, Header, Form, Grid, Modal, Tab, Loader, Message, FormTextArea } from 'semantic-ui-react';
import { Formik } from 'formik';
import useApiClient from 'hooks/useApiClient';
import useResourceIndex from 'hooks/useResourceIndex';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import PaginatedDataTable from 'components/PaginatedDataTable';
import { NavLink, useHistory } from 'react-router-dom';
import useResource from 'hooks/useResource';
import useUrlParams from 'hooks/useUrlParams';
import { formatDateTime, FieldError, formatDate } from 'utils/typeUtils';
import toaster from 'components/toaster';
import EnrollmentSurveyModal from 'modals/EnrollmentSurveyModal';
import useFetchData from 'hooks/useFetchData';
import { FormSelect, FormDatePicker, FormErrors, FormInput } from 'components/FormFields';
import { EditActionLink } from '../../components/tableComponents';

export function showPasswordPage() {
    const showEdit = true;
}

export default function CaseNotesTab({ enrolldata }) {
    console.log(enrolldata);
    const history = useHistory();
    const [modalSurveyData, setModalSurveyData, showEdit = false] = useState();
    const apiClient = useApiClient();
    const [urlParams, queryParams, fragment] = useUrlParams();
    const [data, error, loading] = useFetchData(`/programs/enrollments/${enrolldata.id}`, {});
    const programsIndex = useResourceIndex(`/programs/?ordering=name`);

    function EnrollmentForm({ programsIndex, onSubmit }) {
        const { data, ready, error } = programsIndex;
        //Modal related
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        const [initialValues, setInitialValues] = useState({
            surveyId: null,
            program: null,
            start_date: new Date(enrolldata.created_at),
            projected_end_date: new Date(),
            actual_end_date: null,
            status: enrolldata.status
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

        const cncolumns = React.useMemo(
            () => [
              {
                Header: 'Case Note Type',
                accessor: 'program.name',
              },
              {
                Header: 'Date',
                accessor: 'created_at',
                Cell: ({ value }) => (value ? formatDate(value, true) : ''),
              },
              {
                Header: 'User Creating',
                accessor: 'created_by',
                Cell: ({ value }) => (value ? formatDateTime(value, true) : ''),
              },
              {
                Header: 'Action',
                accessor: 'actions',
                Cell: ({ value, row }) => {
                  return <>
                  
                  <Button disabled>Delete</Button>
                </>;
                },
              },
            ],
            []
          );        

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
                                <>
                                <Button primary onClick={handleShow}>
                                    New Case Note
                                </Button>

                                <Modal open={show} onHide={handleClose}>
                                <Modal.Header>          
                                    New Case Note
                                </Modal.Header>
                                <Modal.Content>
                                    <Form error onSubmit={form.handleSubmit}>
                                        <FormInput label="Subject:" name="subject" form={form} />
                                        <FormSelect label="Select Template" name="template" form={form} options={options} placeholder="Select Template" />
                                        <FormDatePicker label="Date" name="date" form={form} />                                       
                                        <FormTextArea name="note" placeholder="Enter note here" form={form} rows="5" />
                                        <FormErrors form={form} />
                                        <Button primary type="submit" disabled={form.isSubmitting}>
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
        );
    }

    return (
        <>
            {/* <Header as="h4">Enroll to Program</Header> */}
            <EnrollmentForm
                client={enrolldata.client}
                programsIndex={programsIndex}
                onSubmit={async (values) => {
                    const { program } = values;
                    const result = await apiClient.post(
                        `/notes/${values.id}/`
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
    );
}