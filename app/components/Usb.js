// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import styles from './Usb.css';

type Props = {};

export default class Usb extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <div className="sticky-top">
          <Link className="btn btn-primary m-2 fa fa-arrow-left fa-3x" to="/" />
          <button className="btn btn-primary m-2" type="button">
            <i className="fa fa-refresh" />
          </button>
          <button className="btn btn-primary m-2" type="button">
            <i className="fa fa-minus" />
          </button>
        </div>
      </div>
    );
  }
}
