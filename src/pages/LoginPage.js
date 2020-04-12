import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import {
  Grid,
  Header,
  Form,
  Segment,
  Button,
  Message,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import AuthService from "../services/AuthService";

export default function LoginPage() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  return (
    <Grid
      className="ui middle aligned center aligned grid"
      style={{ height: "100vh" }}
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header>Log-in to your account</Header>
        <Segment>
          <Form>
            <Form.Input label="Email" type="text" disabled={isAuthenticating} />
            <Form.Input label="Password" type="password" disabled={isAuthenticating} />
            <Button
              fluid
              color="twitter"
              onClick={async () => {
                setIsAuthenticating(true);
                await AuthService.authenticate();
                setIsAuthenticating(false);
                history.push('/dashboard');
              }}
            >
              Log in
            </Button>
          </Form>
        </Segment>
        <Message>
          New to us? <Link to="/signup">Sign up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}
