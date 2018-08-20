import * as React from 'react';
import { withRouter } from 'react-router-dom';

type Props = {
  children: React.Node
};

class ScrollToTop extends React.Component<Props> {
  props: Props;

  componentDidUpdate(prevProps) {
    if (prevProps.history.action !== 'POP') {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { children } = this.props;

    return children;
  }
}

export default withRouter(ScrollToTop);
