import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';

import AuthMiddleware from '../../modules/auth/middleware';
import PageNavbar from '../../components/PageNavbar';
import Footer from '../../components/Footer';
import InputForm from '../../containers/InputFormContainer';
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
    this.state.filters = [];
    this.state.fields = [];
    this.state.groups = [];
    this.state.data = [];
    this.state.structureMeta = [];
    this.updateStructure(structure);
  }

  updateStructure(structure) {
    this.state.isLoading = true;
    this.state.structure = structure;
    directual.api.structure(this.state.structure).getMetaInfo().then((metaResult) => {
      const { fields, groups } = metaResult.result;
      this.setState({ fields, groups });
      this.state.isLoading = false;
      this.forceUpdate();
    });
  }

  render() {
    const { logout } = this.props;
    const { header } = this.props.match.params;
    const { isLoading } = this.state;
    let viewContent;

    if (!isLoading) {
      viewContent = (<InputForm
        fields={this.state.fields}
        groups={this.state.groups}
        structure={this.state.structure}
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
            <Footer />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Input);
