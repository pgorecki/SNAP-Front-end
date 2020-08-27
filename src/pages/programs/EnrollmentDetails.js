import React from 'react';
import { Grid, Header, Loader, Message, Tab } from 'semantic-ui-react';
import SummaryTab from '../programs/SummaryTab';
import useUrlParams from 'hooks/useUrlParams';
import { NavLink, useHistory } from 'react-router-dom';
import useResource from 'hooks/useResource';
import useApiClient from 'hooks/useApiClient';
import useFetchData from 'hooks/useFetchData';
import CaseNotesTab from './CaseNotesTab';
import AssessmentsTab from './AssessmentsTab';

export default function EnrollmentDetails({ title, children, enrollmentid }) {
  console.log(enrollmentid);
  const history = useHistory();
  const [urlParams, queryParams, fragment] = useUrlParams();
  const apiClient = useApiClient();
  const [data, error, loading] = useFetchData(`/programs/enrollments/${enrollmentid}`, {});
  console.log(data);
  if (typeof data.program !== 'undefined') {

    //}
    title = data.program.name;
    //const { data } = useResource(`/programs/enrollments/?id=${urlParams.id}/`);
    //console.log(result.data);
    const tabPanesEnrollments = [
      {
        menuItem: 'Summary',
        key: 6,
        render: () => (
          <Tab.Pane>
            <SummaryTab enrolldata={data} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Assessments',
        key: 7,
        render: () => (
          <Tab.Pane>
            <AssessmentsTab enrolldata={data} />
          </Tab.Pane>
        ),
      },,
      {
        menuItem: 'Case Notes',
        key: 8,
        render: () => (
          <Tab.Pane>
            <CaseNotesTab enrolldata={data} />
          </Tab.Pane>
        ),
      },
    ];

    function renderLoading() {
      return <Loader active inline="centered" />;
    }
    function renderError() {
      let message = error;
      if (typeof error !== 'string') {
        message = JSON.stringify(error);
      }
      return <Message error>{`${message}`}</Message>;
    }

    return (
      <Grid
        style={{
          background: '#fff',
          margin: 0,
          padding: 30,
          minHeight: '50vh',
        }}
      >
        <Grid.Column>
          {title && <Header as="h5">{title}</Header>}
          {loading ? renderLoading() : error ? renderError() : children}
        </Grid.Column>
        <Grid.Column computer={16} mobile={16}>
          <Tab
            forceRenderTabPanel
            panes={tabPanesEnrollments}
            defaultIndex={0}
            //activeIndex={fragment || 0}
            onTabChange={(event, { activeIndex }) => {
              //history.push(`${window.location.pathname}#${activeIndex}`);
            }}
          />
        </Grid.Column>
      </Grid>
    );
  }else{
    return null;
  }
}
