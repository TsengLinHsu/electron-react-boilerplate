// @flow
import * as React from 'react';
import Dashboard from './DashboardPage';

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <Dashboard>{children}</Dashboard>
      </React.Fragment>
    );
  }
}
