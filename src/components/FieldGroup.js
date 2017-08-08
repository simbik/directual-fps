import React, { Component, PropTypes } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import Datetime from 'react-datetime';
import moment from 'moment';


export class FieldGroup extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    help: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    help: '',
  };

  // constructor(props) {
  //   super(props);
  // }

  render() {
    const { id, label, help, type, onChange, ...other } = this.props;
    const onDateChange = function (value) {
      let date;
      if (value instanceof moment) {
        date = value.format();
      } else {
        date = value;
      }
      onChange(null, date, this);
    };

    const getField = function () {
      let field;
      switch (type) {
        case 'id':
          break;
        case 'number':
        case 'decimal':
          field = (<FormControl type="number" onChange={onChange} {...other} />);
          break;
        case 'email':
          field = (<FormControl type="email" onChange={onChange} {...other} />);
          break;
        case 'date':
          field = (<Datetime onChange={onDateChange} locale="ru" dateFormat="YYYY-MM-DD" timeFormat="HH:mm" inputProps={{ placeholder: 'Выберите дату' }} closeOnSelect closeOnTab utc {...other} />);
          break;
        default:
          field = (<FormControl type="text" onChange={onChange} {...other} />);
          break;
      }
      if (field) {
        return (<FormGroup controlId={id}>
          <ControlLabel>{label}</ControlLabel>
          {field}
          {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>);
      }
      return '';
    };

    return (
      <div className="fieldGroup">{getField()}</div>
    );
  }
}

export default FieldGroup;
