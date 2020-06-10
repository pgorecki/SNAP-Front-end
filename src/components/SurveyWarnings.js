import React from 'react';
import { Message } from 'semantic-ui-react';
import { itemsToArray } from 'pages/surveys/computations';

export default function SurveyWarnings({ survey, response }) {
  const warnings = [];
  if (survey.modified_at > response.modified_at) {
    warnings.push('Survey was modified after response was submitted');
  }

  const notSubmittableQuestions =
    survey && survey.definition
      ? itemsToArray(survey.definition).filter(
          (item) => item.type === 'question' && !item.questionId
        )
      : [];

  if (notSubmittableQuestions.length) {
    const titles = notSubmittableQuestions
      .map((q) => q.title || q.id)
      .join(', ');
    warnings.push(
      `${notSubmittableQuestions.length} questions are not from Question Bank. Answers to the following questions will not be submitted: ${titles}`
    );
  }

  // TODO: there is answer to a question which is not in the survey
  // TODO: invalid questionId (i.e. someone revoked public access to a question used in the survey)

  return warnings.length ? (
    <Message
      warning
      icon="bell"
      header="There are some problems"
      content={
        <Message.List>
          {warnings.map((w) => (
            <Message.Item>{w}</Message.Item>
          ))}
        </Message.List>
      }
    ></Message>
  ) : null;
}
