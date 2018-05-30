// @flow
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import UsbDetect from 'usb-detection';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
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
      <div className="deviceCard" key={device.locationId}>
        {device.deviceName}
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
      devices: null,
      selectedOption: ''
    };
  }

  componentDidMount() {
    UsbDetect.startMonitoring();
    this.updateDevices(UsbDetect);

    UsbDetect.on('change', device => {
      console.log('change', device);
      this.updateDevices(UsbDetect);
    });
  }

  componentWillUnmount() {}

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    // selectedOption can be null when the `x` (close) button is clicked
    if (selectedOption) {
      console.log(`Selected: ${selectedOption.label}`);
    }
  };

  updateDevices(usbDetect) {
    usbDetect.find((err, devices) => {
      // console.log('find', devices, err);
      this.setState({
        devices
      });
      return true;
    });
  }

  render() {
    const { selectedOption } = this.state;

    return (
      <div>
        <div className={styles.container} data-tid="container">
          <Select
            name="form-field-name"
            value={selectedOption}
            onChange={this.handleChange}
            options={[
              { value: 'one', label: 'One' },
              { value: 'two', label: 'Two' }
            ]}
          />
          <main>
            {/* <DevicesList devices={this.state.devices} /> */}
            <Devices devices={this.state.devices} />
          </main>
        </div>
      </div>
    );
  }
}
