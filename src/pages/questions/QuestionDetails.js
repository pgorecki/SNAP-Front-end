import React, { useState, useEffect } from 'react';
import {
  Form,
  Header,
  Segment,
  Input,
  TextArea,
  Checkbox,
  Select,
  Button,
  Grid,
} from 'semantic-ui-react';
import useFetchData from '../../hooks/useFetchData';
import useUrlParams from '../../hooks/useUrlParams';
import { formatApiError } from '../../utils/apiUtils';
import DetailsPage from '../DetailsPage';
import Section from '../surveys/Section';

function useQuestionForm(initialState = {}) {
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  return {
    values: state,
    getValue(name) {
      return state[name];
    },
    setValue(name, value) {
      console.log('set form value', name, value);
      setState({
        ...state,
        [name]: value,
      });
    },
    getError(name) {
      return errors[name];
    },
    onChange(event, field) {
      setState({
        ...state,
        [field.name]: field.value,
      });
    },
    onChecked(event, field) {
      setState({
        ...state,
        [field.name]: field.checked,
      });
    },
    getArray(name) {
      if (Array.isArray(state[name])) {
        return state[name].join('\n');
      }
    },
    setArray(name, textString) {
      const elements = textString.split('\n');
      setState({
        ...state,
        [name]: elements,
      });
    },
  };
}

const questionCategories = [
  { value: 'text', text: 'Text' },
  { value: 'choice', text: 'Choice' },
];

export default function QuestionDetails() {
  const [urlParams] = useUrlParams();
  const [data, error, loading] = useFetchData(`/questions/${urlParams.id}`, {});
  const form = useQuestionForm(data);
  console.log('f', form.values);
  return (
    <DetailsPage loading={loading} error={formatApiError(error)}>
      <Header>Edit {form.values.title}</Header>
      <Grid>
        <Grid.Column>aa</Grid.Column>
        <Grid.Column>bb</Grid.Column>
      </Grid>
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
                  text: form.values.description,
                  refusable: true,
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

      <Form>
        <Form.Field>
          <label>Title</label>
          <Input
            name="title"
            value={form.values.title}
            onChange={form.onChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <TextArea
            name="description"
            value={form.values.description}
            onChange={form.onChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Category</label>
          <Select
            name="category"
            placeholder="Select question category"
            options={questionCategories}
            onChange={form.onChange}
          />
        </Form.Field>
        {['choice'].includes(form.values.category) && (
          <>
            <Form.Field>
              <label>Options</label>
              <TextArea
                name="options"
                value={form.getArray('options')}
                onChange={(event, { value }) => form.setArray('options', value)}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                name="other"
                label="Other"
                checked={form.getValue('other')}
                onChange={form.onChecked}
              />
            </Form.Field>
          </>
        )}
        <Form.Field>
          <Checkbox
            name="refusable"
            label="Refusable?"
            checked={form.getValue('refusable')}
            onChange={form.onChecked}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            name="is_public"
            label="Public"
            checked={form.getValue('is_public')}
            onChange={form.onChecked}
          />
        </Form.Field>
        <Button primary onClick={() => console.log(form.values)}>
          Submit
        </Button>
      </Form>
    </DetailsPage>
  );
}
