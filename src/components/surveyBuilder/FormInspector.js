import React from 'react';
import SimpleSchema from 'simpl-schema';
import { AutoForm, AutoField } from 'uniforms-semantic';
import SimpleSchemaBridge from 'uniforms-bridge-simple-schema-2';
import VariableField from './formFields/VariableField';
import { handleFormTransform } from './helpers';

export default class FormInspector extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleTransform = this.handleTransform.bind(this);
    this.dataToSend = null;
  }

  handleChange() {
    setTimeout(() => {
      this.props.onChange(this.dataToSend);
    }, 1);
  }

  handleTransform(mode, model) {
    const transformed = handleFormTransform(mode, model);
    this.dataToSend = this.props.onChange(transformed);
    return model;
  }

  generateSchema() {
    const VariableSchema = new SimpleSchema({
      name: {
        type: String,
      },
      value: {
        type: String,
        optional: true,
      },
    });

    return new SimpleSchema({
      variables: {
        type: Array,
        optional: true,
      },
      'variables.$': {
        type: VariableSchema,
        optional: true,
      },
    });
  }

  render() {
    const schema = this.generateSchema();

    const variableNames = Object.keys(this.props.definition.variables || {});
    const variables = variableNames.map((v) => ({
      name: v,
      value: this.props.definition.variables[v],
    }));

    const model = {
      variables,
    };

    return (
      <div className="item-inspector">
        <h3>Form Inspector</h3>
        <AutoForm
          schema={new SimpleSchemaBridge(schema)}
          model={model}
          onChange={this.handleChange}
          modelTransform={this.handleTransform}
        >
          {/* <AutoField
            name="variables"
            itemProps={{ component: VariableField }}
          /> */}
        </AutoForm>
      </div>
    );
  }
}
