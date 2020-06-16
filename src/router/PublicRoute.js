import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { AppContext } from '../AppStore';

export default function PublicRoute({ children, ...rest }) {
  const [{ isLoggedIn }] = useContext(AppContext);
  return isLoggedIn ? (
    <Redirect to="/dashboard" />
  ) : (
    <Route
      {...rest}
      render={({ location }) => (isLoggedIn ? children : <LoginPage />)}
    />
  );
}
