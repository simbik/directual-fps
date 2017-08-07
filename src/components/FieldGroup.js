import React, { Component, PropTypes } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';


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

  constructor(props) {
    super(props);
    this.state = {
      form: {},
    };
  }


  render() {
    const state = this.state;
    const { id, label, help, type, onChange, ...other } = this.props;
    const onDateChange = function (value, formattedValue) {
      onChange(null, formattedValue, this);
      state.form[id] = formattedValue;
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
          field = (<DatePicker dateFormat="YYYY-MM-DD" onChange={onDateChange} value={state.form[id]} {...other} />);
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
