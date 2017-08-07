import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


export class ViewTableContainer extends Component {


  static propTypes = {
    fields: PropTypes.arrayOf(React.PropTypes.object).isRequired,
    data: PropTypes.arrayOf(React.PropTypes.object).isRequired,
    hiddenFields: PropTypes.arrayOf(React.PropTypes.string).isRequired,
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    sizePerPageListChange: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    toggleField: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.sizePerPageListChange = this.props.sizePerPageListChange.bind(this);
    this.onPageChange = this.props.onPageChange.bind(this);
    this.toggleField = this.props.toggleField.bind(this);
  }

  render() {
    const tableOptions = {
      page: this.props.page,  // which page you want to show as default
      sizePerPageList: [{
        text: '20', value: 20,
      }, {
        text: '50', value: 50,
      }, {
        text: '100', value: 100,
      }, {
        text: 'Все', value: this.props.total,
      }],
      sizePerPage: this.props.pageSize,
      pageStartIndex: 1,
      paginationSize: 5,
      paginationPosition: 'both',
      onPageChange: this.onPageChange,
      onSizePerPageList: this.sizePerPageListChange,
      onFilterChange: this.props.onFilterChange,
    };
    return (
      <div className="viewContent">
        <div className="viewFilters">
          <h4>Колонки</h4>
          {this.props.fields.map(field => <Button
            key={field.sysName}
            onClick={() => this.toggleField(field.sysName)}
            bsStyle={this.props.hiddenFields.includes(field.sysName) ? 'danger' : 'success'}
            bsSize="xsmall"
            className="columnToggleBtn"
          >{field.name} {this.props.hiddenFields.includes(field.sysName) ? <Glyphicon glyph="plus" /> : <Glyphicon glyph="minus" />}</Button>)}
        </div>
        <div className="viewTable">
          <BootstrapTable
            data={this.props.data}
            options={tableOptions}
            fetchInfo={{ dataTotalSize: this.props.total }}
            pagination
            remote
          >
            {this.props.fields.map(field =>
              <TableHeaderColumn
                dataField={field.sysName}
                key={field.sysName}
                isKey={field.sysName === 'id'}
                tdStyle={{ minWidth: '200px' }}
                hidden={this.props.hiddenFields.includes(field.sysName)}
                filter={field.dataType !== 'number' ?
                  { type: 'TextFilter' } :
                { type: 'NumberFilter',
                  numberComparators: ['=', '>', '<='] }}
                width="200px"
              >{field.name}</TableHeaderColumn>)}
          </BootstrapTable>
        </div>
      </div>
    );
  }
}

export default ViewTableContainer;
