// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardImg,
  CardText
} from 'reactstrap';
import styles from './Network.css';
import cm315z from '../../resources/imgs/cm315z.jpg';

type Props = {
  startBonjour: () => void,
  removeAllPrinter: () => void,
  togglePrinterDetails: (IPv4: string) => void,
  printers: Array
};

export default class Network extends Component<Props> {
  props: Props;

  // componentDidMount() {
  //   this.props.startBonjour();
  // }

  render() {
    const {
      startBonjour,
      removeAllPrinter,
      togglePrinterDetails,
      printers
    } = this.props;
    return (
      <div>
        <div className="sticky-top">
          <Link to="/">
            <button className="btn btn-primary m-2">
              <i className="fa fa-arrow-left" />
            </button>
          </Link>
          <button className="btn btn-primary m-2" onClick={startBonjour}>
            <i className="fa fa-refresh" />
          </button>
          <button className="btn btn-primary m-2" onClick={removeAllPrinter}>
            <i className="fa fa-minus" />
          </button>
        </div>
        <div className="d-flex flex-wrap">
          {printers.map(printer => (
            <div className={styles.printerCard} key={printer.name}>
              <Card>
                <CardImg
                  className={styles.printerCardImg}
                  src={cm315z}
                  alt="Card image cap"
                />
                <CardBody>
                  <CardTitle>{printer.name}</CardTitle>
                  <CardSubtitle>Addresses</CardSubtitle>
                  <CardText>{printer.referer.address}</CardText>
                  {/* <Link
                    to={{
                      pathname: '/detail',
                      state: { ip: printer.referer.address }
                    }}
                  > */}
                  <Link to={`/detail/${printer.referer.address}`}>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        togglePrinterDetails(printer.referer.address)
                      }
                    >
                      Details
                    </button>
                  </Link>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
