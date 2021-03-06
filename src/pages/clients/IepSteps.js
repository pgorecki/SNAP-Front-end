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
import useApiClient from 'hooks/useApiClient';
import { formatApiError } from 'utils/apiUtils';
import toaster from 'components/toaster';
import { InProgressStep } from './InProgressStep';
import moment from 'moment';

export default function IepSteps({ ieprow }) {
  console.log(ieprow);
  //console.log(handleClose);
  var values = ieprow.values;
  const apiClient = useApiClient();
  // const [
  //   existingEnrollmentPrograms,
  //   setExistingEnrollmentPrograms,
  // ] = useState();

  // const ieptable = usePaginatedDataTable({
  //   url: `/iep/?client=${ieprow.original}`,
  // });

  const [isEligibleActive, setIsEligibleActive] = useState(
    values.status === 'awaiting_approval'
      ? true
      : false
  );
  const [isEligibleDisabled, setIsEligibleDisabled] = useState(
    values.status === 'awaiting_approval'
      ? false
      : true
  );
  const [isEligibleCompleted, setIsEligibleCompleted] = useState(
    values.status === 'awaiting_approval'
      ? false
      : values.status === 'in_orientation'
        ? true
        : values.status === 'not_eligible'
          ? false
          : true
  );

  // const [isEligibleActive, setIsEligibleActive] = useState((values.status) === "awaiting_approval" ? true : false);
  // const [isEligibleDisabled, setIsEligibleDisabled] = useState((values.status) === "awaiting_approval" ? false : true);
  // const [isEligibleCompleted, setIsEligibleCompleted] = useState((values.status) === "awaiting_approval" ? false : (values.status) === "in_orientation" ? true : true);

  const [isOrientOpened, setIsOrientOpened] = useState(
    values.status === 'in_orientation' ? true : false
  );
  const [isOrientDisabled, setIsOrientDisabled] = useState(
    values.status === 'in_orientation' ? false : true
  );
  const [isOrientCompleted, setIsOrientCompleted] = useState(
    values.status === 'in_orientation'
      ? false
      : values.status === 'in_planning'
        ? true
        : values.status === 'not_eligible'
          ? false
          : values.status === 'in_progress'
            ? true
            : values.status === 'awaiting_approval'
              ? false
              : true
  );

  const [isIepOpened, setIsIepOpened] = useState(
    values.status === 'in_planning' ? true : false
  );
  const [isIepDisabled, setIsIepDisabled] = useState(
    values.status === 'in_planning' ? false : true
  );
  const [isIepCompleted, setIsIepCompleted] = useState(
    values.status === 'in_planning'
      ? false
      : values.status === 'in_progress'
        ? true
        : values.status === 'in_orientation'
          ? false
          : values.status === 'not_eligible'
            ? false
            : values.status === 'awaiting_approval'
              ? false
              : true
  );

  const [isInProgressActive, setIsInProgressActive] = useState(
    values.status === 'in_progress' ? true : false
  );
  const [isInProgressDisabled, setIsInProgressDisabled] = useState(
    values.status === 'in_progress' ? false : true
  );
  const [isInProgressCompleted, setIsInProgressCompleted] = useState(
    values.status === 'in_progress'
      ? false
      : values.status === 'in_orientation'
        ? false
        : values.status === 'in_planning'
          ? false
          : values.status === 'not_eligible'
            ? false
            : values.status === 'awaiting_approval'
              ? false
              : true
  );

  const [isEndActive, setIsEndActive] = useState(
    values.status === 'not_eligible' || values.status === 'ended' ? true : false
  );
  const [isEndDisabled, setIsEndDisabled] = useState(
    values.status === 'not_eligible' || values.status === 'ended' ? false : true
  );
  const [isEndCompleted, setIsEndCompleted] = useState(
    values.status === 'not_eligible' || values.status === 'ended'
      ? true
      : values.status === 'in_orientation'
        ? false
        : values.status === 'in_planning'
          ? false
          : values.status === 'awaiting_approval'
            ? false
            : values.status === 'in_progress'
              ? false
              : true
  );

  const [listInitialPrograms, setListInitialPrograms] = useState(null);

  async function ConfirmOrientationButton() {
    try {
      const { id } = ieprow.original;
      await apiClient.patch(`/iep/${id}/`, {
        orientation_completed: true,
        status: 'in_planning',
      });
    } catch (err) {
      const apiError = formatApiError(err.response);
      toaster.error(apiError);
    } finally {
      //ieptable.reload();
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

      setIsEndActive(false);
      setIsEndDisabled(true);
      setIsEndCompleted(false);
    }
  }

  async function ConfirmIEPEnd() {
    const { id } = ieprow.original;
    const clientIEP = await apiClient.get(
      `/iep/${id}`
    );
    const existingEnrolmments = clientIEP.data.enrollments;

    if (existingEnrolmments.find(x => x.status === 'ENROLLED')) {
      toaster.error("Please end your individual enrollments first");
    } else {
      try {
        await apiClient.patch(`/iep/${id}/`, {
          end_date: moment(new Date()).format('YYYY-MM-DD'),
          status: 'ended',
        });
      } catch (err) {
        const apiError = formatApiError(err.response);
        toaster.error(apiError);
      } finally {
        //ieptable.reload();
        setIsEligibleActive(false);
        setIsEligibleDisabled(true);
        setIsEligibleCompleted(true);

        setIsOrientOpened(false);
        setIsOrientDisabled(true);
        setIsOrientCompleted(true);

        setIsIepOpened(false);
        setIsIepDisabled(true);
        setIsIepCompleted(true);

        setIsInProgressActive(false);
        setIsInProgressDisabled(true);
        setIsInProgressCompleted(true);

        setIsEndActive(true);
        setIsEndDisabled(true);
        setIsEndCompleted(true);
      }
    }
  }

  async function ModifyOkButton(checkPrograms) {
    //console.log(checkPrograms);
    setListInitialPrograms(checkPrograms);
    //const [listPrograms, setListPrograms] = useState(checkPrograms);
    try {
      const { id } = ieprow.original;
      await apiClient.patch(`/iep/${id}/`, {
        orientation_completed: true,
        status: 'in_progress',
      });
    } catch (err) {
      const apiError = formatApiError(err.response);
      toaster.error(apiError);
    } finally {
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

      setIsEndActive(false);
      setIsEndDisabled(true);
      setIsEndCompleted(false);
    }
  }

  async function ModifyPOkButton(checkPrograms) {
    setListInitialPrograms(checkPrograms);
  }

  function Orientation() {
    //console.log(values);
    if (values.status === 'not_eligible') {
      setIsEligibleActive(false);
      setIsEligibleDisabled(true);
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

      setIsEndActive(true);
      setIsEndDisabled(true);
      setIsEndCompleted(true);
    } else if (values.status === 'in_orientation') {
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

      setIsEndActive(false);
      setIsEndDisabled(true);
      setIsEndCompleted(false);
    } else if (values.status === 'in_planning') {
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

      setIsEndActive(false);
      setIsEndDisabled(true);
      setIsEndCompleted(false);
    } else if (values.status === 'in_progress') {
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

      setIsEndActive(false);
      setIsEndDisabled(true);
      setIsEndCompleted(false);
    } else if (values.status === 'ended') {
      setIsEligibleActive(false);
      setIsEligibleDisabled(true);
      setIsEligibleCompleted(true);

      setIsOrientOpened(false);
      setIsOrientDisabled(true);
      setIsOrientCompleted(true);

      setIsIepOpened(false);
      setIsIepDisabled(true);
      setIsIepCompleted(true);

      setIsInProgressActive(false);
      setIsInProgressDisabled(true);
      setIsInProgressCompleted(true);

      setIsEndActive(true);
      setIsEndDisabled(true);
      setIsEndCompleted(true);
    }
  }

  return (
    <>
      <Step.Group ordered fluid>
        <Step
          onClick={Orientation}
          active={isEligibleActive}
          completed={isEligibleCompleted}
          disabled={isEligibleDisabled}
        >
          <Step.Content>
            <Step.Title as={'a'}>Eligibility</Step.Title>
            <Step.Description>eligible</Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={Orientation}
          active={isOrientOpened}
          completed={isOrientCompleted}
          disabled={isOrientDisabled}
        >
          <Step.Content>
            <Step.Title as={'a'}>Orientation</Step.Title>
            <Step.Description>in orientation</Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={Orientation}
          active={isIepOpened}
          completed={isIepCompleted}
          disabled={isIepDisabled}
        >
          <Step.Content>
            <Step.Title as={'a'}>IEP Planning</Step.Title>
            <Step.Description>in planning</Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={Orientation}
          active={isInProgressActive}
          completed={isInProgressCompleted}
          disabled={isInProgressDisabled}
        >
          <Step.Content>
            <Step.Title as={'a'}>Enrolled</Step.Title>
            <Step.Description>Taking Customer service program</Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={Orientation}
          active={isEndActive}
          completed={isEndCompleted}
          disabled={isEndDisabled}
        >
          <Step.Content>
            <Step.Title as={'a'}>Done</Step.Title>
            <Step.Description></Step.Description>
          </Step.Content>
        </Step>
      </Step.Group>

      {
        isEligibleActive
        // &&
        // (<OrientationStep />)
      }
      {isOrientOpened && (
        <OrientationStep
          client={ieprow.original}
          confirmOrientationClicked={ConfirmOrientationButton}
          confirmEndIEPClicked={ConfirmIEPEnd}
        />
      )}
      {isIepOpened && (
        <PlanningStep
          client={ieprow.original}
          modifyOkButtonClicked={ModifyOkButton}
          confirmEndIEPClicked={ConfirmIEPEnd}
        />
      )}
      {isInProgressActive && (
        <InProgressStep
          reloadOrientation={Orientation}
          client={ieprow.original}
          listPrograms={listInitialPrograms}
          modifyOkButtonClicked={ModifyPOkButton}
          confirmEndIEPClicked={ConfirmIEPEnd}
        />
      )}
      {/* {
        isEndActive &&
        (<PlanningStep />)
      } */}
    </>
  );
}
