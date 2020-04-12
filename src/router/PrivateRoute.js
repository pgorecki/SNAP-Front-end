import React from "react";
import { Route } from "react-router-dom";
import AuthService from "../services/AuthService";
import LoginPage from "../pages/LoginPage";


export default function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        AuthService.isAuthenticated ? children : <LoginPage />
      }
    />
  );
}
