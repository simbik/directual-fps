import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';

import AuthMiddleware from '../../modules/auth/middleware';
import PageNavbar from '../../components/PageNavbar';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
  logout: () => AuthMiddleware.logout(),
}, dispatch);

export class Home extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
  };

    // constructor(props) {
    //   super(props);
    // }

  componentWillMount() {}
  componentWillUnmount() {}

  render() {
    const { logout } = this.props;
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <PageNavbar history={history} header="Directual FPS" logout={logout} />
            <PageHeader>Добро пожаловать!</PageHeader>
            <p>Начните с выбора структуры из меню.</p>

          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
