import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Icon, Menu } from "semantic-ui-react";
import { AppContext } from '../AppStore';


export default function AppSidebar({ navigationMenu, adminMenu }) {
  const [{ theme }] = useContext(AppContext);
  return (
    <Menu
      fixed="left"
      vertical
      style={{
        width: `${theme.menuWidth}rem`,
        boxShadow:
          "0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)",
        border: 0,
      }}
    >
      <Menu.Item style={{ background: theme.appBarColor, color: "white" }}>
        [SITE LOGO]
      </Menu.Item>
      <Menu.Item header>Navigation Menu</Menu.Item>
      {navigationMenu.map((item) => (
        <Menu.Item key={item.path} as={NavLink} exact to={item.path} >
          {item.iconName && <Icon name={item.iconName} />}
          {item.name}
        </Menu.Item>
      ))}

      <Menu.Item header>
        Admin Section
        <Menu.Menu>
          <Menu.Item as="a" name="page 1">
            Users
          </Menu.Item>
          <Menu.Item as="a" name="page 1">
            Danger Zone
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>
    </Menu>
  );
}
