import React from 'react';
import { Grid, Statistic, Segment, Icon } from 'semantic-ui-react';
import useResource from '../../hooks/useResource';
import { formatApiError } from '../../utils/apiUtils';
import DetailsPage from '../DetailsPage';
import { NavLink } from 'react-router-dom';

function DashboardStat({ icon, label, value, href }) {
  return (
    <Segment style={{ textAlign: 'center' }}>
      <Statistic as={NavLink} to={href}>
        <Statistic.Value>
          {value}
          {/* {icon && <Icon name={icon} size="small" color="grey" />} */}
        </Statistic.Value>
        <Statistic.Label>{label}</Statistic.Label>
      </Statistic>
    </Segment>
  );
}

export default function DashboardPage() {
  const { data, error, loading } = useResource('/dashboard/summary/', {});

  console.log(data);

  return (
    <div title="Dashboard" loading={loading} error={formatApiError(error)}>
      <Grid>
        <Grid.Column computer={4} mobile={16}>
          <DashboardStat
            icon="address card outline"
            label="Participants"
            value={data.clients}
            href="/clients"
          />
        </Grid.Column>
        <Grid.Column computer={4} mobile={16}>
          <DashboardStat
            icon="comment outline"
            label="Responses"
            value={data.responses}
            href="/responses"
          />
        </Grid.Column>
        <Grid.Column computer={4} mobile={16}>
          <DashboardStat
            icon="file alternate outline"
            label="Surveys"
            value={data.surveys}
            href="/surveys"
          />
        </Grid.Column>
        <Grid.Column computer={4} mobile={16}>
          <DashboardStat
            icon="question"
            label="Questions"
            value={data.questions}
            href="/questions"
          />
        </Grid.Column>
      </Grid>
    </div>
  );
}
