import * as React from 'react';
import { withRouter } from 'react-router-dom';

type Props = {
  children: React.Node,
  location: object
};

class ScrollToTop extends React.Component<Props> {
  props: Props;

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { children } = this.props;

    return children;
  }
}

export default withRouter(ScrollToTop);
