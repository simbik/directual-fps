import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';

import AuthMiddleware from '../../modules/auth/middleware';
import PageNavbar from '../../components/PageNavbar';
import ViewTable from '../../containers/ViewTableContainer';
import directual from '../../modules/directual';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
  logout: () => AuthMiddleware.logout(),
}, dispatch);

export class View extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    match: PropTypes.objectOf(React.PropTypes.any).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      structure: '',
      structureMeta: [],
      fields: [],
      groups: [],
      isLoading: false,
    };
  }

  componentWillMount() {
    const { structure } = this.props.match.params;
    this.updateStructure(structure);
  }

  componentWillReceiveProps(nextProps) {
    const { structure } = nextProps.match.params;
    this.state.hiddenFields = [];
    this.state.fields = [];
    this.state.groups = [];
    this.state.structureMeta = [];
    this.updateStructure(structure);
  }

  updateStructure(structure) {
    this.state.isLoading = true;
    this.state.structure = structure;
    directual.api.structure(this.state.structure).getMetaInfo().then((metaResult) => {
      const { fields, groups } = metaResult.result;
      this.setState({ fields, groups, isLoading: false });
    });
  }

  render() {
    const { logout } = this.props;
    const { header } = this.props.match.params;
    const { isLoading } = this.state;
    let viewContent;

    if (!isLoading) {
      viewContent = (<ViewTable
        structure={this.state.structure}
        fields={this.state.fields}
      />);
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

export default connect(mapStateToProps, mapDispatchToProps)(View);
