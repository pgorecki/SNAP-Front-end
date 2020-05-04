import React from 'react';
import { Header } from 'semantic-ui-react';

export default class Item extends React.Component {
  renderTitle() {
    const title = `${this.props.item.title}`;
    const element =
      this.props.level >= 1 && this.props.level <= 6
        ? `h${this.props.level}`
        : 'div';
    return <Header as={element}>{title}</Header>;
  }

  renderTitleHTML(html) {
    switch (this.props.level) {
      case 1:
        return (
          <h1
            className="ui header"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      case 2:
        return (
          <h2
            className="ui header"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      case 3:
        return (
          <h3
            className="ui header"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      case 4:
        return (
          <h4
            className="ui header"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      case 5:
        return (
          <h5
            className="ui header"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      case 6:
        return (
          <h6
            className="ui header"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      default:
        return (
          <div
            className="ui header"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
    }
  }
}
