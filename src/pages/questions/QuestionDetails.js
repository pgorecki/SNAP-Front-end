import React, { useState, useEffect, useMemo } from 'react';
import {
  Form,
  Grid,
  Header,
  Select,
  TextArea,
  Checkbox,
  Button,
  Segment,
} from 'semantic-ui-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  FormInput,
  FormTextArea,
  FormSelect,
  FormCheckbox,
  FormErrors,
} from '../../components/FormFields';
import useResource from '../../hooks/useResource';
import useUrlParams from '../../hooks/useUrlParams';
import { formatApiError, apiErrorToFormError } from '../../utils/apiUtils';
import DetailsPage from '../DetailsPage';
import Section from '../surveys/Section';

const questionCategories = [
  { value: 'text', text: 'Text' },
  { value: 'choice', text: 'Choice' },
];

export default function QuestionDetails() {
  const [urlParams] = useUrlParams();
  const { data, error, loading, save } = useResource(
    `/questions/${urlParams.id}/`,
    {}
  );

  return (
    <Formik
      enableReinitialize
      initialValues={data}
      onSubmit={async (values, actions) => {
        try {
          await save(values);
        } catch (err) {
          actions.setErrors(apiErrorToFormError(err));
        }
        actions.setSubmitting(false);
      }}
    >
      {(form) => (
        <DetailsPage
          title={`Edit ${form.values.title}`}
          loading={loading}
          error={formatApiError(error)}
        >
          <Grid>
            <Grid.Column computer={8} mobile={16}>
              <Form error onSubmit={form.handleSubmit}>
                <FormInput label="Title" name="title" form={form} />
                <FormTextArea
                  label="Description"
                  name="description"
                  form={form}
                />
                <FormSelect
                  label="Category"
                  name="category"
                  placeholder="Select question category"
                  options={questionCategories}
                  form={form}
                />
                {['choice'].includes(form.values.category) && (
                  <>
                    <FormTextArea
                      label="Options"
                      name="options"
                      value={
                        console.log(form.values['options']) ||
                        Array.isArray(form.values['options'])
                          ? form.values['options'].join('\n')
                          : form.values['options']
                      }
                      onChange={(event, { value }) =>
                        form.setFieldValue('options', value.split('\n'))
                      }
                      form={form}
                    />
                    <FormCheckbox label="Other" name="other" form={form} />
                  </>
                )}
                <FormCheckbox label="Refusable" name="refusable" form={form} />
                <FormCheckbox label="Public" name="is_public" form={form} />
                <FormErrors form={form} />
                <Button primary type="submit" disabled={form.isSubmitting}>
                  Submit
                </Button>
              </Form>
            </Grid.Column>
            <Grid.Column computer={8} mobile={16}>
              <Segment color="blue">
                <Form>
                  <Section
                    item={{
                      title: 'Question preview',
                      items: [
                        {
                          type: 'question',
                          id: data.id,
                          title: form.values.title,
                          category: form.values.category,
                          options: form.values.options,
                          other: form.values.other,
                          text: form.values.description,
                          refusable: form.values.refusable,
                        },
                      ],
                    }}
                    formState={{ props: {}, values: {} }}
                    onValueChange={(a, b, c) => {
                      console.log(a, b, c);
                    }}
                    onPropsChange={(a, b, c) => {
                      console.log(a, b, c);
                    }}
                  />
                </Form>
              </Segment>
            </Grid.Column>
          </Grid>
        </DetailsPage>
      )}
    </Formik>
  );
}
