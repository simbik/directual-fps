import React, { Component, PropTypes } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import Datetime from 'react-datetime';
import moment from 'moment';
import directual from '../modules/directual/';


export class FieldGroup extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    required: PropTypes.bool.isRequired,
    help: PropTypes.string,
    link: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    help: '',
    link: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fieldName: props.name,
      linkFields: [],
      field: '',
      link: '',
    };
    if (this.props.type === 'link') {
      const link = this.props.link;
      directual.api.structure(link).getMetaInfo().then((metaResult) => {
        const { fields: linkFields } = metaResult.result;
        this.setState({ linkFields, link });
      });
    }
    this.linkSearch = this.linkSearch.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onLinkChange = this.onLinkChange.bind(this);
  }

  onDateChange(date) {
    const { onChange } = this.props;
    let value;
    if (date instanceof moment) {
      value = date.format();
    } else {
      value = date;
    }
    onChange(null, value, this.state.fieldName);
  }

  onLinkChange(selected) {
    const { onChange } = this.props;
    const value = selected[0].id;
    onChange(null, value, this.state.fieldName);
  }

  linkSearch(query) {
    if (!query) {
      return;
    }

    const { link, linkFields } = this.state;
    const filterList = linkFields.map(field => (
      { field: field.sysName, value: query, exp: 'like' }
    ));
    const linkView = linkFields.filter(field => (
      field.tags.includes('linkview')
    ));
    const { sysName: linkViewField } = linkView[0];
    const filters = [
      {
        operator: 'OR',
        filters: filterList,
      },
    ];
    const searchData = {
      filters,
      fetch: '',
      fields: '',
      pageSize: 5,
      page: 0,
      allObjects: true,
    };
    directual.api.structure(link).search(searchData).then((dataResult) => {
      const { list } = dataResult.result;
      const data = list.map(el => (
        {
          id: el.obj.id,
          name: linkViewField ? el.obj[linkViewField] : el.obj.id,
        }
      ));
      this.setState({ data });
    });
  }

  render() {
    const { id, label, help, type, link, onChange, required, ...other } = this.props;
    let field;
    let renderField;
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
        field = (<Datetime
          onChange={this.onDateChange}
          locale="ru"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm"
          inputProps={{ placeholder: 'Выберите дату', required }}
          closeOnSelect
          closeOnTab
          utc
          {...other}
        />);
        break;
      case 'link':
        field = (<AsyncTypeahead
          options={this.state.data}
          allowNew={false}
          multiple={false}
          labelKey="name"
          onChange={this.onLinkChange}
          onSearch={this.linkSearch}
          placeholder="Поиск объекта"
          emptyLabel="Ничего не найдено"
          promptText="Наберите для поиска"
          searchText="Поиск..."
          required={required}
        />);
        break;
      default:
        field = (<FormControl type="text" onChange={onChange} required={required} {...other} />);
        break;
    }
    if (field) {
      renderField = (<FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        {field}
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>);
    } else {
      renderField = '';
    }
    return (
      <div className="fieldGroup">{renderField}</div>
    );
  }
}

export default FieldGroup;
