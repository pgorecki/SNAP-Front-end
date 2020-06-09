import React from 'react';
import yaml from 'js-yaml';
import { useHistory } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Formik } from 'formik';
import SurveyForm from './SurveyForm';
import DetailsPage from '../DetailsPage';
import { formatApiError, apiErrorToFormError } from '../../utils/apiUtils';
import useUrlParams from '../../hooks/useUrlParams';
import useResource from '../../hooks/useResource';
import toaster from '../../components/toaster';
import SurveyBuilder from 'components/surveyBuilder/SurveyBuilder';

export default function SurveyBuilderPage() {
  const history = useHistory();
  const [urlParams] = useUrlParams();
  const { data, error, loading, save } = useResource(
    `/surveys/${urlParams.id}/`
  );

  console.log(data);
  //  form.setFieldValue('definition', )

  const ready = !loading && !error;
  return (
    <DetailsPage title="Survey Builder" error={formatApiError(error)}>
      <Grid>
        <Grid.Column computer={16} mobile={16}>
          {ready && <SurveyBuilder survey={data} questions={[]} />}
        </Grid.Column>
      </Grid>
    </DetailsPage>
  );
}
