// @flow
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import UsbDetect from 'usb-detection';
import Select from 'react-select';
import styles from './Home.css';

type Props = {};

// function ListItems(props) {
//   return <li>{props.value}</li>;
// }

// function DevicesList(props) {
//   if (props.devices) {
//     const listItems = props.devices.map(device => (
//       <ListItems key={device.locationId} value={device.deviceName} />
//     ));
//     return <ul>{listItems}</ul>;
//   } else return null;
// }

function Devices(props) {
  if (props.devices) {
    const elements = props.devices.map(device => (
      <div className={styles.DeviceCard} key={device.deviceAddress}>
        <h2>{device.deviceName}</h2>
        <i className={`${styles.materialicons} ${styles.DeviceIcon}`}>usb</i>
        <p className={styles.DeviceType}>USB Device</p>
        <div className={styles.Description}>
          <p>deviceAddress: {device.deviceAddress}</p>
          <p>deviceName: {device.deviceName}</p>
          <p>locationId: {device.locationId}</p>
          <p>manufacturer: {device.manufacturer}</p>
          <p>productId: {device.productId}</p>
          <p>serialNumber: {device.serialNumber}</p>
          <p>vendorId: {device.vendorId}</p>
        </div>
      </div>
    ));
    return elements;
  }
  return null;
}

export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      selectDevices: [{ value: '', label: '' }],
      selectedOption: ''
    };
  }

  componentDidMount() {
    UsbDetect.startMonitoring();
    UsbDetect.find((err, findedDevices) =>
      this.setState({
        devices: findedDevices,

        selectDevices: findedDevices.map(device => ({
          value: device.deviceAddress,
          label: `${device.deviceName} (${device.deviceAddress})`
        }))
      })
    );
  }

  componentWillUnmount() {}

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    // selectedOption can be null when the `x` (close) button is clicked
    if (selectedOption) {
      console.log(`Selected: ${selectedOption.label}`);
    }
  };

  render() {
    const { selectedOption } = this.state;

    return (
      <div className={styles.container} data-tid="container">
        <header>
          <h1>Main Page</h1>
        </header>
        <Select
          className={styles.Select}
          name="form-field-name"
          value={selectedOption}
          onChange={this.handleChange}
          options={this.state.selectDevices}
        />
        <main>
          {/* <DevicesList devices={this.state.devices} /> */}
          <Devices devices={this.state.devices} />
        </main>
        <footer>
          <h1>footer</h1>
        </footer>
      </div>
    );
  }
}
