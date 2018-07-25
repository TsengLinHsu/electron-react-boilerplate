// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  // Card,
  // CardBody,
  // CardTitle,
  // CardSubtitle,
  // CardImg,
  // CardText,
  Button
} from 'reactstrap';
import styles from './Detail.css';

type Props = {
  updatePrinterDetails: (ip: string) => void,
  removePrinterDetails: () => void,
  match: {
    params: {
      ip: string
    }
  },
  // printers: Array,
  details: Array
};

// function isThisPrinter(printers) {
//   return printers.referer.address === match.params.ip;
// }

export default class Detail extends Component<Props> {
  props: Props;

  componentDidMount() {
    this.props.updatePrinterDetails(this.props.match.params.ip);
  }

  render() {
    const {
      updatePrinterDetails,
      removePrinterDetails,
      details,
      match
    } = this.props;
    return (
      <div>
        <div className="sticky-top">
          <Link to="/network">
            <Button>
              <i className="fa fa-arrow-left" />
            </Button>
          </Link>
          <Button onClick={() => updatePrinterDetails(match.params.ip)}>
            <i className="fa fa-refresh" />
          </Button>
          <Button onClick={removePrinterDetails}>
            <i className="fa fa-minus" />
          </Button>
        </div>
        <div className="flex mx-auto">
          <h1>{match.params.ip}</h1>
          <div className={styles.printerCard} />
          {details.map(detail => (
            <div key={detail.oid}>
              {detail.oid} {detail.value.toString()}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
