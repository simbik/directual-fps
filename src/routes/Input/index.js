import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';

import AuthMiddleware from '../../modules/auth/middleware';
import PageNavbar from '../../components/PageNavbar';
import directual from '../../modules/directual';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
  logout: () => AuthMiddleware.logout(),
}, dispatch);

export class Input extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    match: PropTypes.objectOf(React.PropTypes.any).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      structure: '',
      structureMeta: [],
      filters: [],
      hiddenFields: [],
      fields: [],
      groups: [],
      data: [],
      isLoading: false,
      pageSize: 20,
      page: 1,
      total: 0,
    };

    this.sizePerPageListChange = this.sizePerPageListChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.toggleField = this.toggleField.bind(this);
  }


  componentWillMount() {
    const { structure } = this.props.match.params;
    this.updateStructure(structure);
  }

  componentWillReceiveProps(nextProps) {
    const { structure } = nextProps.match.params;
    this.state.hiddenFields = [];
    this.state.filters = [];
    this.state.fields = [];
    this.state.groups = [];
    this.state.data = [];
    this.state.structureMeta = [];
    this.updateStructure(structure);
  }


  onPageChange(page, sizePerPage) {
    this.state.pageSize = sizePerPage;
    this.state.page = page;
    this.updateStructure(this.state.structure);
  }

  sizePerPageListChange(sizePerPage) {
    this.state.pageSize = sizePerPage;
    this.updateStructure(this.state.structure);
  }

  toggleColumn(field) {
    const { hiddenFields } = this.state;
    if (hiddenFields.includes(field)) {
      hiddenFields.splice(hiddenFields.indexOf(field), 1);
    } else {
      hiddenFields.push(field);
    }
    this.setState({ hiddenFields });
  }

  updateStructure(structure) {
    this.state.isLoading = true;
    this.state.structure = structure;
    directual.api.structure(this.state.structure).getMetaInfo().then((metaResult) => {
      const { fields, groups } = metaResult.result;
      this.setState({ fields, groups });
      this.state.isLoading = false;
      this.forceUpdate();
      console.log(this.state);
    });
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

  render() {
    const { logout } = this.props;
    const { header } = this.props.match.params;
    const { isLoading } = this.state;
    let viewContent;

    if (!isLoading) {
      viewContent = (<div className="content">asdfasdf</div>);
    } else {
      viewContent = (<div className="contentLoader">Загрузка...</div>);
    }

    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <PageNavbar history={history} header={header} logout={logout} />
            {viewContent}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Input);
