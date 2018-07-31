// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cm315z from '../../resources/imgs/cm315z_full.jpg';

// import styles from './Detail.css';

type Props = {
  updatePrinterDetails: (ip: string) => void,
  removePrinterDetails: () => void,
  // walkPrinterDetails: (ip: string) => void,
  match: {
    params: {
      ip: string
    }
  },
  // printers: Array,
  details: JSON
};

// function isThisPrinter(printers) {
//   return printers.referer.address === match.params.ip;
// }

export default class Detail extends Component<Props> {
  props: Props;

  componentDidMount() {
    this.props.updatePrinterDetails(this.props.match.params.ip);
  }

  render() {
    const {
      updatePrinterDetails,
      removePrinterDetails,
      // walkPrinterDetails,
      details,
      match
    } = this.props;
    return (
      <div>
        <div className="sticky-top">
          <Link
            className="btn btn-primary m-2 fa fa-arrow-left fa-3x"
            to="/network"
          />
          <button
            className="btn btn-primary m-2"
            onClick={() => updatePrinterDetails(match.params.ip)}
          >
            <i className="fa fa-refresh" />
          </button>
          <button
            className="btn btn-primary m-2"
            onClick={removePrinterDetails}
          >
            <i className="fa fa-minus" />
          </button>
        </div>
        <img
          src={cm315z}
          className="col-4 img-thumbnail rounded float-left m-2"
          alt="..."
        />
        <div className="flex m-2">
          <div className="card">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">IP: {details.ip}</li>
              <li className="list-group-item">Name: {details.name}</li>
              <li className="list-group-item">
                Description: {details.description}
              </li>
              <li className="list-group-item">
                Location: {details.location ? details.location : 'N/A'}
              </li>
              <li className="list-group-item">
                {' '}
                Cyan Toner Cartridge:{' '}
                {details.cTonerCartridgeRemainCap /
                  details.cTonerCartridgeFullCap *
                  100}%
              </li>
              <li className="list-group-item">
                Magenta Toner Cartridge:{' '}
                {details.mTonerCartridgeRemainCap /
                  details.mTonerCartridgeFullCap *
                  100}%
              </li>
              <li className="list-group-item">
                Yellow Toner Cartridge:{' '}
                {details.yTonerCartridgeRemainCap /
                  details.yTonerCartridgeFullCap *
                  100}%
              </li>
              <li className="list-group-item">
                Black Toner Cartridge:{' '}
                {details.bTonerCartridgeRemainCap /
                  details.bTonerCartridgeFullCap *
                  100}%
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
