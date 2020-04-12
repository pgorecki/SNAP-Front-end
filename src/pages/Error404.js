import React from "react";
import {
  Grid,
  Header,
  Form,
  Segment,
  Button,
  Message,
} from "semantic-ui-react";
import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <Grid
      className="ui middle aligned center aligned grid"
      style={{ height: "100vh" }}
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header>404 Not found</Header>
        <Message>
          The page you are looking for does not exist. <Link to='/'>Take me home</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}
