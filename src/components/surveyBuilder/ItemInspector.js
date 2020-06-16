import _ from 'lodash';
import React from 'react';
import { Formik } from 'formik';
import { Button, Form, Segment } from 'semantic-ui-react';
import GridItemForm from './GridItemForm';
import QuestionItemForm from './QuestionItemForm';
import ScoreItemForm from './ScoreItemForm';
import SectionItemForm from './SectionItemForm';
import TextItemForm from './TextItemForm';

import Grid from 'pages/surveys/Grid';
import Question from 'pages/surveys/Question';
import Score from 'pages/surveys/Score';
import Section from 'pages/surveys/Section';
import Text from 'pages/surveys/Text';

export default class ItemInspector extends React.Component {
  constructor() {
    super();
    this.onInputChange = this.onInputChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {
      previewFormState: {
        variables: {},
        values: {},
        props: {},
      },
    };
  }

  onInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    const item = Object.assign({}, this.props.item, {
      [name]: value,
    });
    this.props.onChange(item);
  }

  onValueChange(name, value) {
    console.log('item changed', name, value);
    const previous = Object.assign({}, this.props.item);
    const item = Object.assign({}, this.props.item);
    _.set(item, name, value);
    this.props.onChange(item, name, previous);
  }

  isFromQuestionBank() {
    return !!this.props.originalQuestion;
  }

  handlePreviewPropsChange() {
    // console.log('handlePreviewPropsChange');
  }

  handlePreviewValueChange() {
    // console.log('handlePreviewValueChange');
  }

  renderType() {
    const item = this.props.item;
    const choices = [
      { value: 'grid', label: 'Grid' },
      { value: 'question', label: 'Question' },
      { value: 'score', label: 'Score' },
      { value: 'section', label: 'Section' },
      { value: 'text', label: 'Text' },
    ];
    return (
      <div>
        <label htmlFor="type">Type:</label>
        <select value={item.type} onChange={this.onInputChange} name="type">
          {choices.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  renderInfo() {
    if (this.isFromQuestionBank()) {
      return (
        <p>
          <i className="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp;
          This is a question from Question Bank
        </p>
      );
    }
    return null;
  }

  renderOriginalTitle() {
    if (this.isFromQuestionBank()) {
      return (
        <p>
          <strong>Original title: </strong>
          {this.props.originalQuestion.title}
        </p>
      );
    }
    return null;
  }

  renderItemPreview() {
    const item = Object.assign({}, this.props.item, {
      items: [{ type: 'text', title: '..subelements go here..' }],
    });
    switch (item.type) {
      case 'grid':
        return (
          <Grid
            item={item}
            formState={this.state.previewFormState}
            onValueChange={this.handlePreviewValueChange}
            onPropsChange={this.handlePreviewPropsChange}
            level={2}
          />
        );
      case 'question':
        return (
          <Question
            item={item}
            formState={this.state.previewFormState}
            onValueChange={this.handlePreviewValueChange}
            onPropsChange={this.handlePreviewPropsChange}
            level={2}
          />
        );
      case 'score':
        return (
          <Score
            item={item}
            formState={this.state.previewFormState}
            onValueChange={this.handlePreviewValueChange}
            onPropsChange={this.handlePreviewPropsChange}
            level={2}
          />
        );

      case 'section':
        return (
          <Section
            item={item}
            formState={this.state.previewFormState}
            onValueChange={this.handlePreviewValueChange}
            onPropsChange={this.handlePreviewPropsChange}
            level={2}
          />
        );
      case 'text':
        return (
          <Text
            item={item}
            formState={this.state.previewFormState}
            onValueChange={this.handlePreviewValueChange}
            onPropsChange={this.handlePreviewPropsChange}
            level={2}
          />
        );
      default:
        return null;
    }
  }

  renderItemFields() {
    const { text, type } = this.props.item;

    const itemText = (
      <div className="form-group">
        <label htmlFor="text">Text:</label>
        <textarea
          className="form-control"
          name="text"
          placeholder="Text"
          value={text}
          onChange={this.onInputChange}
          rows={5}
        />
      </div>
    );

    return <div>{[''].include(type) && itemText}</div>;
  }

  renderItemForm() {
    const item = this.props.item;

    console.log(item);

    switch (item.type) {
      case 'grid':
        return (
          'grid' || (
            <GridItemForm
              onChange={this.onValueChange}
              model={item}
              questions={this.props.questions}
              isInFormBuilder
            />
          )
        );
      case 'question':
        return (
          'q' || (
            <QuestionItemForm
              onChange={this.onValueChange}
              model={item}
              questions={this.props.questions}
              isInFormBuilder
            />
          )
        );
      case 'score':
        return (
          's' || <ScoreItemForm onChange={this.onValueChange} model={item} />
        );
      case 'section':
        return (
          'sec' || (
            <SectionItemForm onChange={this.onValueChange} model={item} />
          )
        );
      case 'text':
        return (
          <Formik enableReinitialize initialValues={item}>
            {(form) => (
              <Form>
                <TextItemForm form={form} onChange={this.onValueChange} />
              </Form>
            )}
          </Formik>
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="item-inspector">
        <h3>Item Inspector</h3>
        {this.renderItemForm()}
        <hr />
        <Segment>{this.renderItemPreview()}</Segment>
        <Button onClick={this.props.onClose}>Close Inspector</Button>
      </div>
    );
  }
}
