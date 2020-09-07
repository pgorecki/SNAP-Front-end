import React from 'react';
// import ReactDOM from 'react-dom';
import { Button, Form, Header, Step, Modal } from 'semantic-ui-react';
import { NavLink, useHistory } from 'react-router-dom';
import { ErrorMessage } from 'components/common';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import PaginatedDataTable from 'components/PaginatedDataTable';
import { EditActionLink } from 'components/tableComponents';
import { formatDateTime } from 'utils/typeUtils';
import { formatOwner } from 'utils/modelUtils';
import { useState } from 'react';
import { OrientationStep } from './OrientationStep';
import { PlanningStep } from './PlanningStep';

export default function TestTab({ values }) {

  const [isEligibleActive, setIsEligibleActive] = useState((values.status) === "not_eligible" || (values.status) === "awaiting_approval" ? true : false);
  const [isEligibleDisabled, setIsEligibleDisabled] = useState((values.status) === "not_eligible" || (values.status) === "awaiting_approval" ? false : true);
  const [isEligibleCompleted, setIsEligibleCompleted] = useState((values.status) === "not_eligible" || (values.status) === "awaiting_approval" ? false : (values.status) === "in_orientation" ? true : true);

  // const [isEligibleActive, setIsEligibleActive] = useState((values.status) === "awaiting_approval" ? true : false);
  // const [isEligibleDisabled, setIsEligibleDisabled] = useState((values.status) === "awaiting_approval" ? false : true);
  // const [isEligibleCompleted, setIsEligibleCompleted] = useState((values.status) === "awaiting_approval" ? false : (values.status) === "in_orientation" ? true : true);

  const [isOrientOpened, setIsOrientOpened] = useState((values.status) === "in_orientation" ? true : false);
  const [isOrientDisabled, setIsOrientDisabled] = useState((values.status) === "in_orientation" ? false : true);
  const [isOrientCompleted, setIsOrientCompleted] = useState((values.status) === "in_orientation" ? false : (values.status) === "in_planning" ? true : (values.status) === "not_eligible" ? false : (values.status) === "in_progress" ? true : (values.status) === "awaiting_approval" ? false : true);

  const [isIepOpened, setIsIepOpened] = useState((values.status) === "in_planning" ? true : false);
  const [isIepDisabled, setIsIepDisabled] = useState((values.status) === "in_planning" ? false : true);
  const [isIepCompleted, setIsIepCompleted] = useState((values.status) === "in_planning" ? false : (values.status) === "in_progress" ? true : (values.status) === "in_orientation" ? false : (values.status) === "not_eligible" ? false : (values.status) === "awaiting_approval" ? false : true);

  const [isInProgressActive, setIsInProgressActive] = useState((values.status) === "in_progress" ? true : false);
  const [isInProgressDisabled, setIsInProgressDisabled] = useState((values.status) === "in_progress" ? false : true);
  const [isInProgressCompleted, setIsInProgressCompleted] = useState((values.status) === "in_progress" ? false : (values.status) === "in_orientation" ? false : (values.status) === "in_planning" ? false : (values.status) === "not_eligible" ? false : (values.status) === "awaiting_approval" ? false : true);

  const table = usePaginatedDataTable({
    url: '/responses/',
  });
  const columns = React.useMemo(
    () => [
      {
        Header: 'Survey',
        accessor: 'id',
        Cell: ({ value, row }) => {
          return (
            <NavLink to={`/responses/${value}`}>
              {row.original.survey.name}
            </NavLink>
          );
        },
      },
      {
        Header: 'Answers',
        accessor: 'answers',
        Cell: ({ value, row }) => {
          return value.length;
        },
      },
      {
        Header: 'Date Created',
        accessor: 'created_at',
        Cell: ({ value }) => formatDateTime(value, true),
      },
      {
        Header: 'Date Modified',
        accessor: 'modified_at',
        sortType: 'basic',
        Cell: ({ value }) => formatDateTime(value, true),
      },
      {
        Header: 'Created By',
        accessor: 'created_by',
        Cell: ({ value }) => formatOwner(value),
      },
      {
        Header: 'Actions',
        disableSortBy: true,
        accessor: 'actions',
        Cell: ({ row, actions }) => (
          <>
            <Button
              onClick={(...args) => {
                table.updateRow(row, {
                  answers: [...row.original.answers, {}],
                  modified_at: new Date(),
                });
              }}
            >
              Update row
            </Button>
            <Button
              onClick={(...args) => {
                table.reload();
              }}
            >
              Reload
            </Button>
          </>
        ),
      },
    ],
    []
  );

  function Orientation() {
    console.log(values);
    if ((values.status) === "not_eligible") {
      setIsEligibleActive(true);
      setIsEligibleDisabled(false);
      setIsEligibleCompleted(false);

      setIsOrientOpened(false);
      setIsOrientDisabled(true);
      setIsOrientCompleted(false);

      setIsIepOpened(false);
      setIsIepDisabled(true);
      setIsIepCompleted(false);

      setIsInProgressActive(false);
      setIsInProgressDisabled(true);
      setIsInProgressCompleted(false);
    }
    else if ((values.status) === "in_orientation") {
      setIsEligibleActive(false);
      setIsEligibleDisabled(true);
      setIsEligibleCompleted(true);

      setIsOrientOpened(true);
      setIsOrientDisabled(false);
      setIsOrientCompleted(false);

      setIsIepOpened(false);
      setIsIepDisabled(true);
      setIsIepCompleted(false);

      setIsInProgressActive(false);
      setIsInProgressDisabled(true);
      setIsInProgressCompleted(false);

    } else if ((values.status) === "in_planning") {
      setIsEligibleActive(false);
      setIsEligibleDisabled(true);
      setIsEligibleCompleted(true);

      setIsOrientOpened(false);
      setIsOrientDisabled(true);
      setIsOrientCompleted(true);

      setIsIepOpened(true);
      setIsIepDisabled(false);
      setIsIepCompleted(false);

      setIsInProgressActive(false);
      setIsInProgressDisabled(true);
      setIsInProgressCompleted(false);

    } else if ((values.status) === "in_progress") {
      setIsEligibleActive(false);
      setIsEligibleDisabled(true);
      setIsEligibleCompleted(true);

      setIsOrientOpened(false);
      setIsOrientDisabled(true);
      setIsOrientCompleted(true);

      setIsIepOpened(false);
      setIsIepDisabled(true);
      setIsIepCompleted(true);

      setIsInProgressActive(true);
      setIsInProgressDisabled(false);
      setIsInProgressCompleted(false);
    }
  }

  return (
    <>
      <Step.Group ordered fluid>
        <Step onClick={Orientation} active={isEligibleActive} completed={isEligibleCompleted} disabled={isEligibleDisabled}>
          <Step.Content>
            <Step.Title as={'a'}>Eligibility</Step.Title>
            <Step.Description>eligible</Step.Description>
          </Step.Content>
        </Step>
        <Step onClick={Orientation} active={isOrientOpened} completed={isOrientCompleted} disabled={isOrientDisabled}>
          <Step.Content>
            <Step.Title as={'a'}>Orientation</Step.Title>
            <Step.Description>in orientation</Step.Description>
          </Step.Content>
        </Step>
        <Step onClick={Orientation} active={isIepOpened} completed={isIepCompleted} disabled={isIepDisabled}>
          <Step.Content>
            <Step.Title as={'a'}>IEP Planning</Step.Title>
            <Step.Description>in planning</Step.Description>
          </Step.Content>
        </Step>
        <Step onClick={Orientation} active={isInProgressActive} completed={isInProgressCompleted} disabled={isInProgressDisabled}>
          <Step.Content>
            <Step.Title as={'a'}>Enrolled</Step.Title>
            <Step.Description>Taking Customer service program</Step.Description>
          </Step.Content>
        </Step>
        <Step disabled>
          <Step.Content>
            <Step.Title as={'a'}>Done</Step.Title>
            <Step.Description></Step.Description>
          </Step.Content>
        </Step>
      </Step.Group>

      {
        isEligibleActive &&
        (<OrientationStep />)
      }
      {
        isOrientOpened &&
        (<OrientationStep />)
      }
      {
        isIepOpened &&
        (<PlanningStep />)
      }
      {
        isInProgressActive &&
        (<PlanningStep />)
      }

    </>
  );
}