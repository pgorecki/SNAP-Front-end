import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import {
  FormInput,
  FormDatePicker,
  FormErrors,
} from '../../components/FormFields';

export default function ClientForm({ form }) {
  return (
    <Form error onSubmit={form.handleSubmit}>
      <FormInput label="First Name" name="first_name" form={form} required />
      <FormInput label="Middle Name" name="middle_name" form={form} />
      <FormInput label="Last Name" name="last_name" form={form} required />
      <FormDatePicker label="Date of Birth" name="dob" form={form} required />
      <FormErrors form={form} />
      <Button primary type="submit" disabled={form.isSubmitting}>
        Submit
      </Button>
    </Form>
  );
}
