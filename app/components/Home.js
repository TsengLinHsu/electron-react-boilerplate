// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
// import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className="text-center cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header className="masthead mb-auto">
          <div className="inner">
            <h3 className="masthead-brand">Status Monitor</h3>
            {/* <nav className="nav nav-masthead justify-content-center">
              <a className="nav-link active" href="#">
                Home
              </a>
              <a className="nav-link" href="#">
                Features
              </a>
              <a className="nav-link" href="#">
                Contact
              </a>
            </nav> */}
          </div>
        </header>

        <main role="main" className="inner cover">
          <h1 className="cover-heading">Start to discovery.</h1>
          <p className="lead">Discovery your printer by USB and Network.</p>
          <p className="lead">
            <Link className="btn btn-lg btn-outline-dark " to={routes.NETWORK}>
              Start
            </Link>
          </p>
        </main>

        <footer className="mastfoot mt-auto">
          <div className="inner">
            <p>© 2017-2018 Company Name</p>
          </div>
        </footer>
      </div>
    );
  }
}
