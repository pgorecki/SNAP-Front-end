import React from 'react';
import {
  Grid,
  Header,
  Form,
  Segment,
  Button,
  Message,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default function ErrorForbidden({ requiredPermission }) {
  return (
    <Grid
      className="ui middle aligned center aligned grid"
      style={{ height: '100vh' }}
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header>Forbidden</Header>
        <Message>
          You need <strong>{requiredPermission}</strong> permission to access
          this page. <Link to="/">Take me home</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}
