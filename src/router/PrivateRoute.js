import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import LoginPage from 'pages/LoginPage';
import ErrorForbidden from 'pages/ErrorForbidden';
import { AppContext } from '../AppStore';

export default function PrivateRoute({
  hasPermission,
  requiredPermission,
  children,
  ...rest
}) {
  const [{ isLoggedIn }] = useContext(AppContext);
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (!isLoggedIn) {
          return <LoginPage />;
        }

        if (!hasPermission) {
          return <ErrorForbidden requiredPermission={requiredPermission} />;
        }

        return children;
      }}
    />
  );
}
