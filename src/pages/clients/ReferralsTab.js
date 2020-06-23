import React from 'react';
import { Formik } from 'formik';
import { Form, Button, Header } from 'semantic-ui-react';
import {
  FormInput,
  FormSelect,
  FormDatePicker,
  FormErrors,
} from 'components/FormFields';
import useResourceIndex from 'hooks/useResourceIndex';
import useNewResource from 'hooks/useNewResource';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';

function NewReferralForm({ client, programs }) {
  const { data, error, save } = useNewResource('/matching/');

  const options = programs.map(({ id, name }) => ({ value: id, text: name }));

  return (
    <>
      <Header as="h4">New Referral</Header>
      <Formik
        initialValues={{
          client: null,
          program: null,
          start_date: null,
        }}
        onSubmit={async (values, actions) => {
          console.log(values);
          try {
            await save(values);
          } catch (err) {
            actions.setErrors(apiErrorToFormError(err));
          }
          actions.setSubmitting(false);
        }}
      >
        {(form) => (
          <Form error onSubmit={form.handleSubmit}>
            <FormSelect
              label="Program"
              name="program"
              placeholder="Select program"
              options={options}
              required
              form={form}
            />
            <FormDatePicker
              label="Start date"
              name="start_date"
              form={form}
              required
            />
            <FormErrors form={form} />
            <Button primary type="submit" disabled={form.isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default function ReferralsTab({ client }) {
  const programIndex = useResourceIndex('/programs/');
  const matchingIndex = useResourceIndex('/matching/');

  const ready = programIndex.ready && matchingIndex.ready;

  if (programIndex.ready) console.log('p', programIndex);
  if (matchingIndex.ready) console.log('m', matchingIndex);

  if (!ready) return null;

  if (matchingIndex.data.length === 0) {
    return <NewReferralForm client={client} programs={programIndex.data} />;
  }

  return <p>REF</p>;
}
