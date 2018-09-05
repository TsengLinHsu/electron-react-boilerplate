// @flow
import React from 'react';
import './Network.css';
import type { Printer } from '../reducers/types';
import Album from './Album';

type Props = {
  startUpdatePrinters: () => void,
  addPrinterAndUpdateAlive: () => void,
  removeAllPrinter: () => void,
  updatePrinterDetails: () => void,
  printers: Array<Printer>
};

export default class Network extends React.Component<Props> {
  componentWillMount() {
    const { startUpdatePrinters } = this.props;
    startUpdatePrinters();
  }

  componentDidMount() {
    const { startUpdatePrinters } = this.props;
    const intervalId = setInterval(() => startUpdatePrinters(), 60000);
    this.setState({ intervalId });
  }

  componentWillUnmount() {
    const { intervalId } = this.state;
    clearInterval(intervalId);
  }

  render() {
    const { printers, ...other } = this.props;

    return (
      <div>
        <Album printers={printers} {...other} />
      </div>
    );
  }
}
