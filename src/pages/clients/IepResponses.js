import React, { useContext } from 'react';
import { Grid } from 'semantic-ui-react';
import { hasPermission } from 'utils/permissions';
import { formatOwner } from 'utils/modelUtils';
import { formatDateTime } from 'utils/typeUtils';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import PaginatedDataTable from 'components/PaginatedDataTable';
import { NavLink } from 'react-router-dom';
import { AppContext } from 'AppStore';
import { EditActionLink } from '../../components/tableComponents';
import { clientFullName } from 'utils/modelUtils';

export default function IepResponses({ iepId, surveyId }) {
    console.log("on change follower", iepId);
    console.log("on change follower", surveyId);
    const [{ user }] = useContext(AppContext);
    const responsesTable = usePaginatedDataTable({
        url: `/responses/?context=${iepId}`,
    });
    const responsesColumns = React.useMemo(
        () => [
            {
                Header: 'Assessment Type',
                accessor: 'survey',
                Cell: ({ value, row }) => {
                    return (
                        <NavLink to={`/responses/${row.original.id}`}>{value.name}</NavLink>
                    );
                },
            },
            // {
            //     Header: 'Answers',
            //     accessor: 'answers',
            //     Cell: ({ value, row }) => {
            //         return value.length;
            //     },
            // },
            {
                Header: 'Date Created',
                accessor: 'created_at',
                Cell: ({ value }) => formatDateTime(value, true),
            },
            {
                Header: 'Date Modified',
                accessor: 'modified_at',
                Cell: ({ value }) => formatDateTime(value, true),
            },
            {
                Header: 'User Updating',
                accessor: 'created_by',
                Cell: ({ value }) => formatOwner(value),
            },
            {
                Header: 'Actions',
                accessor: 'actions',
                Cell: ({ row }) => (
                    <>
                        <EditActionLink
                            to={`/responses/${row.original.id}/edit`}
                            exact
                            disabled={!hasPermission(user, 'survey.change_response')}
                        />
                    </>
                ),
            },
        ],
        []
    );

    return (
        <Grid
            style={{
                background: '#fff',
                margin: 0,
                padding: 0,
                minHeight: '30vh',
            }}
        >
            <Grid.Column computer={16} mobile={16}>
                <PaginatedDataTable columns={responsesColumns} table={responsesTable} />
            </Grid.Column>
        </Grid>
    );

}