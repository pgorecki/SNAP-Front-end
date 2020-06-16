import React from 'react';
import { Formik } from 'formik';
import { Form, Button } from 'semantic-ui-react';
import { FormInput } from 'components/FormFields';

export default class FormInspector extends React.Component {
  render() {
    const variableNames = Object.keys(this.props.definition.variables || {});
    const variables = variableNames.map((v) => ({
      name: v,
      value: this.props.definition.variables[v],
    }));

    const data = {
      variables,
    };

    return (
      <div className="item-inspector">
        <h3>Form Inspector</h3>
        <Formik
          enableReinitialize
          initialValues={data}
          onSubmit={(values, actions) => {
            const variables = values.variables.reduce(
              (all, { name, value }) => {
                console.log(all, name, value);
                if (!name) {
                  return all;
                }
                return {
                  ...all,
                  [name]: value || 0,
                };
              },
              {}
            );
            actions.setSubmitting(false);

            console.log('q', values.variables, variables);

            this.props.onChange({ variables });
          }}
        >
          {(form) => {
            const variables = [...form.values.variables];
            if (
              variables.length === 0 ||
              !!variables[variables.length - 1].name
            ) {
              variables.push({
                name: '',
                value: '',
              });
            }
            return (
              <Form
                error
                onSubmit={form.handleSubmit}
                onChange={(a, b, c, d) => console.log('change', a, b, c, d)}
              >
                {variables.map(({ name, value }, i) => (
                  <Form.Group key={i}>
                    <FormInput
                      label={i === 0 && 'Name'}
                      name={`variables.${i}.name`}
                      value={name}
                      form={form}
                    />
                    <FormInput
                      label={i === 0 && 'Value'}
                      name={`variables.${i}.value`}
                      value={value}
                      form={form}
                    />
                  </Form.Group>
                ))}
                <Button primary type="submit" disabled={form.isSubmitting}>
                  Update Form
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
}
