import { itemsToArray } from '../pages/surveys/computations.js';

export function formatApiError(response) {
  // pass error.response from API exception
  if (!response) return null;
  const detail = response.data.detail || JSON.stringify(response.data);
  return `(${response.status}) ${detail}`;
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

export function getSurveyValuesFromResponse(response, survey) {
  const items = itemsToArray(survey.definition);
  return response.answers.reduce((all, ans) => {
    console.log(ans.question.id, items);
    const questionItem =
      items.find((i) => ans.question.id === i.questionId) || {};
    return { ...all, [questionItem.id]: ans.value };
  }, {});
}
