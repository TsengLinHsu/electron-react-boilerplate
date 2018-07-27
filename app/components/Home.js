// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <h2 className="m-2">Select Interface</h2>
        <Link className="btn btn-primary m-2 fa fa-usb fa-3x" to="/usb" />
        <Link className="btn btn-primary m-2 fa fa-wifi fa-3x" to="/network" />
        {/* <Link className="btn btn-primary m-2 fa fa-calculator fa-3x" to="/counter" /> */}
      </div>
    );
  }
}
