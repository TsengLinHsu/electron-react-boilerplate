// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import routes from '../constants/routes.json';

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = { collapse: false };
    this.toggle = () =>
      this.setState(prevState => ({ collapse: !prevState.collapse }));
  }

  render() {
    const { children } = this.props;
    const { collapse } = this.state;
    const collapseNav = (
      <Collapse className="bg-dark" isOpen={collapse}>
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-md-7 py-4">
              <h4 className="text-white">About</h4>
              <p className="text-muted">
                me information about the album below, the author, or ckground
                context.Make it a few sentences long p some informative
                tidbits.Then, link them o tworking sites or contact information.
              </p>
            </div>
            <div className="col-sm-4 offset-md-1 py-4">
              <h4 className="text-white">Contact</h4>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-white">
                    Follow on Twitter
                  </a>
                </li>
                <li>
                  <Link to={routes.ABOUT} className="text-white">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Collapse>
    );

    const nav = (
      <div className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container d-flex justify-content-between">
          <Link
            to={routes.NETWORK}
            className="navbar-brand d-flex align-items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M10,19v-5h4v5c0,0.55,0.45,1,1,1h3c0.55,0,1-0.45,1-1v-7h1.7c0.46,0,0.68-0.57,0.33-0.87L12.67,3.6   c-0.38-0.34-0.96-0.34-1.34,0l-8.36,7.53C2.63,11.43,2.84,12,3.3,12H5v7c0,0.55,0.45,1,1,1h3C9.55,20,10,19.55,10,19z"
              />
            </svg>
            <strong>Home</strong>
          </Link>
          <button
            className="p-0 btn bg-transparent navbar-brand d-flex"
            onClick={this.toggle}
            type="button"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>
      </div>
    );

    return (
      <React.Fragment>
        <header className="sticky-top">
          {collapseNav}
          {nav}
        </header>
        <React.Fragment>{children}</React.Fragment>
      </React.Fragment>
    );
  }
}
