// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Bonjour from 'bonjour';
import styles from './Network.css';

type Props = {
  startBonjour: () => void,
  removeAllPrinter: () => void,
  printers: Bonjour.Service
};

export default class Network extends Component<Props> {
  props: Props;

  render() {
    const { startBonjour, removeAllPrinter, printers } = this.props;
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={styles.btnGroup}>
          <button
            className={styles.btn}
            onClick={startBonjour}
            data-tclass="btn"
          >
            <i className="fa fa-refresh" />
          </button>
          <button
            className={styles.btn}
            onClick={removeAllPrinter}
            data-tclass="btn"
          >
            <i className="fa fa-minus" />
          </button>
          {printers.map(printer => (
            <div className={`printer ${styles.printer}`} data-tid="printer">
              {printer.name}
              <ul>{printer.addresses.map(address => <li>{address}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
