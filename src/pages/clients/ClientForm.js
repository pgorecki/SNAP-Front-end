import React from 'react';
import { Form, Button, Segment } from 'semantic-ui-react';
import { FormInput, FormDatePicker, FormErrors } from 'components/FormFields';

export default function ClientForm({ form }) {
  const address = form.values.address || {};
  console.log('xxx', form.values);
  return (
    <Form
      error
      onSubmit={form.handleSubmit}
      onChamge={() => console.log('changed')}
    >
      <Segment>
        <h4>General info</h4>
        <FormInput label="First Name" name="first_name" form={form} required />
        <FormInput label="Middle Name" name="middle_name" form={form} />
        <FormInput label="Last Name" name="last_name" form={form} required />
        <FormDatePicker label="Date of Birth" name="dob" form={form} required />
        <FormInput label="SSN" name="ssn" form={form} />
        <FormInput label="Snap Id" name="snap_id" form={form} />
      </Segment>
      <Segment>
        <h4>Address</h4>
        <FormInput label="City" name="address.city" form={form} />
        <FormInput label="County" name="address.county" form={form} />
        <FormInput label="State" name="address.state" form={form} />
        <FormInput label="Street" name="address.street" form={form} />
        <FormInput label="ZIP" name="address.zip" form={form} />
      </Segment>
      <FormErrors form={form} />
      <Button primary type="submit" disabled={form.isSubmitting}>
        Submit
      </Button>
    </Form>
  );
}
