// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import type { Printer } from '../reducers/types';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`
  },
  button: {
    margin: `${theme.spacing.unit * 1}px 0 ${theme.spacing.unit * 1}px`
  },
  close: {
    padding: theme.spacing.unit / 2
  },
  progress: {
    margin: theme.spacing.unit * 2
  }
});

const styles1 = theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    display: 'flex',
    alignItems: 'center'
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

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
}

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);
class Detail extends Component<Props> {
  static defaultProps = {
    printers: []
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: '',
      open: false,
      failopen: false,
      isUpload: false
      // progress: 0.0
    };
  }

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

  onFileChange = event => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
    console.log(event.target.files[0]);
  };

  handleUpgrade = () => {
    this.setState({ isUpload: true });

    const { match } = this.props;
    var success = false;
    const NetcatClient = require('netcat/client');
    var nc = new NetcatClient();
    nc.on(
      'waitTimeout',
      function() {
        if (!success) {
          console.log('Event: waitTimeout');
          this.setState({ failopen: true });
          this.setState({ isUpload: false });
        }
      }.bind(this)
    );

    var fs = require('fs');
    var inputStream = fs.createReadStream(this.state.selectedFile.path);
    // nc.addr(match.params.address).port(9487).connect()

    inputStream.pipe(
      nc
        .addr(match.params.address)
        .port(9487)
        .waitTime(10000)
        .connect()
        .stream()
    );
    // nc.port(9487).k().listen().serve(Buffer.from(apache)).pipe(inputStream)

    inputStream.on('error', function(err) {
      console.log(err);
    });
    // var zipSize         = this.state.selectedFile.size;
    // var uploadedSize    = 0; // Incremented by on('data') to keep track of the amount of data we've uploaded
    // var percent = 0;
    // inputStream.on('data', function(buffer) {
    //   var segmentLength   = buffer.length;

    //   // Increment the uploaded data counter
    //   uploadedSize        += segmentLength;

    //   // Display the upload percentage
    //   // console.log("Progress:\t",((uploadedSize/zipSize*100).toFixed(2)+"%"));
    //   percent = uploadedSize/zipSize*100;
    //   this.setState({ progress: percent });
    // }.bind(this));

    // Some other events you might want for your code
    inputStream.on(
      'end',
      function() {
        console.log('Event: end');
        this.setState({ open: true });
        this.setState({ isUpload: false });
        success = true;
      }.bind(this)
    );
    inputStream.on('close', function() {
      console.log('Event: close');
      success = true;
    });

    // inputStream.on('waitTimeout', function() {
    //   console.log('Event: inputStream waitTimeout');
    // });
    // nc.on('waitTimeout', function() {
    //   console.log('Event: waitTimeout');
    // });

    // inputStream.on('timeout', function() {
    //   console.log('Event: inputStream timeout');
    // });
    // nc.on('timeout', function() {
    //   console.log('Event: timeout');
    // });

    // inputStream.on('error', function() {
    //   console.log('Event: inputStream err'+err);
    // });
    // nc.on('error', function(err) {
    //   console.log('Event: err'+err);
    // });
  };

  fileData = () => {
    if (this.state.selectedFile) {
      const { classes } = this.props;

      return (
        <div>
          {this.state.isUpload ? (
            <CircularProgress
              className={classes.progress}
              hidden={!this.state.isUpload}
            />
          ) : null}
          <h2>File Details:</h2>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Size: {this.state.selectedFile.size} bytes</p>
          <p>
            Last Modified:{' '}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            // startIcon={<CloudUploadIcon />}
            onClick={this.handleUpgrade}
            disabled={this.state.isUpload}
          >
            Upgrade by selected file
          </Button>
          {/* <CircularProgress variant="determinate" value={this.state.progress} /> */}
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      open: false,
      failopen: false
    });
  };

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
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Typography variant="title" className={classes.title}>
              Firmware upgrade
            </Typography>
            <Button variant="contained" component="label">
              Choose File
              <input type="file" hidden onChange={this.onFileChange} />
            </Button>
            {this.fileData()}
          </Grid>
          {/* <Button onClick={this.handleClick}>Open simple snackbar</Button> */}
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            open={this.state.open}
            autoHideDuration={6000}
            onClose={this.handleClose}
          >
            <MySnackbarContentWrapper
              onClose={this.handleClose}
              variant="success"
              message="Upload success!"
            />
          </Snackbar>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            open={this.state.failopen}
            autoHideDuration={6000}
            onClose={this.handleClose}
          >
            <MySnackbarContentWrapper
              onClose={this.handleClose}
              variant="error"
              message="Upload failed!"
            />
          </Snackbar>
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
