// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Detail.css';

type Props = {
  updatePrinterDetails: (ip: string) => void,
  removePrinterDetails: () => void,
  match: {
    params: {
      ip: string
    }
  },
  // printers: Array,
  details: Array
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
      details,
      match
    } = this.props;
    return (
      <div>
        <div className="sticky-top">
          <Link to="/network">
            <button className="btn btn-primary m-2">
              <i className="fa fa-arrow-left" />
            </button>
          </Link>
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
        <div className="flex m-2">
          <h1>{match.params.ip}</h1>
          <div className={styles.printerCard} />
          {details.map(detail => (
            <div key={detail.oid}>
              {detail.oid} {detail.value.toString()}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
