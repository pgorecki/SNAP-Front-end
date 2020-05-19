export function formatApiError(error) {
  return error && `(${error.status}) ${error.data.detail}`;
}

export function apiErrorToFormError(error) {
  if (!error.response) {
    // this is not API error
    return {
      [error.name]: error.message || error.reason,
    };
  }

  const { data, status } = error.response;

  const key = `${status} server error`;

  if (typeof data === 'string') {
    return {
      [key]: data,
    };
  }
  return data;
}
