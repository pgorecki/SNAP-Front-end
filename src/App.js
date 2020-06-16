import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// import logo from './logo.svg';
import './App.css';
import DashboardPage from './pages/dashboard/DashboardPage';
import AboutPage from './pages/AboutPage';
import UserProfilePage from './pages/UserProfilePage';
import AppSidebar from './components/AppSidebar';
import AppTopbar from './components/AppTopbar';
import AppFooter from './components/AppFooter';
import AppContent from './components/AppContent';
import LoginPage from './pages/LoginPage';
import Error404 from './pages/Error404';
import PrivateRoute from './router/PrivateRoute';
import PublicRoute from './router/PublicRoute';
import HomePage from './pages/HomePage';
import PublicLayout from './pages/PublicLayout';
import ClientList from './pages/clients/ClientList';
import ClientDetails from './pages/clients/ClientDetails';
import ClientNew from './pages/clients/ClientNew';
import ClientEdit from './pages/clients/ClientEdit';
import QuestionList from './pages/questions/QuestionList';
import QuestionDetails from './pages/questions/QuestionDetails';
import SurveyList from './pages/surveys/SurveyList';
import SurveyDetails from './pages/surveys/SurveyDetails';
import SurveyEdit from './pages/surveys/SurveyEdit';
import SurveyNew from './pages/surveys/SurveyNew';
import ResponseList from './pages/responses/ResponseList';
import ResponseDetails from './pages/responses/ResponseDetails';
import ResponseNew from './pages/responses/ResponseNew';
import ResponseEdit from './pages/responses/ResponseEdit';
import AppStore from './AppStore';
import 'react-toastify/dist/ReactToastify.css';

const navigationMenu = [
  {
    name: 'Dashbooard',
    path: '/dashboard',
    iconName: 'dashboard',
    page: DashboardPage,
  },
  // {
  //   name: 'Search',
  //   path: '/search',
  //   iconName: 'search',
  //   page: AboutPage,
  // },
  {
    path: '/clients/new',
    page: ClientNew,
  },
  {
    path: '/clients/:id/edit',
    page: ClientEdit,
  },
  {
    path: '/clients/:id',
    page: ClientDetails,
  },
  {
    name: 'Clients',
    path: '/clients',
    iconName: 'address card outline',
    page: ClientList,
  },
  {
    path: '/surveys/:id/edit',
    page: SurveyEdit,
  },
  {
    path: '/surveys/new',
    page: SurveyNew,
  },
  {
    path: '/surveys/:id',
    page: SurveyDetails,
  },
  {
    name: 'Surveys',
    path: '/surveys',
    iconName: 'file alternate outline',
    page: SurveyList,
  },
  {
    path: '/questions/:id',
    page: QuestionDetails,
  },
  {
    name: 'Question Bank',
    path: '/questions',
    iconName: 'question',
    page: QuestionList,
  },
  {
    path: '/responses/new',
    page: ResponseNew,
  },
  {
    path: '/responses/:id/edit',
    page: ResponseEdit,
  },
  {
    path: '/responses/:id',
    page: ResponseDetails,
  },
  {
    name: 'Responses',
    path: '/responses',
    iconName: 'comment outline',
    page: ResponseList,
  },
  {
    name: 'Account',
    path: '/account',
    iconName: 'user outline',
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
              <AppFooter>Footer</AppFooter>
            </PrivateRoute>
          ))}

          <PublicRoute path="/" exact>
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          </PublicRoute>
          <Route path="/about">
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          </Route>

          <PublicRoute path="/login">
            <LoginPage />
          </PublicRoute>
          <Route path="*" exact>
            <Error404 />
          </Route>
        </Switch>
      </Router>
      <ToastContainer />
    </AppStore>
  );
}

export default App;
