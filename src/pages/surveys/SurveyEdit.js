import React from 'react';
import yaml from 'js-yaml';
import { useHistory } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Formik } from 'formik';
import toaster from 'components/toaster';
import useUrlParams from 'hooks/useUrlParams';
import useResource from 'hooks/useResource';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import { itemsToArray, iterateItemsAsync } from './computations';
import SurveyForm from './SurveyForm';
import DetailsPage from '../DetailsPage';
import useNewResource from 'hooks/useNewResource';

export default function SurveyEdit() {
  const history = useHistory();
  const [urlParams] = useUrlParams();
  const { data, error, save } = useResource(`/surveys/${urlParams.id}/`);
  const newQuestion = useNewResource('/questions/');

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...data,
        definition: data.definition ? yaml.safeDump(data.definition) : '',
      }}
      onSubmit={async (values, actions) => {
        console.log('submitting');
        const uploadResults = {
          created: [],
          skipped: [],
        };
        try {
          // TODO: upload new questions
          const definition = yaml.safeLoad(values.definition);
          const items = itemsToArray(definition).filter(
            (x) => x.type === 'question' && !x.questionId
          );

          console.log('zzz', items);

          if (
            items.length &&
            window.confirm(`${items.length} questions will be creaded`)
          ) {
            await iterateItemsAsync(definition, async (item) => {
              const itemDefinition = { ...item };
              delete itemDefinition.hmisId;
              delete itemDefinition.rules;
              const questionData = {
                title: item.title,
                description: item.description,
                category: item.type === 'question' ? item.category : 'grid',
                other: item.other,
                refusable: item.refusable,
                options: item.options,
                is_public: data.is_public,
              };
              if (item.type === 'question' || item.type === 'grid') {
                if (!item.questionId) {
                  try {
                    const question = await newQuestion.save(questionData);
                    item.questionId = question.id; // eslint-disable-line
                    uploadResults.created.push({
                      id: item.id,
                      questionId: item.questionId,
                    });
                  } catch (err) {
                    console.error(
                      'failed to create question',
                      questionData,
                      err
                    );
                  }
                } else {
                  uploadResults.skipped.push({
                    id: item.id,
                    questionId: item.questionId,
                  });
                }
              }
            });
          }

          await save({
            ...values,
            definition,
          });
          toaster.success('Survey updated');
        } catch (err) {
          console.log(err);
          actions.setErrors(apiErrorToFormError(err));
        }
        actions.setSubmitting(false);
      }}
    >
      {(form) => (
        <DetailsPage title="Edit Survey" error={formatApiError(error)}>
          <Grid>
            <Grid.Column computer={16} mobile={16}>
              <SurveyForm form={form} />
            </Grid.Column>
          </Grid>
        </DetailsPage>
      )}
    </Formik>
  );
}
