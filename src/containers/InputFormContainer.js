import React, { Component, PropTypes } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FieldGroup } from '../components/FieldGroup';
import directual from '../modules/directual';

export class InputFormContainer extends Component {

  static propTypes = {
    fields: PropTypes.arrayOf(React.PropTypes.object).isRequired,
    // groups: PropTypes.arrayOf(React.PropTypes.object).isRequired,
    structure: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      form: {},
      structure: this.props.structure,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    directual
      .api
      .structure(this.state.structure)
      .createAndValidate(this.state.form)
      .then((resp) => {
        console.log(resp);
      });
  }

  onChange(event, value, element) {
    const form = this.state.form;
    let val;
    let el;
    if (event === null) {
      val = value;
      el = element.name;
    } else {
      val = event.target.value;
      el = event.target.id;
    }
    form[el] = val;
    this.setState({ form: this.state.form });
  }

  render() {
    return (
      <div className="inputContent">
        <Form onSubmit={this.onSubmit} name="form" className="inputForm">
          {this.props.fields.map(field => (
            !field.tags.includes('system') &&
            (
              <FieldGroup
                key={field.sysName}
                id={field.sysName}
                type={field.dataType}
                label={field.name}
                name={field.sysName}
                placeholder="Введите значение"
                onChange={this.onChange}
              />
            )
          ))}
          <Button type="submit">
            Отправить
          </Button>
        </Form>
      </div>
    );
  }
}

export default InputFormContainer;
