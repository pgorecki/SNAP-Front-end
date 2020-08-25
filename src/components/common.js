import React from 'react';
import { Label, Message } from 'semantic-ui-react';

export function ErrorMessage({ error }) {
  let message = error;
  if (typeof error !== 'string') {
    message = JSON.stringify(error);
  }
  return error ? <Message error>{`${message}`}</Message> : null;
}

export function EligibilityLabel({ value }) {
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
