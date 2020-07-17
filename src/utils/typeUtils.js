import moment from 'moment';

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

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

export class FieldError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
    this.response = {
      status: 400,
      data: {
        [name]: message,
      },
    };
  }
}
