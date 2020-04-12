import React from "react";
import { NavLink } from "react-router-dom";
import { Icon, Menu, Label, Button } from "semantic-ui-react";
import AuthService from "../services/AuthService";

const appBarColor = "#3d4977";
const menuWidth = 1;

export default function PublicLayout({ children }) {
  return (
    <>
      <Menu
        fixed="top"
        style={{
          boxShadow:
            "0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)",
          background: appBarColor,
        }}
      >
        <Menu.Item style={{ color: "white" }}>[LOGO]</Menu.Item>
        <Menu.Item as={NavLink} to="/" style={{ color: "white" }}>
          <Icon name="home" />
        </Menu.Item>
        <Menu.Item as={NavLink} to="/about" style={{ color: "white" }}>
          About
        </Menu.Item>

        <Menu.Menu position="right">
          {AuthService.isAuthenticated ? (
            <Menu.Item
              as={NavLink}
              to="/dashboard"
              style={{ color: "white" }}
              position="right"
            >
              <Icon name="dashboard" />
              Dashboard
            </Menu.Item>
          ) : (
            <Menu.Item
              as={NavLink}
              to="/login"
              style={{ color: "white" }}
              position="right"
            >
              <Icon name="sign in" />
              Sign In
            </Menu.Item>
          )}
        </Menu.Menu>
      </Menu>
      <div
        style={{
          width: "100%",
          paddingTop: "4rem",
          paddingLeft: `${menuWidth}rem`,
        }}
      >
        <div style={{ marginRight: "1rem", marginLeft: "1rem" }}>
          {children}
        </div>
      </div>
    </>
  );
}
