// @flow
import React, { Component } from 'react';
import { Collapse } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Network.css';
import cm315z from '../../resources/imgs/cm315z.jpg';

type Props = {
  startBonjour: () => void,
  removeAllPrinter: () => void,
  // togglePrinterDetails: (IPv4: string) => void,
  removePrinterDetails: () => void,
  printers: Array
};

export default class Network extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  componentWillMount() {
    this.props.startBonjour();
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const {
      startBonjour,
      removeAllPrinter,
      // togglePrinterDetails,
      removePrinterDetails,
      printers
    } = this.props;
    return (
      <div>
        <header className="sticky-top">
          <Collapse className="bg-dark" isOpen={this.state.collapse}>
            <div className="container">
              <div className="row">
                <div className="col-sm-8 col-md-7 py-4">
                  <h4 className="text-white">About</h4>
                  <p className="text-muted">
                    Add some information about the album below, the author, or
                    any other background context. Make it a few sentences long
                    so folks can pick up some informative tidbits. Then, link
                    them off to some social networking sites or contact
                    information.
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
                      <a href="#" className="text-white">
                        Like on Facebook
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white">
                        Email me
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Collapse>
          <div className="navbar navbar-dark bg-dark shadow-sm">
            <div className="container d-flex justify-content-between">
              <a href="#" className="navbar-brand d-flex align-items-center">
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
              </a>
              <button className="navbar-toggler" onClick={this.toggle}>
                <span className="navbar-toggler-icon" />
              </button>
            </div>
          </div>
        </header>
        <main role="main">
          <section
            className="jumbotron text-center"
            style={{
              marginBottom: 0,
              backgroundColor: '#fff'
            }}
          >
            <div className="container" style={{ maxWidth: '40rem' }}>
              <h1 className="jumbotron-heading" style={{ fontWeight: '300' }}>
                Printer Center
              </h1>
              <p className="lead text-muted">Time to discovery your printer.</p>
              <p>
                <button className="btn btn-primary m-1" onClick={startBonjour}>
                  Refresh
                </button>
                <button
                  className="btn btn-secondary m-1"
                  onClick={removeAllPrinter}
                >
                  Clear
                </button>
              </p>
            </div>
          </section>
          <div className="album py-5 bg-light">
            <div className="container">
              <div className="row">
                {printers.map(printer => (
                  <div className="col-md-4" key={printer.name}>
                    <div className="card mb-4 shadow-sm">
                      <img src={cm315z} className="card-img-top" alt="" />
                      <div className="card-body">
                        <p className="card-text">{printer.name}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <Link
                            className="btn btn-sm btn-outline-secondary"
                            to={`/detail/${printer.referer.address}`}
                            onClick={() => removePrinterDetails()}
                          >
                            Details
                          </Link>
                          <small className="text-muted">
                            IP: {printer.referer.address}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <footer className="my-5 pt-5 text-muted text-center text-small">
          <p className="mb-1">© 2017-2018 Company Name</p>
        </footer>
      </div>
    );
  }
}
