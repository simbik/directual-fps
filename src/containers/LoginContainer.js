import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// components
import AuthLogin from '../components/AuthLogin';
// middlewares
import AuthMiddleware from '../modules/auth/middleware';

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth.isAuthenticated,
  isProcessing: auth.isProcessing,
  isError: auth.isError,
  errorMessage: auth.errorMessage,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  signin: credentials => AuthMiddleware.signin(credentials),
}, dispatch);

class LoginContainer extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    isProcessing: PropTypes.bool,
    isError: PropTypes.bool,
    errorMessage: PropTypes.string,
    signin: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isAuthenticated: false,
    isProcessing: false,
    isError: false,
    errorMessage: '',
  }

  render() {
    const { isAuthenticated, isProcessing, isError, errorMessage, signin } = this.props;
    return (
      <AuthLogin
        isAuthenticated={isAuthenticated}
        isProcessing={isProcessing}
        isError={isError}
        errorMessage={errorMessage}
        signin={signin}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
