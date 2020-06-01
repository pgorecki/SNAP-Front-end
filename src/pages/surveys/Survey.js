import React from 'react';
import { Button, Message, Form, Table, Label } from 'semantic-ui-react';
import {
  computeFormState,
  itemsToArray,
  evaluateOperand,
} from './computations';

import { clientFullName } from '../../utils/modelUtils';
import Section from './Section';

const ResponseStatus = {
  COMPLETED: 'completed',
  PAUSED: 'paused',
};

function getRequiredQuestions(definition, formState) {
  const requiredQuestions = itemsToArray(definition).filter(
    (item) => item.type === 'question' && item.required
  );
  return requiredQuestions.map((q) => ({
    question: q,
    value: formState.values[q.id],
  }));
}

export default class Survey extends React.Component {
  constructor(props) {
    super(props);
    const {
      survey = {},
      client,
      user,
      project,
      enrollmentInfo,
      initialValues,
    } = props;
    this.definition = {
      ...survey.definition,
      title: survey.name,
    };
    const precomputedInitialValues = initialValues || {};
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handlePropsChange = this.handlePropsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggleDebugWindow = this.handleToggleDebugWindow.bind(this);

    const otherData = {
      client: client,
      user: user,
      project: project || {},
      enrollmentInfo: enrollmentInfo || {},
    };

    const initial = Object.keys(precomputedInitialValues).reduce((all, key) => {
      const v = precomputedInitialValues[key];
      const initialState = {
        ...otherData,
      };
      return {
        ...all,
        [key]: evaluateOperand(v, initialState),
      };
    }, {});

    this.state = {
      ...computeFormState(this.definition, initial, {}, otherData),
      errors: {},
      showDebugWindow: false,
    };
  }

  handleValueChange(name, value, isValid = true) {
    console.log('changed', name, value);
    // check for array names i.e. 'foo[12]'
    const match = name.match(/([^[]+)\[(\d+)\]/);
    let newValues;
    if (match) {
      // handle array data
      const arrName = match[1];
      const arrIdx = match[2];
      const v = this.state.values[arrName];
      const arr = Array.isArray(v) ? v : [];
      arr[arrIdx] = value;
      newValues = Object.assign({}, this.state.values, {
        [arrName]: arr,
      });
    } else {
      // handle normal data
      newValues = Object.assign({}, this.state.values, {
        [name]: value,
      });
      if (value === '') {
        delete newValues[name];
      }
    }

    const formState = computeFormState(
      this.definition,
      newValues,
      this.state.props,
      { client: this.props.client }
    );
    const errors = this.state.errors;
    if (isValid) {
      delete errors[name];
    } else {
      errors[name] = true;
    }
    this.setState({
      ...formState,
      errors,
    });
  }

  handlePropsChange(name, value) {
    const props = Object.assign({}, this.state.props, {
      [name]: value,
    });
    if (!value) {
      delete props[name];
    }

    const formState = computeFormState(
      this.definition,
      this.state.values,
      props,
      { client: this.props.client }
    );
    this.setState(formState);
  }

  async handleSubmit(status) {
    this.setState({ submitting: true });
    try {
      await this.props.onSubmit(this.state.values, status);
    } catch (err) {
      console.error(err);
      alert(`${err}`);
    }
    this.setState({ submitting: false });
  }

  handleToggleDebugWindow() {
    this.setState({
      showDebugWindow: !this.state.showDebugWindow,
    });
  }

  renderDebugTable(name, data) {
    const rows = Object.keys(data || {})
      .sort()
      .map((v) => {
        let text = `${data[v]}`;
        if (text.length > 50) text = `${text.substring(0, 47)}...`;
        return (
          <tr key={`${name}-${v}`}>
            <td>{v}</td>
            <td>{text}</td>
          </tr>
        );
      });
    if (rows.length === 0) {
      rows.push(
        <tr key={`empty-${name}`}>
          <td>Empty</td>
        </tr>
      );
    }
    return rows;
  }

  renderDebugWindow() {
    const checkBox = (
      <label>
        <input
          type="checkbox"
          value={this.state.showDebugWindow}
          onClick={this.handleToggleDebugWindow}
        />
        Show Debug Info
      </label>
    );
    if (!this.state.showDebugWindow) {
      return <div className="survey-debug">{checkBox}</div>;
    }
    const formState = this.state;
    const tables = (Object.keys(formState) || []).sort().map((t) => (
      <Table compact key={`table-${t}`}>
        <caption>{t}</caption>
        <Table.Body>{this.renderDebugTable(t, formState[t])}</Table.Body>
      </Table>
    ));

    return (
      <div className="survey-debug">
        {checkBox}
        <h6>Debug info</h6>
        {tables}
      </div>
    );
  }

  renderSubmitButtons(canSubmit) {
    const responseId = this.props.response && this.props.response.id;
    const client = this.props.client;
    const hasErrors = Object.keys(this.state.errors).length > 0;
    const disabled =
      !client || this.state.submitting || hasErrors || !canSubmit; // || status === ResponseStatus.COMPLETED;

    return (
      <div>
        <div>
          <Button
            disabled={disabled}
            primary
            onClick={() => this.handleSubmit(ResponseStatus.COMPLETED)}
          >
            {responseId ? 'Update response' : 'Submit Response'}
          </Button>{' '}
          <Button
            disabled={disabled}
            onClick={() => this.handleSubmit(ResponseStatus.PAUSED)}
          >
            Pause Response
          </Button>
        </div>
        {hasErrors && <div className="error-message">Survey has errors</div>}
      </div>
    );
  }

  render() {
    if (!this.definition) {
      return <Message error>No survey definition</Message>;
    }
    const root = this.definition;
    const formState = this.state;
    const client = this.props.client || {};
    const status = this.props.response
      ? /*this.props.response.status*/ 'completed'
      : 'new';
    const clientName = clientFullName(client) || client.id || 'n/a';

    const requiredQuestions = getRequiredQuestions(root, formState);
    const emptyRequiredQuestions = requiredQuestions.filter((q) => !q.value);
    const emptyRequiredLabels = emptyRequiredQuestions.map(
      (q) => q.question.title
    );

    const canSubmit = emptyRequiredQuestions.length === 0;

    return (
      <Form>
        <p>
          <strong>Client:</strong> {clientName}
        </p>
        <p>
          <strong>Response status:</strong> <Label>{status}</Label>
        </p>
        <Section
          item={root}
          formState={formState}
          onValueChange={this.handleValueChange}
          onPropsChange={this.handlePropsChange}
          level={1}
          debugMode={this.props.debugMode}
        />
        {this.renderSubmitButtons(canSubmit)}
        {emptyRequiredLabels.length
          ? `The following fields are required: ${emptyRequiredLabels.join(
              ', '
            )}`
          : null}

        {this.props.debugMode && (
          <div style={{ marginTop: '1em' }}>{this.renderDebugWindow()}</div>
        )}
      </Form>
    );
  }
}
