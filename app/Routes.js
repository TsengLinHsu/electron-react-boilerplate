/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import AboutPage from './containers/AboutPage';
import NetworkPage from './containers/NetworkPage';
import CounterPage from './containers/CounterPage';
import DetailPage from './containers/DetailPage';
import SettingPage from './containers/SettingPage';
import ScrollToTop from './scrollToTop';

export default () => (
  <ScrollToTop>
    <App>
      <Switch>
        <Route path={routes.NETWORK} component={NetworkPage} />
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.DETAIL} component={DetailPage} />
        <Route path={routes.SETTING} component={SettingPage} />
        <Route path={routes.ABOUT} component={AboutPage} />
        <Route exact path="/" render={() => <Redirect to={routes.NETWORK} />} />
      </Switch>
    </App>
  </ScrollToTop>
);
