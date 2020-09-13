import React, { useEffect, useState, useContext } from 'react';
import { Button, Header, Form, Grid, Modal, FormGroup, Label, FormField } from 'semantic-ui-react';
import { Formik } from 'formik';
import { AppContext } from 'AppStore';
import { FormSelect, FormDatePicker, FormErrors, FormInput, FormTextArea } from 'components/FormFields';
import toaster from 'components/toaster';
//import EnrollmentServiceModal from 'modals/EnrollmentServiceModal';
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
import moment from 'moment';
import { LabelField } from 'components/common';

export default function EnrollmentServicesTab({ enrollData }) {
  const history = useHistory();
  const [{ user }] = useContext(AppContext);
  const [modalData, setModalData] = useState();
  const [isOpened, setIsOpened] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showTimeBased, setShowTimeBased] = useState(false);
  const [showBusTickets, setShowBusTickets] = useState(false);
  const [serviceTypeValue, setServiceTypeValue] = useState();
  const apiClient = useApiClient();
  const [urlParams, queryParams, fragment] = useUrlParams();
  const clientFullName = 'Test';
  const table = usePaginatedDataTable({
    url: `/programs/services/?enrollment=${enrollData.id}`,
  });
  console.log(table);
  const [show, setShow] = useState(false);
  const [showService, setShowService] = useState(false);
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  const [initialValues, setInitialValues] = useState({
    enrollment: '',
    service_type: 0,
    effective_date: '',
    values: ''
  });
  const [serviceType, setServiceType] = useState();
  const programsIndex = useResourceIndex(`/programs/services/types/?ordering=name`);
  const { data, ready } = programsIndex;
  const options = data
    ? data.map(({ id, name }) => ({
      value: id,
      text: name,
    }))
    : [];

  const [modalDataEd, setModaDataEd] = useState({});

  const hourAttOptions = [
    { "value": 1, "text": "1:00" },
    { "value": 2, "text": "2:00" },
    { "value": 3, "text": "3:00" },
    { "value": 4, "text": "4:00" },
    { "value": 5, "text": "5:00" },
    { "value": 6, "text": "6:00" },
    { "value": 7, "text": "7:00" },
    { "value": 8, "text": "8:00" },
    { "value": 9, "text": "9:00" },
    { "value": 10, "text": "10:00" }
  ];

  const hourOptions = [
    { "value": 1, "text": "1" },
    { "value": 2, "text": "2" },
    { "value": 3, "text": "3" },
    { "value": 4, "text": "4" },
    { "value": 5, "text": "5" },
    { "value": 6, "text": "6" },
    { "value": 7, "text": "7" },
    { "value": 8, "text": "8" },
    { "value": 9, "text": "9" },
    { "value": 10, "text": "10" }
  ];

  const minuteOptions = [
    { "value": 1, "text": "15" },
    { "value": 2, "text": "30" },
    { "value": 3, "text": "45" }
  ];

  const columns = React.useMemo(
    () => [
      {
        Header: 'Service Type',
        accessor: 'service_type.name',
      },
      //{
      //  Header: 'Category',
      //  accessor: 'service_type.category',
      //},
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
              <Button onClick={() => setModaDataEd({ ...row.original })}>
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

  function handleClose() {
    setShowService(false);
    setShowTimeBased(false);
    setShowAttendance(false);
    setShowBusTickets(false);
  }

  return (
    <>
      <Button
        primary
        onClick={() => {
          setShowService(true);
        }}
      >
        Add new service
      </Button>

      <Header as="h4">Enrollment Services</Header>
      <PaginatedDataTable columns={columns} table={table} />      
      
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          try {
            await apiClient.post(`/programs/services/`, {
             enrollment: enrollData.id,
             service_type: serviceTypeValue,
             effective_date: moment(values.sDate).format('YYYY-MM-DD'),
             values: JSON.stringify(values)
            });
            toaster.success('Service created');
          } catch (err) {
            const apiError = formatApiError(err.response);
            toaster.error(apiError);
          }
          actions.setSubmitting(false);
          handleClose();
          table.reload();
        }}
      >
        {(form) => {
          return (
            <>
              <Modal size="large" open={showService} onHide={handleClose}>
                <Modal.Header>
                  New Service
              </Modal.Header>
                <Modal.Content>
                  <Form error onSubmit={form.handleSubmit}>
                    <FormGroup>
                      <FormSelect
                        label="Service Type"
                        name="sType"
                        form={form}
                        required
                        options={options}
                        placeholder="Select type"
                        onChange={(e,{value}) => OnServiceTypeChange(e, value)}
                      />
                      <>
                        {
                          showAttendance &&
                          <FormDatePicker label="Week Start" name="sDate" form={form} />
                        }
                      </>
                      <>
                        {
                          (showTimeBased || showBusTickets) &&
                          <FormDatePicker label="Date of Service" name="sDate" form={form} />
                        }
                      </>
                    </FormGroup>
                    <>
                      {
                        showAttendance &&
                        <FormGroup>
                          <FormSelect
                            label="Mon"
                            name="sMon"
                            form={form}
                            options={hourAttOptions}
                          />
                          <FormSelect
                            label="Tue"
                            name="sTue"
                            form={form}
                            options={hourAttOptions}
                          />
                          <FormSelect
                            label="Wed"
                            name="sWed"
                            form={form}
                            options={hourAttOptions}
                          />
                          <FormSelect
                            label="Thur"
                            name="sThur"
                            form={form}
                            options={hourAttOptions}
                          />
                          <FormSelect
                            label="Fri"
                            name="sFri"
                            form={form}
                            options={hourAttOptions}
                          />
                        </FormGroup>
                      }
                    </>
                    <>
                      {
                        showTimeBased &&
                        <FormGroup>
                          <FormSelect
                            label="Hours"
                            name="sHours"
                            form={form}
                            options={hourOptions}
                          />
                          <FormSelect
                            label="Minutes"
                            name="sMinutes"
                            form={form}
                            options={minuteOptions}
                          />
                        </FormGroup>
                      }
                    </>
                    <>
                      {
                        showBusTickets &&
                        <FormGroup>
                          <FormSelect
                            label="QTY"
                            name="sQTY"
                            form={form}
                            options={hourOptions}
                          />
                          <FormInput
                            label="Cost per unit"
                            name="sCostPerUnit"
                            form={form}
                          />
                        </FormGroup>
                      }
                    </>
                    <>
                      {
                        (showTimeBased || showBusTickets) &&
                        <FormTextArea name="timeBasedDesc" placeholder="Description" form={form} rows="5" />
                      }
                    </>
                    <FormErrors form={form} />
                    <Button primary type="submit" disabled={form.isSubmitting}>
                      Submit
                              </Button>
                    <Button onClick={handleClose}>Cancel</Button>
                  </Form>
                </Modal.Content>
              </Modal>
            </>
          );
        }}
      </Formik>

      <Modal closeIcon open={!!modalDataEd.id} onClose={() => setModaDataEd({})}>
        <Modal.Header>Service Details</Modal.Header>
        <Modal.Content>
            Id: {modalDataEd.id}
        </Modal.Content>
      </Modal>

    </>
  );

  function OnServiceTypeChange(event, value) {
    event.preventDefault();
    setServiceTypeValue(value);
    if (event.target.textContent !== 'Training') {
      setShowTimeBased(false);
    } else {
      setShowTimeBased(true);
    }
    if (event.target.textContent !== 'Attendance') {
      setShowAttendance(false);
    } else {
      setShowAttendance(true);
    }
    if (event.target.textContent !== 'Bus tickets') {
      setShowBusTickets(false);
    } else {
      setShowBusTickets(true);
    }
    //console.log(event.target.textContent);
  }
}

