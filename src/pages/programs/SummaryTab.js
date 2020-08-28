import React from 'react';
import { Grid, Label } from 'semantic-ui-react';
import moment from 'moment';

export default function SummaryTab({ enrolldata }) {
    //console.log(enrolldata);
    return (
        <>
            <Grid>
                <Grid.Column computer={16} mobile={16}>
                    <label>Status: </label><label style={{ color: "green" }}>{enrolldata.status}</label>
                </Grid.Column>
                <Grid.Column computer={5} mobile={16}>
                    <label>Start Date: </label><label>{moment(enrolldata.created_at).format('MM-DD-YYYY')}</label>
                </Grid.Column>
                <Grid.Column computer={5} mobile={16}>
                    <label>Projected End Date: </label><label>{moment(new Date()).format('MM-DD-YYYY')}</label>
                </Grid.Column>
                <Grid.Column computer={5} mobile={16}>
                    <label>Actual End Date: </label><label>{"N/A"}</label>
                </Grid.Column>
            </Grid>
        </>
    );
}