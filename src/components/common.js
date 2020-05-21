import React from 'react';
import { Message } from 'semantic-ui-react';

export function ErrorMessage({ error }) {
  let message = error;
  if (typeof error !== 'string') {
    message = JSON.stringify(error);
  }
  return error ? <Message error>{`${message}`}</Message> : null;
}
