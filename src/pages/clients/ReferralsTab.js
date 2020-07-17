import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import {
  Form,
  Button,
  Header,
  Step,
  Segment,
  List,
  Radio,
  FormTextArea,
} from 'semantic-ui-react';
import {
  FormInput,
  FormSelect,
  FormDatePicker,
  FormErrors,
} from 'components/FormFields';
import useResourceIndex from 'hooks/useResourceIndex';
import useNewResource from 'hooks/useNewResource';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import { formatOwner } from 'utils/modelUtils';
import { formatDateTime } from 'utils/typeUtils';
import useApiClient from 'hooks/useApiClient';
import toaster from 'components/toaster';
import moment from 'moment';

function getNextMatchingStep(clientMatching) {
  const { history, config } = clientMatching;
  if (history.length === 0) {
    return config.config.steps[0].id;
  }

  // latest history entry is first on a list
  const latestCompletedStep = history[0].step;

  const idx = config.config.steps.findIndex((x) => x.id == latestCompletedStep);

  console.log(latestCompletedStep, idx);

  const nextStep = config.config.steps[idx + 1];

  return nextStep
    ? nextStep.id
    : config.config.steps[config.config.steps.length - 1].id;
}

function NewReferralForm({ client, programs }) {
  const { data, error, save } = useNewResource('/matching/');

  const options = programs.map(({ id, name }) => ({ value: id, text: name }));

  return (
    <>
      <Header as="h4">New Referral</Header>
      <Formik
        initialValues={{
          client: null,
          program: null,
          start_date: null,
        }}
        onSubmit={async (values, actions) => {
          console.log(values);
          try {
            await save(values);
          } catch (err) {
            actions.setErrors(apiErrorToFormError(err));
          }
          actions.setSubmitting(false);
        }}
      >
        {(form) => (
          <Form error onSubmit={form.handleSubmit}>
            <FormSelect
              label="Program"
              name="program"
              placeholder="Select program"
              options={options}
              required
              form={form}
            />
            <FormDatePicker
              label="Start date"
              name="start_date"
              form={form}
              required
            />
            <FormErrors form={form} />
            <Button primary type="submit" disabled={form.isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

function StepPicker({ steps, activeStep, onClick }) {
  return (
    <Step.Group ordered fluid>
      {steps.map(({ step, history, isCompleted, isCurrent, isFuture }) => (
        <Step
          key={step.id}
          completed={isCompleted}
          active={activeStep == step.id}
          disabled={isFuture}
          onClick={() => onClick(step.id)}
        >
          <Step.Content>
            <Step.Title as={'a'}>{step.title}</Step.Title>
            <Step.Description>
              {isCurrent ? '' : null}
              {history ? history.outcome : ''}
            </Step.Description>
          </Step.Content>
        </Step>
      ))}
    </Step.Group>
  );
}

function StepDetails({
  currentStep,
  step,
  canSkip,
  canEnd,
  history,
  notes,
  onNextStep,
  onEndReferral,
  onReset,
}) {
  const [outcome, setOutcome] = useState(null);
  const { options = [] } = step;

  useEffect(() => {
    setOutcome(history.length ? history[0].outcome : null);
  }, [step.id]);

  const isLastStep = step.lastStep;
  const stepIncomplete = options.length && !outcome;

  const actionButtons = (
    <>
      {canSkip && !isLastStep ? (
        <Button
          primary
          onClick={(e) => e.preventDefault() || onNextStep(step.id, 'skipped')}
        >
          Skip this step
        </Button>
      ) : null}
      {!isLastStep ? (
        <Button
          primary
          disabled={stepIncomplete}
          onClick={(e) =>
            e.preventDefault() || onNextStep(step.id, outcome || 'completed')
          }
        >
          Next step
        </Button>
      ) : null}
      {canEnd ? (
        <Button
          primary
          disabled={stepIncomplete}
          onClick={(e) =>
            e.preventDefault() || onEndReferral(step.id, outcome || 'completed')
          }
        >
          End referral
        </Button>
      ) : null}
    </>
  );
  const resetButton = (
    <Button onClick={() => onReset()}>Go to current step</Button>
  );

  return (
    <>
      <Segment>
        <Header as="h4">{step.title}</Header>
        <Form>
          {options.length
            ? options.map((option) => (
                <Form.Field key={option}>
                  <Radio
                    label={option}
                    name="outcome"
                    disabled={history.length}
                    value={option}
                    checked={outcome === option}
                    onChange={() => setOutcome(option)}
                  />
                </Form.Field>
              ))
            : null}
          {currentStep == step.id ? actionButtons : resetButton}
        </Form>
      </Segment>
      <br />
      <Header as="h4">Client Referral Decision notes</Header>
      <List divided relaxed>
        {notes.map(({ id, note, created_by, created_at }) => (
          <List.Item key={id}>
            <List.Icon name="sticky note outline" verticalAlign="top" />
            <List.Content>
              <List.Header>{note}</List.Header>
              <List.Description>
                {formatOwner(created_by)} on {formatDateTime(created_at)}
              </List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
      <Form>
        <FormTextArea label="Add new note" />
        <Button disabled>Add note</Button>
      </Form>
    </>
  );
}

export default function ReferralsTab() {
  const apiClient = useApiClient();
  const programIndex = useResourceIndex('/programs/');
  const configIndex = useResourceIndex('/matching/config/');
  const matchingIndex = useResourceIndex('/matching/');
  const [selectedStep, setSelectedStep] = useState(null);

  const ready = programIndex.ready && matchingIndex.ready && configIndex.ready;

  if (!ready) return null;

  if (matchingIndex.data.length === 0) {
    return 'No matching for client';
  }

  const clientMatching = matchingIndex.data[0];

  const { config, history, notes, program } = clientMatching;

  // if (matchingIndex.data.length === 0) {
  //   return <NewReferralForm client={client} programs={programIndex.data} />;
  // }

  const currentStep = getNextMatchingStep(clientMatching);

  let phase = -1;
  const stepData = (config.config.steps || []).map((step) => {
    const historyForStep = history.find((h) => h.step == step.id);

    if (currentStep == step.id) {
      phase = 0;
    }

    const s = {
      step,
      history: historyForStep || null,
      isCompleted: phase < 0,
      isCurrent: phase === 0,
      isFuture: phase > 0,
    };

    if (phase === 0) {
      phase = 1;
    }
    return s;
  });

  const activeStep = selectedStep || currentStep;

  const activeStepDetails = {
    activeStep,
    step: config.config.steps.find((x) => x.id == activeStep),
    history: history.filter((x) => x.step == activeStep),
    notes: notes.filter((x) => x.step == activeStep),
  };

  return (
    <>
      <p>
        Refferral to <strong>{program.name}</strong> is in progress.
      </p>
      <StepPicker
        steps={stepData}
        activeStep={activeStep}
        onClick={(stepId) => setSelectedStep(stepId)}
      />
      <StepDetails
        currentStep={currentStep}
        step={activeStepDetails.step}
        canAddNotes={activeStepDetails.step.notes}
        canSkip={activeStepDetails.step.notes}
        canEnd={activeStepDetails.step.end}
        history={activeStepDetails.history}
        notes={activeStepDetails.notes}
        filtes={[]}
        onNextStep={async (step, outcome) => {
          // add matching history for current step
          try {
            await apiClient.post(`/matching/${clientMatching.id}/history/`, {
              step,
              outcome,
            });
            toaster.success('Step completed');
            await matchingIndex.fetchData();
          } catch (err) {
            const apiError = formatApiError(err.response);
            toaster.error(apiError);
          }
        }}
        onEndReferral={async (step, outcome) => {
          try {
            await apiClient.post(`/matching/${clientMatching.id}/history/`, {
              step,
              outcome,
            });
            await apiClient.patch(`/matching/${clientMatching.id}/`, {
              end_date: moment().format('YYYY-MM-DD'),
            });
            toaster.success('Referral ended');
            await matchingIndex.fetchData();
          } catch (err) {
            const apiError = formatApiError(err.response);
            toaster.error(apiError);
          }
        }}
        onReset={() => setSelectedStep(currentStep)}
      />
    </>
  );
}
