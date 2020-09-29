import React, { useState, useContext } from 'react';
import {
  Button,
  Grid,
  Modal,
  Form,
  Dropdown,
  Icon
} from 'semantic-ui-react';
import { hasPermission } from 'utils/permissions';
import toaster from 'components/toaster';
import IepSurveyModal from 'modals/IepSurveyModal';
import { AppContext } from 'AppStore';
import { Formik } from 'formik';
import {
  FormDatePicker,
  FormErrors,
  FormInput,
  FormTextArea
} from 'components/FormFields';
import { formatDate } from 'utils/typeUtils';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import useApiClient from 'hooks/useApiClient';
import useNewResource from 'hooks/useNewResource';
import PaginatedDataTable from 'components/PaginatedDataTable';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import IepResponses from '../clients/IepResponses';
import useFetchData from 'hooks/useFetchData';
import { formatOwner } from 'utils/modelUtils';

export const OrientationStep = (props) => {
  const [isSurveyModel, setIsSurveyModelState] = useState(false);
  const [isNotesModel, setIsNotesModelState] = useState(false);
  const [initClient, setClientState] = useState(props.client.client);
  const [initIep, setIepState] = useState(props.client);
  const [surveyId, setSurveyId] = useState();
  const [{ user }] = useContext(AppContext);
  const apiClient = useApiClient();
  const { save } = useNewResource('/notes/', {});
  const notestable = usePaginatedDataTable({
    url: `/notes/?source_id=${initIep.id}`,
  });
  const [showIepSurveyResponses, setShowIepSurveyResponses] = useState(false);
  const [iepSurveyId, setIepSurveyId] = useState();
  const [SurveyData, ready] = useFetchData(`/surveys/`, {});
  const optionSurveys = !!SurveyData.results
    ? SurveyData.results.map(({ id, name }) => ({
      key: id,
      value: id,
      flag: id,
      text: name
    }))
    : [];

  function showResponses(event, data) {
    event.preventDefault();
    setIepSurveyId(data.value);
    setShowIepSurveyResponses(false);
    setSurveyId(data.value);
  }

  function opensurveyforiep() {
    setIsSurveyModelState(true);
    setSurveyId(null);
    setShowIepSurveyResponses(false);
  }

  function SelectSurvey() {
    setShowIepSurveyResponses(true);
    setIsSurveyModelState(false);
  }

  function confirmClicked() {
    props.confirmOrientationClicked();
  }

  function confirmEndClicked() {
    props.confirmEndIEPClicked();
  }

  function OpenNotes(event) {
    event.preventDefault();
    setIsNotesModelState(true);
  }

  function NotesForm({ iepIndex }) {
    const [initialValues, setInitialValues] = useState({
      source: {
        id: iepIndex['id'],
        type: 'ClientIEP',
      },
    });
    return (
      <>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            try {
              const result = await save({
                ...values,
                title: values.subject,
                text: values.noteDesc,
              });
              //history.push(`/notes/${result.id}`);
              toaster.success('Notes created');
            } catch (err) {
              actions.setErrors(apiErrorToFormError(err));
            }
            actions.setSubmitting(false);
            setIsNotesModelState(false);
            //actions.resetForm();
            notestable.reload();
          }}
        >
          {(form) => {
            return (
              <>
                <Form error onSubmit={form.handleSubmit}>
                  <FormInput label="Subject:" name="subject" form={form} />
                  {/* <FormSelect label="Select Template" name="template" form={form} options={options} placeholder="Select Template" disabled="true" /> */}
                  <FormDatePicker label="Date" name="date" form={form} />
                  <FormTextArea
                    name="noteDesc"
                    placeholder="Enter note here"
                    form={form}
                  />
                  <FormErrors form={form} />
                  <Button primary type="submit" disabled={form.isSubmitting}>
                    Submit
                  </Button>
                </Form>
              </>
            );
          }}
        </Formik>
      </>
    );
  }

  const notescolumns = React.useMemo(
    () => [
      {
        Header: 'Subject',
        accessor: 'title',
      },
      {
        Header: 'Note',
        accessor: 'text',
      },
      {
        Header: 'Date',
        accessor: 'created_at',
        Cell: ({ value }) => (value ? formatDate(value) : ''),
      },
      {
        Header: 'User Creating',
        accessor: 'created_by',
        Cell: ({ value }) => formatOwner(value),
      },
      // {
      //   Header: 'Actions',
      //   accessor: 'actions',
      //   Cell: ({ row }) => (
      //     <>
      //       <EditActionButton
      //         onClick={() => setModaDataEd({ ...row.original })}
      //       />
      //       <DeleteActionButton
      //         onClick={() => setModaData({ ...row.original })}
      //       />
      //     </>
      //   ),
      // },
    ],
    []
  );

  return (
    <>
      <h4>Orientation is not completed </h4>
      <Grid>
        <Grid.Row>
          <Button
            onClick={confirmClicked}
            style={{ marginLeft: '1rem' }}
            size="tiny"
            disabled={!hasPermission(user, 'iep.add_clientiep')}
          >
            Confirm orientation completed
          </Button>
        </Grid.Row>
        <Grid.Row>
        <Button onClick={opensurveyforiep} style={{ marginLeft: '1rem' }} size="tiny">
            Assess Client
          </Button>
          <Button disabled size="tiny"><Icon name="edit" />
            Modify IEP plan
          </Button>
          <Button
            onClick={confirmEndClicked}
            size="tiny"
            negative
          ><Icon name="close" />
            End IEP
          </Button>
        </Grid.Row>
      </Grid>

      <h2>NOTES</h2>
      <Button onClick={(event) => OpenNotes(event)} size="tiny"><Icon name="add" />
        Add Notes
      </Button>
      <PaginatedDataTable columns={notescolumns} table={notestable} />
      {isNotesModel && (
        <>
          <Modal size="large" open={isNotesModel}>
            <Modal.Header>Notes</Modal.Header>
            <Modal.Content>
              {/* <Header as="h4">Enroll to Program</Header> */}
              <NotesForm iepIndex={initIep} />
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => setIsNotesModelState(false)}>
                Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </>
      )}
      {isSurveyModel && (
        <>
          <Modal
            size="large"
            open={isSurveyModel}
            closeIcon
            onClose={() => setIsSurveyModelState(false)}
          >
            <Modal.Header>IEP Assessment(s)</Modal.Header>
            <Modal.Content>
              <Grid
                style={{
                  background: '#fff',
                  margin: 0,
                  padding: 0,
                }}
              >
                <Grid.Column computer={16} mobile={16}>
                  <Dropdown
                    placeholder='Select Assessment'
                    compact
                    search
                    selection
                    options={optionSurveys}
                    onChange={showResponses}
                  />
                  <>
                    {hasPermission(user, 'survey.add_response') && (
                      <Button
                        onClick={SelectSurvey}
                        disabled={!iepSurveyId}>
                        New Assessment
                      </Button>
                    )}
                  </>
                </Grid.Column>
              </Grid>
              <IepResponses
                iepId={initIep.id}
                surveyId={iepSurveyId}>
              </IepResponses>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => setIsSurveyModelState(false)}>Cancel</Button>
            </Modal.Actions>
          </Modal>
        </>
      )}
      {showIepSurveyResponses && (
        <>
          <Modal
            size="large"
            open={showIepSurveyResponses}
            closeIcon
            onClose={opensurveyforiep}
          >
            <Modal.Header>IEP Assessment</Modal.Header>
            <Modal.Content>

              <IepSurveyModal
                client={initClient}
                surveyId={surveyId}
                onResponseSubmit={async (newResponseData) => {
                  try {
                    await apiClient.post('/responses/', {
                      ...newResponseData,
                      response_context: {
                        id: initIep['id'],
                        type: 'ClientIEP',
                      },
                    });
                    toaster.success('Entry response saved');
                  } catch (err) {
                    const apiError = formatApiError(err.response);
                    toaster.error(apiError);
                  }
                  opensurveyforiep();
                }}
              />

            </Modal.Content>
            <Modal.Actions>
              <Button onClick={opensurveyforiep}>Cancel</Button>
            </Modal.Actions>
          </Modal>
        </>
      )}
    </>
  );
};
