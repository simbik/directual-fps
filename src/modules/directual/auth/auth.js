import config from '../config';
import { checkStatus, parseJSON } from '../net';

class Auth {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.networkId = config.NETWORK_ID;
  }

  auth() {
    const location = config.BASE_URI + config.AUTH_URI;
    const query = `?appID=${config.APP_ID}&appSecret=${config.APP_SECRET}`;
    const url = `${location}${query}`;

    const credentials = {
      username: this.username,
      password: this.password,
      networkId: this.networkId,
    };

    const options = {
      method: 'POST',
      body: JSON.stringify(credentials),
    };

    return window
      .fetch(url, options)
      .then(response =>
        // eslint-disable-next-line no-console
        response)
      .then(checkStatus)
      .then(parseJSON);
  }
}

class AuthClient {

  static logIn(credentials) {
    const username = credentials.username;
    const password = credentials.password;
    const authProvider = new Auth(username, password);
    const user = authProvider.auth().then();
    return user;
  }

}


export default new AuthClient();
