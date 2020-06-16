import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { FormInput, FormSelect } from 'components/FormFields';

import AutoForm from 'uniforms-bootstrap3/AutoForm';
import { AutoField, ListField } from 'uniforms-bootstrap3';
import { TextDefinitionSchema } from './definitionSchemas';
import RuleField from './formFields/RuleField';
import RichTextEditor from './RichTextEditor';
import { handleItemTransform } from './helpers';

const itemTypeOptions = [
  { value: 'text', text: 'text' },
  { value: 'section', text: 'section' },
  { value: 'question', text: 'question' },
  { value: 'grid', text: 'grid' },
];

export default function TextItemForm({ form, onChange }) {
  return (
    <Form>
      <Form.Group>
        <FormInput
          label="Item id"
          name="id"
          handleChange={onChange}
          form={form}
        />
        <FormSelect
          label="Type"
          name="type"
          options={itemTypeOptions}
          handleChange={onChange}
          form={form}
        />
      </Form.Group>
      <Form.Group>
        <FormInput
          label="Title"
          name="title"
          handleChange={onChange}
          form={form}
        />
      </Form.Group>
    </Form>
  );
}

export class TextItemForm222 extends React.Component {
  render() {
    return (
      <AutoForm
        schema={TextDefinitionSchema}
        onChange={this.props.onChange}
        model={this.props.model}
        modelTransform={handleItemTransform}
      >
        <AutoField name="id" />
        <AutoField name="type" />
        <AutoField name="title" />
        <RichTextEditor
          name="text"
          className=""
          toolbar={[
            ['bold', 'italic'],
            ['link'],
            [{ list: 'ordered' }, { list: 'bullet' }],
          ]}
        />
        <ListField
          name="rules"
          itemProps={{ component: RuleField }}
          addIcon={
            <span>
              <i className="glyphicon glyphicon-plus" /> Add Rule
            </span>
          }
          removeIcon={
            <span>
              <i className="glyphicon glyphicon-minus" /> Delete Rule
            </span>
          }
        />
      </AutoForm>
    );
  }
}
