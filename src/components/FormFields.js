import React from 'react';
import { Field } from 'formik';
import { Form, Message, Checkbox } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import moment from 'moment';

function getValueFromDotNotation(obj, name) {
  const parts = name.split('.');
  return parts.reduce(
    (currentNode, name) => currentNode && currentNode[name],
    obj
  );
}

export const FormInput = ({ form, name, ...props }) => (
  <Form.Input
    name={name}
    value={getValueFromDotNotation(form.values, name) || ''}
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

export const FormTextArea = ({ form, name, validate, ...props }) => (
  <Field name={name} validate={validate}>
    {() => (
      <Form.TextArea
        name={name}
        value={form.values[name] || ''}
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
    )}
  </Field>
);

export const FormSelect = ({ form, required, name, ...props }) => (
  <Form.Select
    name={name}
    value={form.values[name]}
    onChange={(event, { value }) => form.setFieldValue(name, value)}
    onBlur={() => form.setFieldTouched(name)}
    required={required}
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

export const FormDatePicker = ({ form, label, name, required, ...props }) => {
  let value = form.values[name];

  if (typeof value === 'string') {
    value = moment(value).toDate();
  }

  return (
    <Form.Field required={required}>
      <label>{label}</label>
      <SemanticDatepicker
        value={value}
        onChange={(event, { value }) =>
          form.setFieldValue(
            name,
            value ? moment(value).format('YYYY-MM-DD') : null
          )
        }
        onBlur={() => form.setFieldTouched(name)}
        format="MM-DD-YYYY"
        required={required}
        {...props}
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
