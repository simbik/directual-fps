import React from 'react';

import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader'; //eslint-disable-line
import { Provider } from 'react-redux';

import { configure } from './store/configureStore';
import App from './routes/index';
// import route from 'src/routes';


const store = configure();

render(
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('src/routes', () => {
    render(
      <AppContainer>
        <Provider store={store}>
          <App />
        </Provider>
      </AppContainer>,
      document.getElementById('root'),
    );
  });
}

