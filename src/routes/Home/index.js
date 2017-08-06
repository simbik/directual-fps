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
            <PageNavbar />
            <PageHeader>Hello Landing Page</PageHeader>
            <a>now the login/signup routes are denied access</a>
            <h4 >
              <button onClick={logout}>Logout</button>
            </h4>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
