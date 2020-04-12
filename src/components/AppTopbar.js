import React from "react";
import { NavLink } from "react-router-dom";
import {
    Icon,
    Menu,
    Label,
  } from "semantic-ui-react";
  
const appBarColor = "#3d4977";

export default function AppTopbar({ menuWidth }) {
  return (
    <Menu
      fixed="top"
      style={{
        boxShadow:
          "0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)",
        background: appBarColor,
      }}
    >
      <Menu.Item
        style={{ width: `${menuWidth}rem` }}
      >
        {/* this menu item is just a placeholder */}
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item
          as="a"
          style={{ color: "white" }}
          position="right"
        >
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
        <Menu.Item
          as={NavLink}
          to="/account"
          style={{ color: "white" }}
          position="right"
        >
          <Icon name="user circle" />
          Javier
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
