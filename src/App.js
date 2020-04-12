import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import logo from "./logo.svg";
import "./App.css";
import {
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
  Container,
  Grid,
  Label,
} from "semantic-ui-react";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import UserProfilePage from "./pages/UserProfilePage";
import AppSidebar from "./components/AppSidebar";
import AppTopbar from "./components/AppTopbar";
import AppContent from "./components/AppContent";

const navigationMenu = [
  {
    name: "Dashbooard",
    path: "/",
    exact: true,
    iconName: "dashboard",
    page: DashboardPage,
  },
  {
    name: "About",
    path: "/about",
    iconName: "search",
    page: AboutPage,
  },
  {
    name: "Account",
    path: "/account",
    iconName: "bed",
    page: UserProfilePage,
  },
];

const menuWidth = 10;
const appBarColor = "#3d4977";

function App() {
  const [visible, setVisible] = useState(true);
  const activeItem = "editorials";
  const [menuWidth, setMenuWidth] = useState(10);

  return (
    <Router>
      <AppTopbar />
      <AppSidebar navigationMenu={navigationMenu} />
      <Switch>
        {navigationMenu.map((item) => (
          <Route key={item.path} exact={item.exact} path={item.path}>
            <AppContent menuWidth={menuWidth}>
              <item.page />
            </AppContent>
          </Route>
        ))}
      </Switch>
    </Router>
  );
}

export default App;
