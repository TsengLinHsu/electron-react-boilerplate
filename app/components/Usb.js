// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Usb.css';

type Props = {};

export default class Usb extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
      </div>
    );
  }
}
