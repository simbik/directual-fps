import LocalStorageManager from '../../utils/LocalStorageManager';
import AuthActions from './actions';

export default class AuthMiddleware {

  // Signin Functions Starts
  static signin(credentials) {
    // console.log('test ', credentials);
    return (dispatch) => {
      dispatch(AuthActions.signin());
      AuthMiddleware.signinWithUserCredentials(dispatch, credentials);
    };
  }

  static signinWithUserCredentials(dispatch, credentials) {
    // fake login
    if (credentials) {
      setTimeout(() => {
        LocalStorageManager.setDirectualConfig(
          credentials.appId,
          credentials.appSecret,
          credentials.networkId,
        );
        dispatch(AuthActions.signinSuccessful());
      }, 500);
    } else {
      dispatch(AuthActions.signinRejected('error no credentials'));
    }
  }
  // Signin Functions Ends

  // Logout Functions Starts
  static logout() {
    return (dispatch) => {
      dispatch(AuthActions.logout());
      AuthMiddleware.logoutFromAPI(dispatch);
    };
  }

  static logoutFromAPI(dispatch) {
    LocalStorageManager.removeDirectualConfig();
    LocalStorageManager.clearLocalStorage();
    dispatch(AuthActions.logoutSuccessful());
  }
  // Logout Functions Ends

  // isLoggedIn
  static isLoggedIn() {
    return (dispatch) => {
      const directualConfig = LocalStorageManager.getDirectualConfig();
      if (directualConfig.appId && directualConfig.appSecret && directualConfig.networkId) {
        AuthMiddleware.ensureAuthenticated(dispatch, directualConfig);
      } else {
        dispatch(AuthActions.isLoggedInFailure());
      }
    };
  }

  // ensureAuthenticated
  static ensureAuthenticated(dispatch, directualConfig) {
    if (directualConfig) {
      // console.log('authentication successfull ');
      dispatch(AuthActions.isLoggedInSuccess());
    } else {
      // never gonna happen
      // console.log('authentication error ');
      dispatch(AuthActions.signinRejected('no config'));
    }
  }
}
