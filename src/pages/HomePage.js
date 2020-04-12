import React from "react";
import { Link } from "react-router-dom";
import { Grid, Header, Segment, Message } from "semantic-ui-react";

export default function HomePage() {
  return (
    <Grid
      className="ui middle aligned center aligned grid"
      style={{ marginTop: "20vh" }}
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header>Welcome to Georgia SNAP</Header>
        <Segment>
            Lorem ipsum et amet
        </Segment>
        <Message>
            <Link to="/login">Log in</Link> or <Link to="/signup">Sign up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}
