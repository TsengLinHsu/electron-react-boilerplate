// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import type { Printer } from '../reducers/types';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`
  }
});

type Props = {
  classes: {},
  updatePrinterDetails: () => void,
  removePrinterDetails: () => void,
  walkPrinterDetails: () => void,
  printers?: Array<Printer>,
  match: {
    params: {
      address: string
    }
  }
};

class Detail extends Component<Props> {
  static defaultProps = {
    printers: []
  };

  componentDidMount() {
    const { updatePrinterDetails, match } = this.props;
    const intervalId = setInterval(
      () => updatePrinterDetails(match.params.address),
      60000
    );
    this.setState({ intervalId });
  }

  componentWillUnmount() {
    const { intervalId } = this.state;
    clearInterval(intervalId);
  }

  render() {
    const { printers, match, classes } = this.props;

    const selectedPrinter = printers.find(
      printer => printer.address === match.params.address
    );

    const AlertItem = ({ prtAlertSeverityLevel, prtAlertDescription }) => (
      <ListItem>
        <ListItemText
          primary={prtAlertDescription}
          secondary={prtAlertSeverityLevel}
        />
      </ListItem>
    );

    const AlertList = ({ alerts }) => {
      if (!alerts) {
        return null;
      }

      return (
        <React.Fragment>
          <Typography variant="title" className={classes.title}>
            Status
          </Typography>
          <div className={classes.demo}>
            <List>
              {alerts.map(alert => (
                <AlertItem key={alert.prtAlertIndex} {...alert} />
              ))}
            </List>
          </div>
        </React.Fragment>
      );
    };

    const DetailsList = ({ details }) => {
      if (!details) {
        return null;
      }

      return (
        <React.Fragment>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Typography variant="title" className={classes.title}>
              General
            </Typography>
            <div className={classes.demo}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Product Name:"
                    secondary={details.productName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Name:" secondary={details.name} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Serial Number:"
                    secondary={details.serialNumber}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Address:"
                    secondary={details.address}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Location:"
                    secondary={details.location ? details.location : 'N/A'}
                  />
                </ListItem>
              </List>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Typography variant="title" className={classes.title}>
              Toner Cartridge
            </Typography>
            <div className={classes.demo}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Cyan Toner Cartridge:"
                    secondary={`${(details.cTonerCartridgeRemainCap /
                      details.cTonerCartridgeFullCap) *
                      100}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Magenta Toner Cartridge:"
                    secondary={`${(details.mTonerCartridgeRemainCap /
                      details.mTonerCartridgeFullCap) *
                      100}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Yellow Toner Cartridge:"
                    secondary={`${(details.yTonerCartridgeRemainCap /
                      details.yTonerCartridgeFullCap) *
                      100}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Black Toner Cartridge:"
                    secondary={`${(details.bTonerCartridgeRemainCap /
                      details.bTonerCartridgeFullCap) *
                      100}%`}
                  />
                </ListItem>
              </List>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Typography variant="title" className={classes.title}>
              Drum Cartridge
            </Typography>
            <div className={classes.demo}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Cyan Drum Cartridge:"
                    secondary={`${(details.cDrumCartridgeRemainCap /
                      details.cDrumCartridgeFullCap) *
                      100}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Magenta Drum Cartridge:"
                    secondary={`${(details.mDrumCartridgeRemainCap /
                      details.mDrumCartridgeFullCap) *
                      100}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Yellow Drum Cartridge:"
                    secondary={`${(details.yDrumCartridgeRemainCap /
                      details.yDrumCartridgeFullCap) *
                      100}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Black Drum Cartridge:"
                    secondary={`${(details.bDrumCartridgeRemainCap /
                      details.bDrumCartridgeFullCap) *
                      100}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Waste Toner Box:"
                    secondary={`${(details.wasteTonerBoxRemainCap /
                      details.wasteTonerBoxFullCap) *
                      100}%`}
                  />
                </ListItem>
              </List>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Typography variant="title" className={classes.title}>
              Covers Status
            </Typography>
            <div className={classes.demo}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Right Side Cover:"
                    secondary={details.rightSideCover}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Rear Cover:"
                    secondary={details.rearCover}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="DADF Cover:"
                    secondary={details.dadfCover}
                  />
                </ListItem>
              </List>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <AlertList alerts={details.prtAlertEntry} />
          </Grid>
        </React.Fragment>
      );
    };

    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={16}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          {selectedPrinter ? (
            <DetailsList details={selectedPrinter.details} />
          ) : null}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Detail);
