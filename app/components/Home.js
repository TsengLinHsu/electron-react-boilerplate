// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Select Interface</h2>
          <Link to="/usb">
            <i className="fa fa-usb fa-3x" />
          </Link>
          <Link to="/network">
            <i className="fa fa-wifi fa-3x" />
          </Link>
          <Link to="/counter">
            <i className="fa fa-calculator fa-3x" />
          </Link>
        </div>
      </div>
    );
  }
}
