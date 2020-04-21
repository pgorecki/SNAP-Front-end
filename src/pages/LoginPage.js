import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  Header,
  Form,
  Segment,
  Button,
  Message,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { AppContext } from '../AppStore';

export default function LoginPage() {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [state, dispatch] = useContext(AppContext);
  const [loading, errorMessage, authenticate] = useAuth();

  console.log(loading, errorMessage);

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
            />
            <Form.Input
              label="Password"
              type="password"
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              fluid
              color="twitter"
              disabled={loading}
              onClick={async () => {
                const user = await authenticate(username, password);
                if (user) {
                  dispatch({ type: 'SET_USER', data: user });
                  localStorage.setItem('user', JSON.stringify(user));
                  history.push('/dashboard');
                }
              }}
            >
              Log in
            </Button>
          </Form>
          {errorMessage && <Message error>{errorMessage}</Message>}
        </Segment>
        <Message>
          New to us? <Link to="/signup">Sign up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}
