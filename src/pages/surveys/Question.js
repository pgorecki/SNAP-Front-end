import React from 'react';
import moment from 'moment';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import InputMask from 'react-input-mask';
import { Input, Form, Radio, Checkbox } from 'semantic-ui-react';
// import CurrencyInput from '/imports/ui/components/CurrencyInput';
// import 'react-datepicker/dist/react-datepicker.css';
import Item from './Item';
import { isNumeric } from '../../utils/typeUtils';
import { getLatLongFromDevice, createGeocodeUrl } from '../../utils/other';
// import { logger } from '/imports/utils/logger';

const DEFAULT_OTHER_VALUE = 'Other';

export const MISSING_HMIS_ID_ICON = (
  <i className="fa fa-exclamation-circle" aria-hidden></i>
);

export default class Question extends Item {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleRefuseChange = this.handleRefuseChange.bind(this);
    this.handleOtherFocus = this.handleOtherFocus.bind(this);
    this.handleOtherClick = this.handleOtherClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.state = {
      otherSelected: false,
      error: null,
    };
  }

  getChoiceOptions() {
    const options = this.props.item.options || [];
    if (Array.isArray(options)) {
      return options
        .filter((o) => !!o)
        .map((o) => {
          if (typeof o === 'string') {
            const label = o.split('|').pop();
            const value = o.split('|').shift();
            return {
              value,
              label,
            };
          }
          return {
            value: o,
            label: o,
          };
        });
    }
    return Object.keys(options).map((key) => ({
      value: key,
      label: options[key],
    }));
  }

  getRefuseValue() {
    const refusable = this.props.item.refusable;
    if (!refusable) {
      return null;
    }
    const refuseValue = typeof refusable === 'boolean' ? 'Refused' : refusable;
    return refuseValue;
  }

  getAddressValue() {
    const fields = document.getElementsByName('addressInput');
    const values = Array.prototype.map.call(fields, (f) => f.value);
    return values.join(',');
  }

  handleChange(value, otherChanged) {
    const isValid = this.validateValue(value);
    if (otherChanged) {
      if (!value) {
        value = DEFAULT_OTHER_VALUE;
      }
    } else {
      this.setState({ otherSelected: false });
    }
    this.props.onChange(this.props.item.id, value, isValid);
  }

  handleRefuseChange(checked) {
    let value;
    if (checked) {
      value = this.getRefuseValue();
      this.setState({ otherSelected: false });
    } else {
      value = '';
    }
    this.props.onChange(this.props.item.id, value, true);
  }

  handleOtherClick(event) {
    this.props.onChange(this.props.item.id, DEFAULT_OTHER_VALUE);
    this.otherInput.focus();
  }

  handleOtherFocus() {
    setTimeout(() => {
      this.props.onChange(this.props.item.id, DEFAULT_OTHER_VALUE);
      this.setState({ otherSelected: true });
    }, 1);
  }

  validateValue(value) {
    const isRefused = this.getRefuseValue() === value;
    if (this.props.item.category === 'number' && !isRefused) {
      if (value.length > 0) {
        if (!isNumeric(value)) {
          this.setState({ error: `${value} is not a number` });
          return false;
        }
      }
    }
    this.setState({ error: null });
    return true;
  }

  handleButtonClick() {
    if (this.props.item.category === 'location') {
      const value = this.getAddressValue();

      if (value.length > 0) {
        const url = createGeocodeUrl(value);
        console.log(url);
        // return new Promise((resolve) => {
        //   Meteor.call('surveys.getGeocodedLocation', url, (error, result) => {
        //     if (error) {
        //       const msg =
        //         'Location could not be validated due the API call returning an error.';
        //       this.setState({ error: null, message: msg });
        //       logger.info(msg);
        //       resolve(false);
        //     } else {
        //       // We're assuming the location is valid if the geocoding API result isn't empty
        //       // In the future we may want to populate address fields based on the result
        //       if (result.results && result.results.length > 0) {
        //         const msg = `\"${value}\" validated successfully.`;
        //         this.setState({ error: null, message: msg });
        //         logger.info(msg);
        //         resolve(true);
        //       } else {
        //         const msg = `\"${value}\" did not validate successfully.`;
        //         this.setState({ error: null, message: msg });
        //         logger.info(msg);
        //         resolve(false);
        //       }
        //       if (result.rate) {
        //         // Log remaining requests, OpenCage Geocoder API allows 2500/day
        //         const geoLimitMsg =
        //           `You have ${result.rate.remaining}/${result.rate.limit} remaining ` +
        //           'requests to OpenCage Geocoder API today.';
        //         logger.info(geoLimitMsg);
        //       }
        //     }
        //   });
        // });
      }
    }
    return false;
  }

  isRefused() {
    return (
      this.props.formState.values[this.props.item.id] === this.getRefuseValue()
    );
  }

  renderQuestionCategory(value, disabled) {
    switch (this.props.item.category) {
      case 'choice':
        return this.renderChoice(value, disabled);
      case 'currency':
        return this.renderCurrencyInput(value, disabled);
      case 'location':
        return this.renderLocationInput(value, disabled);
      case 'date':
        return this.renderDatePicker(value, disabled);
      case 'number':
        return this.renderNumberInput(value, disabled);
      case 'select':
        return this.renderSelect(value, disabled);
      case 'textarea':
        return this.renderTextarea(value, disabled);
      default:
        return this.renderInput(value, 'text', disabled);
    }
  }

  renderDatePicker(dateStr, disabled) {
    let dateObject = null;
    if (dateStr) {
      dateObject = moment(dateStr, 'YYYY-MM-DD').toDate();
    }
    return (
      <SemanticDatepicker
        value={dateObject}
        onChange={(event, { value }) => this.handleChange(value)}
        disabled={this.isRefused() || disabled}
      />
    );
  }

  renderChoice(value, disabled) {
    const { id, other } = this.props.item;
    const options = this.getChoiceOptions();
    const choices = options.map((v, i) => (
      <Form.Field key={`choice-${id}-${i}`}>
        <Radio
          name={id}
          label={v.value}
          value={v.value}
          disabled={this.isRefused() || disabled}
          checked={
            !this.isRefused() && v.value == value && !this.state.otherSelected
          } // eslint-disable-line
          onChange={(event, { value }) => this.handleChange(value)}
        />
      </Form.Field>
    ));
    if (other) {
      const optionsWithOther = [...options, { value: 'Other', label: value }];
      const otherValue = optionsWithOther.some((o) => o.value === value)
        ? ''
        : value;
      const otherPlaceholder =
        typeof other === 'boolean' ? 'please specify' : `${other}`;
      const checked = !this.isRefused() && this.state.otherSelected;
      choices.push(
        <Form.Field key={`choice-${id}-other`}>
          <Radio
            name={id}
            label="Other"
            value={DEFAULT_OTHER_VALUE}
            disabled={this.isRefused() || disabled}
            checked={checked}
            onChange={this.handleOtherClick}
          />
          <span>: </span>
          <Input
            name={id}
            placeholder={otherPlaceholder}
            disabled={this.isRefused() || disabled}
            value={otherValue || ''}
            onChange={(event) => this.handleChange(event.target.value, true)}
            onFocus={this.handleOtherFocus}
            ref={(input) => {
              this.otherInput = input;
            }}
          />
        </Form.Field>
      );
    }
    return <>{choices}</>;
  }

  renderSelect(value, disabled) {
    const { id, other } = this.props.item;
    const options = this.getChoiceOptions();
    const htmlOptions = options.map((v, i) => (
      <Radio key={`choice-${id}-${i}`} value={v.value}>
        {v.label}
      </Radio>
    ));

    let otherOption = null;
    if (other) {
      const otherValue = [...options, { value: 'Other' }].some(
        (o) => o.value === value
      )
        ? ''
        : value;
      const otherPlaceholder =
        typeof other === 'boolean' ? 'please specify' : `${other}`;
      const otherChecked = !this.isRefused() && this.state.otherSelected;
      otherOption = (
        <div>
          <input
            name={id}
            type="checkbox"
            disabled={this.isRefused() || disabled}
            checked={otherChecked}
            value={DEFAULT_OTHER_VALUE}
            onChange={this.handleOtherClick}
          />
          <span>Other: </span>
          <input
            type="text"
            name={id}
            placeholder={otherPlaceholder}
            disabled={this.isRefused() || disabled}
            value={otherValue || ''}
            onChange={(value) => this.handleChange(value, true)}
            onFocus={this.handleOtherFocus}
            ref={(input) => {
              this.otherInput = input;
            }}
          />
        </div>
      );
    }
    return (
      <>
        <select
          id={id}
          value={value}
          disabled={this.isRefused() || disabled}
          onChange={this.handleChange}
        >
          <option value="">--- Please select ---</option>
          {htmlOptions}
        </select>
        {otherOption}
      </>
    );
  }

  renderInput(value, type, disabled) {
    const { id } = this.props.item;
    const mask = this.props.item.mask;

    return (
      <Input
        id={id}
        name={id}
        mask={mask}
        disabled={this.isRefused() || disabled}
        value={value === undefined ? '' : value}
        children={
          <InputMask
            mask={mask}
            value={value === undefined ? '' : value}
            onChange={(event) => this.handleChange(event.target.value)}
          />
        }
      />
    );
  }

  renderTextarea(value, disabled) {
    const { id } = this.props.item;
    return (
      <textarea
        id={id}
        disabled={disabled}
        rows={5}
        onChange={this.handleChange}
        value={value || ''}
      ></textarea>
    );
  }

  renderCurrencyInput(value, disabled) {
    const { id } = this.props.item;

    return (
      <p>TODO: CurrencyInput</p>
      // <CurrencyInput
      //   id={id}
      //   value={value === undefined ? '0' : value}
      //   onChange={(x, number) =>
      //     this.props.onChange(this.props.item.id, number)
      //   }
      //   disabled={this.isRefused() || disabled}
      // />
    );
  }

  renderNumberInput(value, disabled) {
    const { id } = this.props.item;
    const mask = this.props.item.mask;

    return (
      <Input
        id={id}
        name={id}
        mask={mask}
        disabled={this.isRefused() || disabled}
        value={value === undefined ? '' : value}
        children={
          <InputMask
            mask={mask}
            onChange={(event) => this.handleChange(event.target.value)}
          />
        }
      />
    );
  }

  renderLocationInput(value, disabled) {
    const { id } = this.props.item;
    const addressFields = this.props.item.addressFields || [];
    const autoLoc = this.props.item.autoLocation;
    let location;
    if (autoLoc) {
      const latLongVal = getLatLongFromDevice();
      location = (
        <table>
          <tr>
            <td>Latitude: </td>
            <td> </td>
            <td>{latLongVal[0]}</td>
          </tr>
          <tr>
            <td>Longitude: </td>
            <td> </td>
            <td>{latLongVal[1]}</td>
          </tr>
        </table>
      );
    } else {
      let tempLoc = addressFields.map((v, i) => (
        <tr key={`loc-${i}`}>
          <td>{v} </td>
          <td>
            <input
              id={`address-${i}`}
              type="text"
              name="addressInput"
              disabled={this.isRefused() || disabled}
              onChange={this.handleChange}
            />
          </td>
        </tr>
      ));
      location = (
        <table>
          {tempLoc}
          <tr>
            <button
              id="addressValidation"
              className="btn btn-default"
              type="button"
              onClick={this.handleButtonClick}
              disabled={this.isRefused() || disabled}
            >
              Validate Address
            </button>
          </tr>
        </table>
      );
    }
    return <div key={`location-${id}`}>{location}</div>;
  }

  renderRefuseCheckbox(disabled) {
    const refuseValue = this.getRefuseValue();
    if (!refuseValue) {
      return null;
    }
    return (
      <Checkbox
        label={refuseValue}
        checked={this.isRefused()}
        value={refuseValue}
        onChange={(event, { checked }) => this.handleRefuseChange(checked)}
      />
    );
  }

  renderTitle() {
    const icon = this.props.item.hmisId ? null : MISSING_HMIS_ID_ICON;
    const title = `${this.props.item.title}`;
    const isRequired = this.props.item.required;
    const requiredMark = isRequired ? (
      <span style={{ color: 'red' }}>(*)</span>
    ) : null;
    switch (this.props.level) {
      case 1:
        return (
          <h1 className="title">
            {title} {icon} {requiredMark}
          </h1>
        );
      case 2:
        return (
          <h2 className="title">
            {title} {icon} {requiredMark}
          </h2>
        );
      case 3:
        return (
          <h3 className="title">
            {title} {icon} {requiredMark}
          </h3>
        );
      case 4:
        return (
          <h4 className="title">
            {title} {icon} {requiredMark}
          </h4>
        );
      case 5:
        return (
          <h5 className="title">
            {title} {icon} {requiredMark}
          </h5>
        );
      case 6:
        return (
          <h6 className="title">
            {title} {icon} {requiredMark}
          </h6>
        );
      default:
        return (
          <div className="title">
            {title} {icon} {requiredMark}
          </div>
        );
    }
  }

  render() {
    const { id, text, required } = this.props.item;
    const value = this.props.formState.values[id];
    const disabled = !!this.props.formState.props[`${id}.skip`];
    const hasError = !!this.state.error;

    if (disabled && value) {
      // if field is disable but has a value, emit an evet to clear the field
      this.props.onChange(id, '', true);
    }

    return (
      <Form.Field error={hasError} disabled={disabled}>
        <label>
          {this.props.item.title} {disabled}
        </label>
        <p>{text}</p>
        {this.renderQuestionCategory(this.isRefused() ? '' : value, disabled)}
        {this.renderRefuseCheckbox(disabled)}
      </Form.Field>
      /*
      <div
        className={`question item ${hasError ? 'error' : ''} ${
          disabled ? 'disabled' : ''
        }`}
      >
        <p>{this.props.item.title}</p>
        <div className="text">{text}</div>
        {this.renderQuestionCategory(this.isRefused() ? '' : value, disabled)}
        {this.renderRefuseCheckbox(disabled)}
        {hasError && <div className="error-message">{this.state.error}</div>}
        {required && !value && (
          <div className="error-message">This filed is required</div>
        )}
      </div>
      */
    );
  }
}
