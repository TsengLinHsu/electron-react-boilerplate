// @flow
import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import './Network.css';
import cm315z from '../../resources/imgs/cm315z.jpg';

type Props = {
  startBonjour: () => void,
  addPrinterAndUpdateAlive: () => void,
  removeAllPrinter: () => void,
  updatePrinterDetails: () => void,
  checkPrinterAlive: () => void,
  printers?: Array<Printer>
};

export default class Network extends Component<Props> {
  static defaultProps = {
    printers: []
  };

  constructor(props) {
    super(props);
    this.state = { modal: false, printerName: '', printerAddress: '' };
    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const { startBonjour } = this.props;
    startBonjour();
  }

  componentDidMount() {
    const { checkPrinterAlive } = this.props;
    setInterval(() => checkPrinterAlive(), 60000);
  }

  componentWillUnmount() {}

  handleInputChange({ target }) {
    const { value, name } = target;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    const { addPrinterAndUpdateAlive } = this.props;
    const { printerName, printerAddress } = this.state;
    const service = {
      name: printerName,
      address: printerAddress
    };
    const { printers } = this.props;
    let isExist = false;
    for (let i = 0; i < printers.length; i += 1) {
      if (
        printers[i].name === service.name ||
        printers[i].address === service.address
      ) {
        isExist = true;
        break;
      }
    }

    if (!isExist) {
      addPrinterAndUpdateAlive(service);

      const adapter = new LocalStorage('db');
      const db = low(adapter);
      db.defaults({ printers: [] }).write();
      db.get('printers')
        .push(service)
        .write();

      this.toggle();
    }
    event.preventDefault();
  }

  toggle() {
    this.setState(prevState => ({ modal: !prevState.modal }));
  }

  render() {
    const {
      startBonjour,
      removeAllPrinter,
      updatePrinterDetails,

      printers
    } = this.props;
    const { modal, printerName, printerAddress } = this.state;

    const AliveBadges = ({ alive }) => {
      if (alive === undefined) {
        return <span className="badge badge-primary">Checking</span>;
      }

      return alive ? (
        <span className="badge badge-success">Online</span>
      ) : (
        <span className="badge badge-danger">Offline</span>
      );
    };

    const printerCards = printers.map(printer => (
      <div className="col-md-4" key={printer.name}>
        <div className="card mb-4 shadow-sm">
          <img src={cm315z} className="card-img-top" alt="" />
          <div className="card-body">
            <AliveBadges alive={printer.alive} />
            <p className="card-text">{printer.name}</p>
            <div className="d-flex justify-content-between align-items-center">
              <Link
                className="btn btn-sm btn-outline-secondary"
                to={`/detail/${printer.address}`}
                onClick={() => updatePrinterDetails(printer.address)}
              >
                Details
              </Link>
              <small className="text-muted">IP: {printer.address}</small>
            </div>
          </div>
        </div>
      </div>
    ));

    return (
      <div>
        <Modal isOpen={modal} toggle={this.toggle} fade={false} centered>
          <ModalHeader toggle={this.toggle}>Add Printer</ModalHeader>
          <ModalBody>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <p>Name</p>
                <input
                  className="form-control"
                  name="printerName"
                  type="text"
                  value={printerName}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group">
                <p>IP Address</p>
                <input
                  className="form-control"
                  name="printerAddress"
                  type="text"
                  value={printerAddress}
                  required
                  pattern="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="text-right">
                <input
                  className="btn btn-outline-secondary "
                  type="submit"
                  value="Add"
                />
              </div>
            </form>
          </ModalBody>
        </Modal>
        <main role="main">
          <section
            className="jumbotron text-center"
            style={{
              marginBottom: 0,
              backgroundColor: '#fff'
            }}
          >
            <div className="container" style={{ maxWidth: '40rem' }}>
              <h1 className="jumbotron-heading" style={{ fontWeight: '300' }}>
                Printer Center
              </h1>
              <p className="lead text-muted">Time to discovery your printer.</p>
              <p>
                <button
                  className="btn btn-primary m-1"
                  onClick={startBonjour}
                  type="button"
                >
                  Refresh
                </button>
                <button
                  className="btn btn-secondary m-1"
                  onClick={removeAllPrinter}
                  type="button"
                >
                  Clear
                </button>
              </p>
            </div>
          </section>
          <div className="album py-5 bg-light">
            <div className="container">
              <div className="row">
                {printerCards}
                <div className="h-100">
                  <button
                    className="btn btn-sm btn-outline-secondary ml-3"
                    style={{ width: '5rem', height: '5rem' }}
                    onClick={() => this.toggle()}
                    type="button"
                  >
                    Add...
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="my-5 pt-5 text-muted text-center text-small">
          <p className="mb-1">© 2017-2018 Company Name</p>
        </footer>
      </div>
    );
  }
}
