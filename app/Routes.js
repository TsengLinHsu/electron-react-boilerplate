/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import USBPage from './containers/USBPage';
import NetworkPage from './containers/NetworkPage';
import CounterPage from './containers/CounterPage';
import DetailPage from './containers/DetailPage';
import ScrollToTop from './scrollToTop';

export default () => (
  <ScrollToTop>
    <App>
      <Switch>
        <Route path={routes.USB} component={USBPage} />
        <Route path={routes.NETWORK} component={NetworkPage} />
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.DETAIL} component={DetailPage} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </App>
  </ScrollToTop>
);
