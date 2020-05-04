import React from 'react';
import { parseText } from './computations';
import Item from './Item';

export default class Text extends Item {
  render() {
    const { id, title, text } = this.props.item;
    const isHidden = this.props.formState.variables[`${id}.hidden`];

    if (isHidden) {
      return null;
    }

    const parsedTitle = parseText(title, this.props.formState);
    const parsedText = parseText(text, this.props.formState);

    return (
      <div className="text item" style={{ marginBottom: '1rem' }}>
        {this.renderTitleHTML(parsedTitle)}
        <div dangerouslySetInnerHTML={{ __html: parsedText }} />
      </div>
    );
  }
}
