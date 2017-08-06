import React from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Helmet from 'react-helmet';
// Routes
import { Home, Login } from '../../routes';
import Miss404 from '../../routes/Miss404';

import PrivateRoute from '../../utils/PrivateRoute';
import PublicRoute from '../../utils/PublicRoute';

const Layout = () => (
  <div className="pageWrapper">
    <Helmet titleTemplate="%s - Directual Universal Front" defaultTitle="Directual Universal Front" />

    <Switch>
      <PublicRoute path="/login" component={Login} exact />
      <PrivateRoute path="/home" component={Home} exact />
      <PrivateRoute path="/" component={Home} exact />
      <Route component={Miss404} />
    </Switch>

  </div>
);

export default Layout;

