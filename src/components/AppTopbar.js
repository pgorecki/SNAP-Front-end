import React from "react";
import { NavLink } from "react-router-dom";
import { Icon, Menu, Label, Dropdown } from "semantic-ui-react";
import AuthService from "../services/AuthService";
import { useHistory } from 'react-router-dom';

const appBarColor = "#3d4977";

export default function AppTopbar({ menuWidth }) {
  const history = useHistory();
  return (
    <Menu
      fixed="top"
      style={{
        boxShadow:
          "0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)",
        background: appBarColor,
      }}
    >
      <Menu.Item style={{ width: `${menuWidth}rem` }}>
        {/* this menu item is just a placeholder */}
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item as="a" style={{ color: "white" }} position="right">
          <Icon name="bell" />
          <Label
            color="red"
            size="mini"
            circular
            style={{ position: "absolute", top: "10%", left: "45%" }}
          >
            12
          </Label>
        </Menu.Item>

        <Dropdown
          item
          style={{ color: "white" }}
          text={
            <>
              <Icon name="user circle" /> Javier
            </>
          }
        >
          <Dropdown.Menu>
            <Dropdown.Item as={NavLink} to="/dashboard">
              Dashboard
            </Dropdown.Item>
            <Dropdown.Item
              onClick={async () => {
                AuthService.signout();
                history.push('/');
              }}
            >
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
  );
}
