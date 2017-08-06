import React from 'react';
import { render } from 'react-dom';
import nprogress from 'nprogress';
import configureStore from './store/configureStore';
import App from './routes/App';


const hotloader = require('react-hot-loader');


export default function () {
  // Inject global styles
  import('src/styles/app.scss');
  // Hide spinner from nprogress
  nprogress.configure({
    showSpinner: false,
  });

  // Configure Redux store
  const store = configureStore();

  // Render React
  const rootEl = document.getElementById('root');

  if (process.env.NODE_ENV === 'production') {
    render(<App store={store} />, rootEl);
  } else {
    const AppContainer = hotloader.AppContainer; // eslint-disable-line global-require
    // Trick babel to avoid hoisting <AppContainer />
    // transform-react-constant-elements
    const noHoist = {};

    render((
      <AppContainer {...noHoist}>
        <App store={store} />
      </AppContainer>
    ), rootEl);

    // Hot Reloading
    if (module.hot) {
      module.hot.accept('./routes/App', () => {
        render(
          <AppContainer {...noHoist}>
            <App store={store} />
          </AppContainer>,
          rootEl,
        );
      });
    }
  }
}
