export function formatApiError(error) {
  return error && `(${error.status}) ${error.data.detail}`;
}

export function apiErrorToFormError(error) {
  const { data, status } = error.response;

  const key = `${status} server error`;

  if (typeof data === 'string') {
    return {
      [key]: data,
    };
  }
  return data;
}
