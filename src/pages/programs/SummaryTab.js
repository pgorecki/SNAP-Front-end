import React from 'react';
import { Grid, Label, Table, Modal } from 'semantic-ui-react';
import { formatDate, formatDateTime, FieldError } from 'utils/typeUtils';
import { LabelField } from 'components/common';

export default function SummaryTab({ enrollData }) {
    return (
        <>
            <Grid >
                <Grid.Column computer={16} mobile={16}>
                    <LabelField label="Status" value={enrollData["status"]} valColor="#20B2AA"></LabelField>
                </Grid.Column>
                <Grid.Column computer={5} mobile={16}>
                    <LabelField label="Start Date" value={formatDate(enrollData["start_date"])}></LabelField>
                </Grid.Column>
                <Grid.Column computer={5} mobile={16}>
                    <LabelField label="Projected End Date" value={enrollData["projected_end_date"] == null ? null : formatDate(enrollData["projected_end_date"])}></LabelField>
                </Grid.Column>
                <Grid.Column computer={5} mobile={16}>
                    <LabelField label="Actual End Date" value={enrollData["end_date"] == null ? null : formatDate(enrollData["end_date"])}></LabelField>
                </Grid.Column>
            </Grid>
        </>);
}