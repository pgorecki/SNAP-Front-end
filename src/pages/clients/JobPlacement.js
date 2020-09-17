import React, { useState } from 'react';
import { Formik } from 'formik';
import { Button, Segment, Form } from 'semantic-ui-react';
import toaster from 'components/toaster';
import useApiClient from 'hooks/useApiClient';
import { FormInput, FormDatePicker, FormErrors } from 'components/FormFields';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';

function JobPlacementForm({ iep }) {
  const apiClient = useApiClient();
  return (
    <Formik
      enableReinitialize
      initialValues={iep.job_placement || {}}
      onSubmit={async (values, actions) => {
        try {
          await apiClient.patch(`/iep/${iep.id}/`, { job_placement: values });
          toaster.success('Job placement updated');
        } catch (err) {
          actions.setErrors(apiErrorToFormError(err));
        }
        actions.setSubmitting(false);
      }}
    >
      {(form) => (
        <Form error onSubmit={form.handleSubmit}>
          <Segment>
            <FormInput label="Company" name="Company" form={form} />
            <FormDatePicker
              label="Effective Date"
              name="effective_date"
              form={form}
            />
            <FormDatePicker label="Hire date" name="hire_date" form={form} />
            <FormInput label="Weekly hours" name="weekly_hours" form={form} />
            <FormInput label="Hourly wage" name="hourly_wage" form={form} />
            <FormInput
              label="Total weekly income"
              name="total_weekly_income"
              form={form}
            />
            <FormInput
              label="Total monthly income"
              name="total_monthly_income"
              form={form}
            />
            <FormInput
              label="How was job placement verified"
              name="how_was_job_placement_verified"
              form={form}
            />
            <FormErrors form={form} />
            <Button primary type="submit" disabled={form.isSubmitting}>
              Update
            </Button>
          </Segment>
        </Form>
      )}
    </Formik>
  );
}

export default function JobPlacement({ iep }) {
  const [showJobPlacement, setShowJobPlacement] = useState(!!iep.job_placement);
  return (
    <>
      <h2>Job Placement</h2>
      {showJobPlacement ? (
        <JobPlacementForm iep={iep} />
      ) : (
        <Button
          onClick={() => {
            setShowJobPlacement(true);
          }}
        >
          Add JobPlacement
        </Button>
      )}
    </>
  );
}
