import React, { useEffect, useState } from 'react';
import { Button, Header, Form, Grid, Modal, Tab, Loader, Message } from 'semantic-ui-react';
import { Formik } from 'formik';
import useApiClient from 'hooks/useApiClient';
import useResourceIndex from 'hooks/useResourceIndex';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import PaginatedDataTable from 'components/PaginatedDataTable';
import { NavLink, useHistory } from 'react-router-dom';
import useResource from 'hooks/useResource';
import useUrlParams from 'hooks/useUrlParams';
import { formatDateTime, FieldError } from 'utils/typeUtils';
import toaster from 'components/toaster';
import EnrollmentSurveyModal from 'modals/EnrollmentSurveyModal';
import useFetchData from 'hooks/useFetchData';
import { FormSelect, FormDatePicker, FormErrors, FormInput } from 'components/FormFields';

export function showPasswordPage() {
    const showEdit = true;
}

export default function SummaryTab({ enrolldata }) {
    console.log(enrolldata);
    const history = useHistory();
    const [modalSurveyData, setModalSurveyData, showEdit = false] = useState();
    const apiClient = useApiClient();
    const [urlParams, queryParams, fragment] = useUrlParams();
    const [data, error, loading] = useFetchData(`/programs/enrollments/${enrolldata.id}`, {});
    const programsIndex = useResourceIndex(`/programs/?ordering=name`);
    function EnrollmentForm({ programsIndex, onSubmit }) {
        const { data, ready, error } = programsIndex;
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
                                        options={options}
                                        placeholder="Select program"
                                    />
                                    <FormDatePicker
                                        label="Start Date"
                                        name="start_date"
                                        form={form}
                                    />
                                    <FormDatePicker
                                        label="Projected End Date"
                                        name="projected_end_date"
                                        form={form}
                                    />
                                    <FormDatePicker
                                        label="Actual End Date"
                                        name="actual_end_date"
                                        form={form}
                                    />
                                    <FormInput
                                        label="Status"
                                        name="status"
                                        form={form}
                                    />
                                    <FormErrors form={form} />
                                    {/* <Button
                                        primary
                                        type="submit"
                                        disabled={!intakeSurvey || form.isSubmitting}
                                        onClick={() => {
                                            form.setFieldValue('surveyId', intakeSurvey.id);
                                        }}
                                    >
                                        Save
                      </Button> */}
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
            {/* <Header as="h4">Enroll to Program</Header> */}
            <EnrollmentForm
                client={enrolldata.client}
                programsIndex={programsIndex}
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
        </>
    );
}