import React, { useContext } from "react";
import { Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { AppContext } from "../AppStore";


export default function PrivateRoute({ children, ...rest }) {
  const [{ isLoggedIn }] = useContext(AppContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? children : <LoginPage />
      }
    />
  );
}
