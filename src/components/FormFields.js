import React from 'react';
import { Field } from 'formik';
import { Form, Message, Checkbox } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import moment from 'moment';

export const FormInput = ({ form, name, handleChange, ...props }) => (
  <Form.Input
    name={name}
    value={form.values[name] || ''}
    onChange={(event, { name, value }) => {
      form.setFieldValue(name, value);
      if (handleChange) {
        handleChange(name, value);
      }
    }}
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

export const FormTextArea = ({
  form,
  name,
  validate,
  handleChange,
  ...props
}) => (
  <Field name={name} validate={validate}>
    {() => (
      <Form.TextArea
        name={name}
        value={form.values[name] || ''}
        onChange={(event, { name, value }) => {
          form.setFieldValue(name, value);
          if (handleChange) {
            handleChange(name, value);
          }
        }}
        onBlur={form.handleBlur}
        error={
          !!form.errors[name] && {
            content: form.errors[name],
            pointing: 'above',
          }
        }
        {...props}
      />
    )}
  </Field>
);

export const FormSelect = ({ form, name, handleChange, ...props }) => (
  <Form.Select
    name={name}
    value={form.values[name]}
    onChange={(event, { value }) => {
      form.setFieldValue(name, value);
      if (handleChange) {
        handleChange(name, value);
      }
    }}
    onBlur={() => form.setFieldTouched(name)}
    {...props}
  />
);

export const FormCheckbox = ({ form, name, handleChange, ...props }) => (
  <Form.Field>
    <Checkbox
      checked={!!form.values[name]}
      onChange={(event, { checked }) => {
        form.setFieldValue(name, checked);
        if (handleChange) {
          handleChange(name, checked);
        }
      }}
      onBlur={() => form.setFieldTouched(name)}
      {...props}
    />
  </Form.Field>
);

export const FormDatePicker = ({
  form,
  label,
  name,
  required,
  handleChange,
  ...props
}) => {
  let value = form.values[name];

  if (typeof value === 'string') {
    value = moment(value).toDate();
  }

  return (
    <Form.Field required>
      <label>{label}</label>
      <SemanticDatepicker
        value={value}
        onChange={(event, { value }) => {
          const dateStr = moment(value).format('YYYY-MM-DD');
          form.setFieldValue(name, dateStr);
          if (handleChange) {
            handleChange(name, dateStr);
          }
        }}
        onBlur={() => form.setFieldTouched(name)}
        format="MM-DD-YYYY"
      />
    </Form.Field>
  );
};

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
