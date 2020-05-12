import React from 'react';
import { Grid, Header, Loader, Message } from 'semantic-ui-react';

export default function ListPage({ title, loading, error, children }) {
  function renderLoading() {
    return <Loader active inline="centered" />;
  }
  function renderError() {
    let message = error;
    if (typeof error !== 'string') {
      message = JSON.stringify(error);
    }
    return <Message error>{`${message}`}</Message>;
  }

  return (
    <Grid
      style={{
        background: '#fff',
        margin: 0,
        padding: 30,
        minHeight: '50vh',
      }}
    >
      <Grid.Column>
        {title && <Header>{title}</Header>}
        {loading ? renderLoading() : error ? renderError() : children}
      </Grid.Column>
    </Grid>
  );
}
