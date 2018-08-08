// @flow
import React, { Component } from 'react';
import { Collapse } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Detail.css';
import cm315z from '../../resources/imgs/cm315z.jpg';

type Props = {
  updatePrinterDetails: (ip: string) => void,
  removePrinterDetails: () => void,
  walkPrinterDetails: (ip: string) => void,
  match: {
    params: {
      ip: string
    }
  },
  // printers: Array,
  details: object
};

// function isThisPrinter(printers) {
//   return printers.referer.address === match.params.ip;
// }

export default class Detail extends Component<Props> {
  props: Props;
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  componentDidMount() {
    this.props.updatePrinterDetails(this.props.match.params.ip);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  renderStatus() {
    const alertArray = this.props.details.prtAlertEntry;
    if (alertArray) {
      const newLocal = (
        <h4 className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted">Status</span>
          <span className="badge badge-secondary badge-pill">
            {alertArray.length}
          </span>
        </h4>
      );

      return newLocal;
    }
    return <div />;
  }

  renderStatusItem() {
    const alertArray = this.props.details.prtAlertEntry;
    // console.log(alertArray);
    if (alertArray) {
      return alertArray.map(alert => (
        <li
          className="list-group-item d-flex justify-content-between lh-condensed"
          key={alert.prtAlertIndex}
        >
          <div>
            <h6 className="my-0">{alert.prtAlertSeverityLevel}</h6>
            <small className="text-muted">{alert.prtAlertDescription}</small>
          </div>
        </li>
      ));
    }
    return <div />;
  }

  render() {
    const {
      updatePrinterDetails,
      removePrinterDetails,
      walkPrinterDetails,
      details,
      match
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
              <Link
                to="/network"
                className="navbar-brand d-flex align-items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="M16.62,2.99L16.62,2.99c-0.49-0.49-1.28-0.49-1.77,0l-8.31,8.31c-0.39,0.39-0.39,1.02,0,1.41l8.31,8.31   c0.49,0.49,1.28,0.49,1.77,0h0c0.49-0.49,0.49-1.28,0-1.77L9.38,12l7.25-7.25C17.11,4.27,17.11,3.47,16.62,2.99z"
                  />
                </svg>
                <strong>Back</strong>
              </Link>
              <button className="navbar-toggler" onClick={this.toggle}>
                <span className="navbar-toggler-icon" />
              </button>
            </div>
          </div>
        </header>
        <div className="container">
          <div className="py-5 text-center">
            <img className="col-md-6" src={cm315z} alt="" />
            {/* <h2>Checkout form</h2>
            <p className="lead">
              Below is an example form built entirely with Bootstrap's form
              controls. Each required form group has a validation state that can
              be triggered by attempting to submit the form without completing
              it.
            </p> */}
          </div>

          <div className="row">
            <div className="col-md-4 order-md-2 mb-4">
              {this.renderStatus()}
              <ul className="list-group mb-3">{this.renderStatusItem()}</ul>
              <div className="btn-group" role="group">
                <button
                  className="btn btn-secondary"
                  onClick={() => updatePrinterDetails(match.params.ip)}
                >
                  Refresh
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => removePrinterDetails()}
                >
                  Clear
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => walkPrinterDetails(match.params.ip)}
                >
                  Walk
                </button>
              </div>
            </div>
            <div className="col-md-8 order-md-1">
              <h4 className="mb-3">Details</h4>
              <dl>
                <dt>Product Name:</dt>
                <dd>{details.productName}</dd>
                <dt>Name:</dt>
                <dd>{details.name}</dd>
                <dt>Serial Number:</dt>
                <dd>{details.serialNumber}</dd>
                <dt>IP:</dt>
                <dd>{details.ip}</dd>
                <dt>Location:</dt>
                <dd>{details.location ? details.location : 'N/A'}</dd>
                <dt>Cyan Toner Cartridge:</dt>
                <dd>
                  {details.cTonerCartridgeRemainCap /
                    details.cTonerCartridgeFullCap *
                    100}%
                </dd>
                <dt>Magenta Toner Cartridge:</dt>
                <dd>
                  {details.mTonerCartridgeRemainCap /
                    details.mTonerCartridgeFullCap *
                    100}%
                </dd>
                <dt>Yellow Toner Cartridge:</dt>
                <dd>
                  {details.yTonerCartridgeRemainCap /
                    details.yTonerCartridgeFullCap *
                    100}%
                </dd>
                <dt>Black Toner Cartridge:</dt>
                <dd>
                  {details.bTonerCartridgeRemainCap /
                    details.bTonerCartridgeFullCap *
                    100}%
                </dd>
                <dt>Cyan Drum Cartridge:</dt>
                <dd>
                  {details.cDrumCartridgeRemainCap /
                    details.cDrumCartridgeFullCap *
                    100}%
                </dd>
                <dt>Magenta Drum Cartridge:</dt>
                <dd>
                  {details.mDrumCartridgeRemainCap /
                    details.mDrumCartridgeFullCap *
                    100}%
                </dd>
                <dt>Yellow Drum Cartridge:</dt>
                <dd>
                  {details.yDrumCartridgeRemainCap /
                    details.yDrumCartridgeFullCap *
                    100}%
                </dd>
                <dt>Black Drum Cartridge:</dt>
                <dd>
                  {details.bDrumCartridgeRemainCap /
                    details.bDrumCartridgeFullCap *
                    100}%
                </dd>
                <dt>Waste Toner Box:</dt>
                <dd>
                  {details.wasteTonerBoxRemainCap /
                    details.wasteTonerBoxFullCap *
                    100}%
                </dd>
                <dt>Right Side Cover:</dt>
                <dd>{details.rightSideCover}</dd>
                <dt>Rear Cover:</dt>
                <dd>{details.rearCover}</dd>
                <dt>DADF Cover:</dt>
                <dd>{details.dadfCover}</dd>
              </dl>
            </div>
          </div>

          <footer className="my-5 pt-5 text-muted text-center text-small">
            <p className="mb-1">© 2017-2018 Company Name</p>
          </footer>
        </div>
      </div>
    );
  }
}
