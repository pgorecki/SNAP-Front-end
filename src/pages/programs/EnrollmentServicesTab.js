import React, { useEffect, useState, useContext } from 'react';
import {
  Button,
  Header,
  Form,
  Grid,
  Modal,
  FormGroup,
  Label,
  FormField,
} from 'semantic-ui-react';
import { Formik } from 'formik';
import { AppContext } from 'AppStore';
import {
  FormSelect,
  FormDatePicker,
  FormErrors,
  FormInput,
  FormTextArea,
} from 'components/FormFields';
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
  const [showDetails, setShowDetails] = useState(false);
  const [showDetailsServiceName, setShowDetailsServiceName] = useState();
  const [showDetailsServiceCatg, setshowDetailsServiceCatg] = useState();
  const [showDetailsServiceValues, setshowDetailsServiceValues] = useState();
  const apiClient = useApiClient();
  const [urlParams, queryParams, fragment] = useUrlParams();
  const clientFullName = 'Test';
  const table = usePaginatedDataTable({
    url: `/programs/services/?enrollment=${enrollData.id}`,
  });
  console.log(table);
  AddCostAndHourInfo(table);
  const [show, setShow] = useState(false);
  const [showService, setShowService] = useState(false);
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  const [initialValues, setInitialValues] = useState({
    enrollment: '',
    service_type: 0,
    effective_date: '',
    values: '',
  });
  const [showServiceDate, setShowServiceDate] = useState();
  const [showServiceQty, setShowServiceQty] = useState();
  const [showServiceCostPerUnit, setShowServiceCostPerUnit] = useState();
  const [showServiceDesc, setShowServiceDesc] = useState();
  const [showServiceHours, setShowServiceHours] = useState();
  const [showServiceMinutes, setShowServiceMinutes] = useState();
  const [showServiceDays, setShowServiceDays] = useState();

  const [serviceType, setServiceType] = useState();
  const programsIndex = useResourceIndex(
    `/programs/services/types/?ordering=name`
  );
  const { data, ready } = programsIndex;
  const options = data
    ? data.map(({ id, category, name }) => ({
      value: id,
      text: name,
      catg: category
    }))
    : [];

  const [modalDataEd, setModaDataEd] = useState({});

  const hourAttOptions = [
    { value: 1, text: '1:00' },
    { value: 2, text: '2:00' },
    { value: 3, text: '3:00' },
    { value: 4, text: '4:00' },
    { value: 5, text: '5:00' },
    { value: 6, text: '6:00' },
    { value: 7, text: '7:00' },
    { value: 8, text: '8:00' },
    { value: 9, text: '9:00' },
    { value: 10, text: '10:00' },
  ];

  const hourOptions = [
    { value: 1, text: '1' },
    { value: 2, text: '2' },
    { value: 3, text: '3' },
    { value: 4, text: '4' },
    { value: 5, text: '5' },
    { value: 6, text: '6' },
    { value: 7, text: '7' },
    { value: 8, text: '8' },
    { value: 9, text: '9' },
    { value: 10, text: '10' },
  ];

  const minuteOptions = [
    { value: 15, text: '15' },
    { value: 30, text: '30' },
    { value: 45, text: '45' },
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
        Header: 'Date',
        accessor: 'effective_date',
        Cell: ({ value }) => (value ? formatDate(value) : ''),
      },
      {
        Header: 'Hours/Cost',
        accessor: 'values',
        Cell: ({ value }) => (
          value ? value.totalCost : ''
        ),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ value, row }) => {
          return (
            <>
              <Button size="tiny" onClick={(event) => SetModalDetails(event, row.original)}>
                Details
              </Button>
            </>
          );
        },
      },
    ],
    []
  );

  function SetModalDetails(event, detail) {
    event.preventDefault();
    setShowDetails(true);
    setModaDataEd(detail);
    setShowDetailsServiceName(detail.service_type.name);
    setshowDetailsServiceCatg(detail.service_type.category);
    const serviceDetail = (typeof (detail.values) === 'string' ? JSON.parse(detail.values) : detail.values) || {};

    setShowServiceDate(serviceDetail.sDate);
    setShowServiceQty(serviceDetail.sQTY);
    setShowServiceCostPerUnit(serviceDetail.sCostPerUnit);
    setShowServiceDesc(serviceDetail.timeBasedDesc);
    setShowServiceHours(serviceDetail.sHours);
    setShowServiceMinutes(serviceDetail.sMinutes);
    setShowServiceDays(
      'Monday: ' +
      serviceDetail.sMon +
      ', Tuesday: ' +
      serviceDetail.sTue +
      ', Wednesday: ' +
      serviceDetail.sWed +
      ', Thursday: ' +
      serviceDetail.sThur +
      ', Friday: ' +
      serviceDetail.sFri
    );
  }

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
              values: values,
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
                <Modal.Header>New Service</Modal.Header>
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
                        onChange={(e, { value }) =>
                          OnServiceTypeChange(e, value)
                        }
                      />
                      <>
                        {showAttendance && (
                          <FormDatePicker
                            label="Week Start"
                            name="sDate"
                            form={form}
                          />
                        )}
                      </>
                      <>
                        {(showTimeBased || showBusTickets) && (
                          <FormDatePicker
                            label="Date of Service"
                            name="sDate"
                            form={form}
                          />
                        )}
                      </>
                    </FormGroup>
                    <>
                      {showAttendance && (
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
                      )}
                    </>
                    <>
                      {showTimeBased && (
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
                      )}
                    </>
                    <>
                      {showBusTickets && (
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
                      )}
                    </>
                    <>
                      {(showTimeBased || showBusTickets) && (
                        <FormTextArea
                          name="timeBasedDesc"
                          placeholder="Description"
                          form={form}
                          rows="5"
                        />
                      )}
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

      <Modal open={showDetails}>
        <Modal.Header>Service Details</Modal.Header>
        <Modal.Content>
          <Grid>
            <Grid.Column computer={16} mobile={16}>
              <LabelField
                label="Name"
                value={showDetailsServiceName}
                valColor="#20B2AA"
              ></LabelField>
            </Grid.Column>
            {/* <Grid.Column computer={5} mobile={16}>
              <LabelField
                label="Category"
                value={showDetailsServiceCatg}
              ></LabelField>
            </Grid.Column> */}
            <>
              {(showDetailsServiceCatg == 'direct' ||
                showDetailsServiceCatg == 'time_based') && (
                  <Grid.Column computer={5} mobile={16}>
                    <LabelField
                      label="Service Date"
                      value={moment(showServiceDate).format('YYYY-MM-DD')}
                    ></LabelField>
                  </Grid.Column>
                )}
            </>
            <>
              {showDetailsServiceCatg == 'attendance' && (
                <Grid.Column computer={16} mobile={16}>
                  <LabelField
                    label="Week Start"
                    value={moment(showServiceDate).format('YYYY-MM-DD')}
                  ></LabelField>
                </Grid.Column>
              )}
            </>
            <>
              {showDetailsServiceCatg == 'direct' && (
                <Grid.Column computer={5} mobile={16}>
                  <LabelField
                    label="Quantity"
                    value={showServiceQty}
                  ></LabelField>
                </Grid.Column>
              )}
            </>
            <>
              {showDetailsServiceCatg == 'direct' && (
                <Grid.Column computer={5} mobile={16}>
                  <LabelField
                    label="Cost per unit"
                    value={showServiceCostPerUnit}
                  ></LabelField>
                </Grid.Column>
              )}
            </>
            <>
              {(showDetailsServiceCatg == 'direct' ||
                showDetailsServiceCatg == 'time_based') && (
                  <Grid.Column computer={5} mobile={16}>
                    <LabelField
                      label="Description"
                      value={showServiceDesc}
                    ></LabelField>
                  </Grid.Column>
                )}
            </>
            <>
              {showDetailsServiceCatg == 'time_based' && (
                <Grid.Column computer={5} mobile={16}>
                  <LabelField
                    label="Hours"
                    value={showServiceHours}
                  ></LabelField>
                </Grid.Column>
              )}
            </>
            <>
              {showDetailsServiceCatg == 'time_based' && (
                <Grid.Column computer={5} mobile={16}>
                  <LabelField
                    label="Minutes"
                    value={showServiceMinutes}
                  ></LabelField>
                </Grid.Column>
              )}
            </>
            <>
              {showDetailsServiceCatg == 'attendance' && (
                <Grid.Column computer={16} mobile={16}>
                  <LabelField label="Days" value={showServiceDays}></LabelField>
                </Grid.Column>
              )}
            </>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button
            style={{ marginLeft: '1rem' }}
            onClick={() => setShowDetails(null)}
          >
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );

  function OnServiceTypeChange(event, value) {
    event.preventDefault();
    setServiceTypeValue(value);
    let catg = "";
    for (let i = 0; i < options.length; i++) {
      if (value == options[i].value)
        catg = options[i].catg;
    }

    //let txtVal = event.target.textContent.split(':');
    //let catg = txtVal[0];
    if (catg.toLowerCase() !== 'time_based') {
      setShowTimeBased(false);
    } else {
      setShowTimeBased(true);
    }
    if (catg.toLowerCase() !== 'attendance') {
      setShowAttendance(false);
    } else {
      setShowAttendance(true);
    }
    if (catg.toLowerCase() !== 'direct') {
      setShowBusTickets(false);
    } else {
      setShowBusTickets(true);
    }
  }
}

function AddCostAndHourInfo(tbl) {
  if (tbl.data.length > 0) {
    for (let n = 0; n < tbl.data.length; n++) {
      let catg = tbl.data[n].service_type.category;
      let totCost = '';
      let valStr = (typeof (tbl.data[n].values) === 'string' ? JSON.parse(tbl.data[n].values) : tbl.data[n].values) || {};

      if (catg == 'attendance') {
        totCost = ((parseInt(valStr.sMon) + parseInt(valStr.sTue) + parseInt(valStr.sWed) + parseInt(valStr.sThur) + parseInt(valStr.sFri)));
      }
      else if (catg == 'direct') {
        totCost = '$' + (parseInt(valStr.sQTY) * (Number.isNaN(parseInt(valStr.sCostPerUnit)) ? 0 : parseInt(valStr.sCostPerUnit))).toFixed(2);
      }
      else if (catg == 'time_based') {
        let tm = (parseInt(valStr.sHours) + (valStr.sMinutes / 60));
        totCost = tm.toFixed(2);
      }
      if (typeof (tbl.data[n].values) === 'string') {
        tbl.data[n].values = JSON.parse(tbl.data[n].values);
        tbl.data[n].values.totalCost = totCost;
      }
      else {
        tbl.data[n].values.totalCost = totCost;
      }
      //console.log(tbl);
    }
  }
}