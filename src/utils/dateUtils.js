import React from 'react';
import moment from 'moment';

export function formatDateTime(value, ago = false) {
  const date = moment(value);
  const formatted = date.format('MM/DD/YYYY h:mm A');
  return ago ? `${formatted} (${date.fromNow()})` : formatted;
}

export function formatDate(value, ago = false) {
  const date = moment(value);
  const formatted = date.format('MM/DD/YYYY');
  return ago ? `${formatted} (${date.fromNow()})` : formatted;
}
