import React from 'react';
import { Grid, Label, Table, Modal } from 'semantic-ui-react';
import { formatDateTime, FieldError } from 'utils/typeUtils';
import { LabelField } from 'components/common';

export default function SummaryTab({ enrolldata }) {
    return (
        <>
            <Grid >
                <Grid.Column computer={16} mobile={16}>
                    <LabelField label="Status" value={enrolldata.status} valColor="#20B2AA"></LabelField>
                </Grid.Column>
                <Grid.Column computer={5} mobile={16}>
                    <LabelField label="Start Date" value={formatDateTime(enrolldata.created_at, true)}></LabelField>
                </Grid.Column>
                <Grid.Column computer={5} mobile={16}>
                    <LabelField label="Projected End Date" value={formatDateTime(new Date(), true)}></LabelField>
                </Grid.Column>
                <Grid.Column computer={5} mobile={16}>
                    <LabelField label="Actual End Date" value={null}></LabelField>
                </Grid.Column>
            </Grid>
        </>);
}