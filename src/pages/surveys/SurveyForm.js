import React, { useState } from 'react';
import Yup from 'yup';
import yaml from 'js-yaml';
import { Form, Button } from 'semantic-ui-react';
import {
  FormInput,
  FormTextArea,
  FormCheckbox,
  FormErrors,
} from '../../components/FormFields';

export function validateDefinition(definition) {
  if (typeof definition !== 'object') {
    throw new Error('Definition must be an object');
  }
}

export default function SurveyForm({ form }) {
  const [newQuestionsCount, setNewQuestionsCount] = useState(0);
  return (
    <Form error onSubmit={form.handleSubmit}>
      <FormInput label="Name" name="name" form={form} required />
      <FormTextArea
        style={{ fontFamily: 'monospace', minHeight: '50vh' }}
        label="Definition"
        name="definition"
        required
        form={form}
        validate={(value) => {
          console.log('valudate');
          if (!value) return;
          try {
            const definition = yaml.safeLoad(value);
            validateDefinition(definition);
            return null;
          } catch (err) {
            return err.message;
          }
        }}
      />
      <FormCheckbox label="Public" name="is_public" form={form} />
      <FormErrors form={form} />
      <Button primary type="submit" disabled={form.isSubmitting}>
        Submit
      </Button>
    </Form>
  );
}
