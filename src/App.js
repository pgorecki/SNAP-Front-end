import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import UserProfilePage from './pages/UserProfilePage';
import AppSidebar from './components/AppSidebar';
import AppTopbar from './components/AppTopbar';
import AppContent from './components/AppContent';
import LoginPage from './pages/LoginPage';
import Error404 from './pages/Error404';
import PrivateRoute from './router/PrivateRoute';
import HomePage from './pages/HomePage';
import PublicLayout from './pages/PublicLayout';
import AppStore from './AppStore';

const navigationMenu = [
  {
    name: 'Dashbooard',
    path: '/dashboard',
    iconName: 'dashboard',
    page: DashboardPage,
  },
  {
    name: 'Search',
    path: '/search',
    iconName: 'search',
    page: AboutPage,
  },
  {
    name: 'Account',
    path: '/account',
    iconName: 'bed',
    page: UserProfilePage,
  },
];

function App() {
  // const [visible, setVisible] = useState(true);

  return (
    <AppStore>
      <Router>
        <Switch>
          {navigationMenu.map((item) => (
            <PrivateRoute key={item.path} exact={item.exact} path={item.path}>
              <AppTopbar />
              <AppSidebar navigationMenu={navigationMenu} />
              <AppContent>
                <item.page />
              </AppContent>
            </PrivateRoute>
          ))}

          <Route path="/" exact>
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          </Route>
          <Route path="/about">
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          </Route>

          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="*" exact>
            <Error404 />
          </Route>
        </Switch>
      </Router>
    </AppStore>
  );
}

export default App;
