import React from 'react';
import { Message, Segment, Header } from 'semantic-ui-react';
import { evaluateOperand } from './computations';
import Text from './Text';

export default class Score extends Text {
  render() {
    const { score, text } = this.props.item;
    let value = evaluateOperand(score, this.props.formState) || 0;

    return this.props.debugMode ? (
      <Message info className="clearfix">
        <Segment style={{ float: 'right', textAlign: 'center' }}>
          <div>SCORE:</div>
          <Header>{value}</Header>
        </Segment>
        <div className="text" dangerouslySetInnerHTML={{ __html: text }} />
      </Message>
    ) : null;
  }
}
