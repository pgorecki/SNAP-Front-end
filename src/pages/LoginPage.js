import React, { useState, useContext } from 'react';
import {
  Grid,
  Header,
  Form,
  Segment,
  Button,
  Message,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { AppContext } from '../AppStore';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, dispatch] = useContext(AppContext);
  const [loading, errors, authenticate] = useAuth();

  return (
    <Grid
      className="ui middle aligned center aligned grid"
      style={{ height: '100vh' }}
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header>Log-in to your account</Header>
        <Segment>
          <Form>
            <Form.Input
              label="Email"
              type="text"
              disabled={loading}
              onChange={(e) => setUsername(e.target.value)}
              error={
                errors &&
                errors.username && {
                  content: errors.username.join(' '),
                  pointing: 'above',
                }
              }
            />
            <Form.Input
              label="Password"
              type="password"
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              error={
                errors &&
                errors.password && {
                  content: errors.password.join(' '),
                  pointing: 'above',
                }
              }
            />
            <Button
              fluid
              color="twitter"
              disabled={loading}
              onClick={async () => {
                const user = await authenticate(username, password);
                console.log(user);
                if (user) {
                  dispatch({ type: 'SET_USER', data: user });
                  localStorage.setItem('user', JSON.stringify(user));
                }
              }}
            >
              Log in
            </Button>
          </Form>
          {errors && errors.non_field_errors && (
            <Message error>{errors.non_field_errors.join(', ')}</Message>
          )}
        </Segment>
        <Message>
          New to us? <Link to="/signup">Sign up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}
