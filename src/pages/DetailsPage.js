import React from 'react';
import { Grid, Loader, Message } from 'semantic-ui-react';

export default function DetailsPage({ loading, error, children }) {
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
      }}
    >
      {loading ? renderLoading() : error ? renderError() : children}
    </Grid>
  );

  return <div>{children}</div>;
}
