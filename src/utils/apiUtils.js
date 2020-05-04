export function formatApiError(error) {
  return error && `(${error.status}) ${error.data.detail}`;
}
