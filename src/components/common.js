import React from 'react';
import { Label, Message } from 'semantic-ui-react';

export function ErrorMessage({ error }) {
  let message = error;
  if (typeof error !== 'string') {
    message = JSON.stringify(error);
  }
  return error ? <Message error>{`${message}`}</Message> : null;
}

export function EligibilityStatus({ value }) {
  if (!value) {
    return 'n/a';
  }
  switch (value) {
    case 'ELIGIBLE':
      return <Label color="green">Eligible</Label>;
    case 'NOT_ELIGIBLE':
      return <Label color="red">Not eligible</Label>;
    default:
      return <Label>{value}</Label>;
  }
}

export function IEPStatus({ value }) {
  if (!value) {
    return 'n/a';
  }
  switch (value) {
    case 'awaiting_approval':
      return <Label>Avaiting approval</Label>;
    case 'not_eligible':
      return <Label color="red">Not eligible</Label>;
    case 'in_orientation':
      return <Label color="yellow">In orientation</Label>;
    case 'in_planning':
      return <Label color="yellow">In planning</Label>;
    case 'in_progress':
      return <Label color="green">In progress</Label>;
    case 'ended':
      return <Label color="green">Ended</Label>;
    default:
      return <Label>{value}</Label>;
  }
}
