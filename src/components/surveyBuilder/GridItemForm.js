import React from 'react';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import QuestionPicker from './formFields/QuestionPickerField';
import RuleField from './formFields/RuleField';
import { GridDefinitionSchema } from './definitionSchemas';

export default class GridItemForm extends React.Component {
  render() {
    const isDisabled = !!this.props.model.hmisId;
    const { isInFormBuilder, questions } = this.props;
    return (
      <AutoForm
        schema={GridDefinitionSchema}
        onChange={this.props.onChange}
        model={this.props.model}
      >
        <AutoField name="id" />
        {isInFormBuilder && (
          <QuestionPicker name="hmisId" questions={questions} />
        )}
        <AutoField name="type" disabled={isDisabled} />
        <AutoField name="title" />
        <AutoField name="text" />
        <AutoField name="rules" itemProps={{ component: RuleField }} />
      </AutoForm>
    );
  }
}
