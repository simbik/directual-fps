import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import directual from '../modules/directual';

export class ViewTableContainer extends Component {


  static propTypes = {
    structure: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      pageSize: 20,
      page: 1,
      total: 0,
      filters: [],
      hiddenFields: [],
      data: [],
    };
    this.state.structure = this.props.structure;
    this.updateData(this.state.structure);
    this.sizePerPageListChange = this.sizePerPageListChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.toggleField = this.toggleField.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { structure, fields } = nextProps;
    this.state.structure = structure;
    this.state.fields = fields;
    this.state.hiddenFields = [];
    this.updateData(structure);
  }

  onFilterChange(filterObj) {
    let filters = [];
    filters = Object.keys(filterObj).map((key) => {
      const filter = filterObj[key];
      return {
        field: key,
        value: (filter.type !== 'NumberFilter') ? filter.value : filter.value.number,
        exp: (filter.type !== 'NumberFilter' || filter.value.comparator === '=') ? '==' : filter.value.comparator,
      };
    });
    this.setState({ filters });
    this.updateData();
  }

  onPageChange(page, sizePerPage) {
    this.state.pageSize = sizePerPage;
    this.state.page = page;
    this.updateData(this.state.structure);
  }

  sizePerPageListChange(sizePerPage) {
    this.state.pageSize = sizePerPage;
    this.updateData(this.state.structure);
  }

  toggleField(field) {
    const { hiddenFields } = this.state;
    if (hiddenFields.includes(field)) {
      hiddenFields.splice(hiddenFields.indexOf(field), 1);
    } else {
      hiddenFields.push(field);
    }
    this.setState({ hiddenFields });
  }

  updateData(structure) {
    const searchData = {
      filters: this.state.filters,
      fetch: '',
      fields: '',
      pageSize: this.state.pageSize,
      page: Number(this.state.page - 1),
      allObjects: true,
      orders: [],
    };
    directual.api.structure(structure).search(searchData).then((dataResult) => {
      const { list, pageInfo } = dataResult.result;
      const data = list.map(el => el.obj);
      this.setState({ data });
      this.state.total = pageInfo.tableSize;
      this.state.isLoading = false;
      this.forceUpdate();
    });
  }

  render() {
    const tableOptions = {
      page: this.state.page,  // which page you want to show as default
      sizePerPageList: [{
        text: '20', value: 20,
      }, {
        text: '50', value: 50,
      }, {
        text: '100', value: 100,
      }, {
        text: 'Все', value: this.state.total,
      }],
      sizePerPage: this.state.pageSize,
      pageStartIndex: 1,
      paginationSize: 5,
      paginationPosition: 'both',
      onPageChange: this.onPageChange,
      onSizePerPageList: this.sizePerPageListChange,
      onFilterChange: this.onFilterChange,
    };
    return (
      <div className="viewContent">
        <div className="viewFilters">
          <h4>Колонки</h4>
          {this.props.fields.map(field => (
            !field.tags.includes('system') &&
            (
              <Button
                key={field.sysName}
                onClick={() => this.toggleField(field.sysName)}
                bsStyle={this.state.hiddenFields.includes(field.sysName) ? 'danger' : 'success'}
                bsSize="xsmall"
                className="columnToggleBtn"
              >
                {field.name} {this.state.hiddenFields.includes(field.sysName) ? <Glyphicon glyph="plus" /> : <Glyphicon glyph="minus" />}
              </Button>
            )
          ))
          }
        </div>
        <div className="viewTable">
          <BootstrapTable
            data={this.state.data}
            options={tableOptions}
            fetchInfo={{ dataTotalSize: this.state.total }}
            pagination
            remote
          >
            {this.props.fields.map(field => (
              !field.tags.includes('system') &&
                (
                  <TableHeaderColumn
                    dataField={field.sysName}
                    key={field.sysName}
                    isKey={field.sysName === 'id'}
                    tdStyle={{ minWidth: '200px' }}
                    hidden={this.state.hiddenFields.includes(field.sysName)}
                    filter={field.dataType !== 'number' ?
                    { type: 'TextFilter' } :
                    {
                      type: 'NumberFilter',
                      numberComparators: ['=', '>', '<='],
                    }}
                    width="200px"
                  >
                    {field.name}
                  </TableHeaderColumn>
                )
              ))
            }
          </BootstrapTable>
        </div>
      </div>
    );
  }
}

export default ViewTableContainer;
