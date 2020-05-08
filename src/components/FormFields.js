import React from 'react';
import { Form, Message, Checkbox } from 'semantic-ui-react';

export const FormInput = ({ form, name, ...props }) => (
  <Form.Input
    name={name}
    value={form.values[name]}
    onChange={form.handleChange}
    onBlur={form.handleBlur}
    error={
      !!form.errors[name] && {
        content: form.errors[name],
        pointing: 'above',
      }
    }
    {...props}
  />
);

export const FormTextArea = ({ form, name, ...props }) => (
  <Form.TextArea
    name={name}
    value={form.values[name]}
    onChange={(event) => form.handleChange(event)}
    onBlur={form.handleBlur}
    error={
      !!form.errors[name] && {
        content: form.errors[name],
        pointing: 'above',
      }
    }
    {...props}
  />
);

export const FormSelect = ({ form, name, ...props }) => (
  <Form.Select
    name={name}
    value={form.values[name]}
    onChange={(event, { value }) => form.setFieldValue(name, value)}
    onBlur={() => form.setFieldTouched(name)}
    {...props}
  />
);

export const FormCheckbox = ({ form, name, ...props }) => (
  <Form.Field>
    <Checkbox
      checked={!!form.values[name]}
      onChange={(event, { checked }) => form.setFieldValue(name, checked)}
      onBlur={() => form.setFieldTouched(name)}
      {...props}
    />
  </Form.Field>
);

export const FormErrors = ({ form }) => {
  const keys = Object.keys(form.errors || {});
  if (keys.length) {
    return (
      <Message error>
        Please fix the following errors:
        <ul>
          {keys
            .map((k) => ({ field: k, errors: form.errors[k] }))
            .map(({ field, errors }) =>
              Array.isArray(errors)
                ? { field, errors: errors.join('; ') }
                : { field, errors }
            )
            .map(({ field, errors }) => (
              <li key={field}>
                <strong>{field}</strong>: {errors}
              </li>
            ))}
        </ul>
      </Message>
    );
  }
  return null;
};
