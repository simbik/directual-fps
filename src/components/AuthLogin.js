import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, PageHeader, Panel, FormControl, Button } from 'react-bootstrap';

class AuthLogin extends Component {

  static propTypes = {
    isProcessing: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
    signin: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      appId: '47ef71b0-9a6e-4ece-a35d-859d6ae6e2d4',
      appSecret: 'LDmhYaKZHzJ',
      networkId: '1604',
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const credentials = {
      appId: this.state.appId,
      appSecret: this.state.appSecret,
      networkId: this.state.networkId,
    };
    this.props.signin(credentials);
  }

  render() {
    const { isProcessing, isError, errorMessage } = this.props;
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Panel className="authWrapper">
              <div className="authFormWrapper">
                <div className="authFormRow">
                  <PageHeader>Вход</PageHeader>
                </div>
                <div className="authFormRow">
                  { isError ? <div>{errorMessage}</div> : null }
                </div>
                <form onSubmit={this.onSubmit} name="form" className="authFormRow">
                  <FormControl
                    value={this.state.appId}
                    onChange={e => this.setState({ appId: e.target.value })}
                    type="text"
                    placeholder="AppID"
                    required
                  />
                  <FormControl
                    value={this.state.appSecret}
                    onChange={e => this.setState({ appSecret: e.target.value })}
                    type="text"
                    placeholder="appSecret"
                    required
                  />
                  <FormControl
                    value={this.state.networkId}
                    onChange={e => this.setState({ networkId: e.target.value })}
                    type="text"
                    placeholder="networkId"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={
                      !this.state.appSecret
                    || !this.state.appId
                    || !this.state.networkId
                    || isProcessing
                    }
                    bsStyle="success"
                  >
                    { isProcessing ? 'Загрузка...' : 'Вход' }
                  </Button>
                </form>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default AuthLogin;
