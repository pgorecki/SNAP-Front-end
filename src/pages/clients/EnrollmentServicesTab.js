import React, { useEffect, useState, useContext } from 'react';
import { Button, Header, Form, Grid, Modal } from 'semantic-ui-react';
import { Formik } from 'formik';
import { AppContext } from 'AppStore';
import { FormSelect, FormDatePicker, FormErrors } from 'components/FormFields';
import toaster from 'components/toaster';
import EnrollmentServiceModal from 'modals/EnrollmentServiceModal';
import useApiClient from 'hooks/useApiClient';
import useResourceIndex from 'hooks/useResourceIndex';
import { formatDate, formatDateTime, FieldError } from 'utils/typeUtils';
import { formatApiError, apiErrorToFormError } from 'utils/apiUtils';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';
import PaginatedDataTable from 'components/PaginatedDataTable';
import { useHistory } from 'react-router-dom';
import useUrlParams from 'hooks/useUrlParams';
import EnrollmentDetails from '../programs/EnrollmentDetails';
import { hasPermission } from 'utils/permissions';

// function EnrollmentForm({ programsIndex, onSubmit }) {
//   const { data, ready } = programsIndex;
//   const [initialValues, setInitialValues] = useState({
//     surveyId: null,
//     program: null,
//     start_date: new Date(),
//   });

//   const options = data
//     ? data.map(({ id, name }) => ({
//         value: id,
//         text: name,
//       }))
//     : [];

//   useEffect(() => {
//     if (data && data.length > 0 && initialValues.program === null) {
//       setInitialValues({ ...initialValues, program: data[0].id });
//     }
//   }, [ready]);

//   return (
//     <Grid>
//       <Grid.Column computer={8} mobile={16}>
//         <Formik
//           enableReinitialize
//           initialValues={initialValues}
//           onSubmit={async (values, actions) => {
//             try {
//               await onSubmit({
//                 ...values,
//                 program: data.find((program) => program.id === values.program),
//               });
//             } catch (err) {
//               actions.setErrors(apiErrorToFormError(err));
//             }
//             actions.setSubmitting(false);
//           }}
//         >
//           {(form) => {
//             if (!data) {
//               return null;
//             }
//             const selectedProgram =
//               data &&
//               data.find((program) => program.id === form.values.program);

//             let intakeSurvey = null;
//             if (selectedProgram) {
//               intakeSurvey = selectedProgram.enrollment_entry_survey;
//             }

//             return (
//               <Form error onSubmit={form.handleSubmit}>
//                 <FormSelect
//                   label="Progam"
//                   name="program"
//                   form={form}
//                   required
//                   options={options}
//                   placeholder="Select program"
//                 />
//                 <FormDatePicker
//                   label="Start Date"
//                   name="start_date"
//                   form={form}
//                   required
//                 />
//                 <FormErrors form={form} />
//                 <Button
//                   primary
//                   type="submit"
//                   disabled={!intakeSurvey || form.isSubmitting}
//                   onClick={() => {
//                     form.setFieldValue('surveyId', intakeSurvey.id);
//                   }}
//                 >
//                   Start enrollment
//                 </Button>
//               </Form>
//             );
//           }}
//         </Formik>
//       </Grid.Column>
//     </Grid>
//   );
// }

export default function EnrollmentServicesTab({ enrollmentId }) {
  const history = useHistory();
  const [{ user }] = useContext(AppContext);
  const [modalData, setModalData] = useState();
  const [isOpened, setIsOpened] = useState(false);
  const apiClient = useApiClient();
  const [urlParams, queryParams, fragment] = useUrlParams();
  const clientFullName = 'Test';
  const table = usePaginatedDataTable({
    url: `/programs/services/?enrollment=${enrollmentId}`,
  });

  const columns = React.useMemo(
    () => [
      {
        Header: 'Service Type',
        accessor: 'service_type.name',
      },
      {
        Header: 'Category',
        accessor: 'service_type.category',
      },
      {
        Header: 'Effective Date',
        accessor: 'effective_date',
        Cell: ({ value }) => (value ? formatDate(value, true) : ''),
      },
      {
        Header: 'Date Created',
        accessor: 'created_at',
        Cell: ({ value }) => (value ? formatDateTime(value, true) : ''),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ value, row }) => {
          return (
            <>
              <Button onClick={() => setModalData({ service: row.original })}>
                Details
              </Button>
              <Button disabled>Edit</Button>
            </>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (table.data.length) setModalData({ service: table.data[0] });
  }, [table.data.length]);

  return (
    <>
      <Button
        primary
        onClick={() => {
          //setModalSurveyData
        }}
      >
        Add new service
      </Button>

      <Header as="h4">Enrollment Services</Header>
      <PaginatedDataTable columns={columns} table={table} />
      <Modal size="large" open={!!modalData}>
        <Modal.Header>Service Details</Modal.Header>
        <Modal.Content>
          {modalData && <EnrollmentServiceModal service={modalData.service} />}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalData(null)}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
