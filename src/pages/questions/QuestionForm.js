import React from 'react';
import { Form, Grid, Button, Segment } from 'semantic-ui-react';
import {
  FormInput,
  FormTextArea,
  FormSelect,
  FormCheckbox,
  FormErrors,
} from 'components/FormFields';
import Section from '../surveys/Section';
import { hasPermission } from 'utils/permissions';

const questionCategories = [
  { value: 'text', text: 'text' },
  { value: 'choice', text: 'choice' },
  { value: 'date', text: 'date' },
  { value: 'number', text: 'number' },
  { value: 'textarea', text: 'textarea' },
  { value: 'grid', text: 'grid' },
];

export default function QuestionForm({ form, user, data = {} }) {
  return (
    <>
      <Grid.Column computer={8} mobile={16}>
        <Form error onSubmit={form.handleSubmit}>
          <FormInput label="Title" name="title" form={form} />
          <FormTextArea label="Description" name="description" form={form} />
          <FormSelect
            label="Category"
            name="category"
            placeholder="Select question category"
            options={questionCategories}
            form={form}
          />
          {['choice', 'select'].includes(form.values.category) && (
            <>
              <FormTextArea
                label="Options"
                name="options"
                value={
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
          {hasPermission(user, 'survey.change_question') && (
            <Button primary type="submit" disabled={form.isSubmitting}>
              Submit
            </Button>
          )}
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
    </>
  );
}
