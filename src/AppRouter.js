import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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
import EligilibityQueueList from './pages/eligibilityQueue/EligibilityQueue';
import EnrollmentQueueList from './pages/enrollmentQueue/EnrollmentQueue';
import QuestionList from './pages/questions/QuestionList';
import QuestionNew from './pages/questions/QuestionNew';
import QuestionEdit from './pages/questions/QuestionEdit';
import SurveyList from './pages/surveys/SurveyList';
import SurveyDetails from './pages/surveys/SurveyDetails';
import SurveyEdit from './pages/surveys/SurveyEdit';
import SurveyNew from './pages/surveys/SurveyNew';
import ResponseList from './pages/responses/ResponseList';
import ResponseDetails from './pages/responses/ResponseDetails';
import ResponseNew from './pages/responses/ResponseNew';
import ResponseEdit from './pages/responses/ResponseEdit';
import { hasPermission } from 'utils/permissions';
import { AppContext } from './AppStore';

const navigationMenu = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    iconName: 'dashboard',
    page: DashboardPage,
  },
  {
    path: '/clients/new',
    page: ClientNew,
    permission: 'client.add_client',
  },
  {
    path: '/clients/:id/edit',
    page: ClientEdit,
    permission: 'client.change_client',
  },
  {
    path: '/clients/:id',
    page: ClientDetails,
    permission: 'client.view_client',
  },
  {
    name: 'Clients',
    path: '/clients',
    iconName: 'address card outline',
    page: ClientList,
    permission: 'client.view_client',
  },
  {
    name: 'Eligibility',
    path: '/eligibility',
    iconName: 'address card outline',
    page: EligilibityQueueList,
    permission: 'eligibility.view_eligibilityqueue',
  },
  {
    name: 'Enrollments',
    path: '/enrollments',
    iconName: 'address card outline',
    page: EnrollmentQueueList,
    permission: 'iep.view_clientiep',
  },
  {
    path: '/surveys/:id/edit',
    page: SurveyEdit,
    permission: 'survey.change_survey',
  },
  {
    path: '/surveys/new',
    page: SurveyNew,
    permission: 'survey.add_survey',
  },
  {
    path: '/surveys/:id',
    page: SurveyDetails,
    permission: 'survey.view_survey',
  },
  {
    name: 'Surveys',
    path: '/surveys',
    iconName: 'file alternate outline',
    page: SurveyList,
    permission: 'survey.view_survey',
  },
  {
    path: '/questions/new',
    page: QuestionNew,
    permission: 'survey.add_question',
  },
  {
    path: '/questions/:id',
    page: QuestionEdit,
    permission: 'survey.view_question',
  },
  {
    name: 'Question Bank',
    path: '/questions',
    iconName: 'question',
    page: QuestionList,
    permission: 'survey.view_question',
  },
  {
    path: '/responses/new',
    page: ResponseNew,
    permission: 'survey.add_response',
  },
  {
    path: '/responses/:id/edit',
    page: ResponseEdit,
    permission: 'survey.change_response',
  },
  {
    path: '/responses/:id',
    page: ResponseDetails,
    permission: 'survey.view_response',
  },
  {
    name: 'Responses',
    path: '/responses',
    iconName: 'comment outline',
    page: ResponseList,
    permission: 'survey.view_response',
  },
  {
    name: 'Account',
    path: '/account',
    iconName: 'user outline',
    page: UserProfilePage,
  },
];

function getRoutesForUser(user) {
  return navigationMenu.filter((item) => hasPermission(user, item.permission));
}

function AppRouter() {
  const [{ user }] = useContext(AppContext);
  return (
    <Router>
      <Switch>
        {navigationMenu.map((item) => (
          <PrivateRoute
            key={item.path}
            exact={item.exact}
            path={item.path}
            hasPermission={hasPermission(user, item.permission)}
            requiredPermission={item.permission}
          >
            <AppTopbar />
            <AppSidebar navigationMenu={getRoutesForUser(user)} />
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
  );
}

export default AppRouter;
