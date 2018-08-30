// @flow
import React from 'react';
import classNames from 'classnames';
import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import red from '@material-ui/core/colors/red';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddIcon from '@material-ui/icons/Add';
import PowerOnIcon from '@material-ui/icons/Power';
import PowerOffIcon from '@material-ui/icons/PowerOff';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import cm315z from '../../resources/imgs/cm315z.jpg';
import type { Printer } from '../reducers/types';

const styles = theme => ({
  appBar: {
    position: 'relative'
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4
  },
  chip: {
    margin: theme.spacing.unit
  },
  checking: {
    color: '#fff',
    backgroundColor: '#3F51B5'
  },
  online: {
    color: '#fff',
    backgroundColor: '#4CAF50'
  },
  offline: {
    color: '#fff',
    backgroundColor: '#F44336'
  },
  detailButton: {
    verticalAlign: 'bottom'
  },
  addButton: {
    margin: theme.spacing.unit * 4
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 300
  },
  cardMedia: {
    paddingTop: '56.25%' // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  cardName: {
    paddingLeft: '10px'
  },
  favorite: {
    color: red[500]
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  actions: {
    display: 'flex'
  },
  root: {
    display: 'flex'
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6
  }
});

type Props = {
  classes: {},
  startUpdatePrinters: () => void,
  updatePrinterDetails: () => void,
  addPrinterAndUpdateAlive: () => void,
  removeAllPrinter: () => void,
  toggleFavorite: () => void,
  printers: Array<Printer>
};

class Album extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      printerName: '',
      printerAddress: ''
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit = event => {
    const { addPrinterAndUpdateAlive } = this.props;
    const { printerName, printerAddress } = this.state;
    const service = {
      name: printerName,
      address: printerAddress,
      favorite: false
    };
    const { printers } = this.props;
    let isExist = false;

    if (
      printers.some(e => e.name === service.name) ||
      printers.some(e => e.address === service.address)
    ) {
      isExist = true;
    }

    if (!isExist) {
      this.setState({
        printerName: '',
        printerAddress: ''
      });

      const adapter = new LocalStorage('db');
      const db = low(adapter);
      db.defaults({ printers: [] }).write();
      db.get('printers')
        .push(service)
        .write();

      addPrinterAndUpdateAlive(service);
      this.handleClose();
    }
    event.preventDefault();
  };

  handleFavorite = printer => {
    const { toggleFavorite } = this.props;

    const service = {
      name: printer.name,
      address: printer.address,
      favorite: !printer.favorite
    };

    const adapter = new LocalStorage('db');
    const db = low(adapter);
    db.defaults({ printers: [] }).write();
    if (
      db
        .get('printers')
        .find({ name: printer.name })
        .size()
        .value() > 0
    ) {
      db.get('printers')
        .find({ name: printer.name })
        .assign(service)
        .write();
    } else {
      db.get('printers')
        .push(service)
        .write();
    }

    toggleFavorite(printer.name);
  };

  render() {
    const {
      classes,
      printers,
      startUpdatePrinters,
      updatePrinterDetails,
      removeAllPrinter
    } = this.props;

    const { open, printerName, printerAddress } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <main>
          <Dialog
            open={open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Add Printer by IP address
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                To add printer you need to fill the Name and Address.
              </DialogContentText>
              <form onSubmit={this.handleSubmit} autoComplete="off">
                <TextField
                  error={printers.some(e => e.name === printerName)}
                  margin="dense"
                  id="printerName"
                  label="Name"
                  type="text"
                  value={printerName}
                  onChange={this.handleChange('printerName')}
                  fullWidth
                />
                <TextField
                  error={printers.some(e => e.address === printerAddress)}
                  margin="dense"
                  id="printerAddress"
                  label="Address"
                  type="text"
                  pattern="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                  value={printerAddress}
                  onChange={this.handleChange('printerAddress')}
                  fullWidth
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleSubmit} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
          {/* Hero unit */}
          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
              <Typography
                variant="display3"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Printer Center
              </Typography>
              <Typography
                variant="title"
                align="center"
                color="textSecondary"
                paragraph
              >
                Time to discovery your printer.
              </Typography>
              <div className={classes.heroButtons}>
                <Grid container spacing={16} justify="center">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={startUpdatePrinters}
                    >
                      Refresh
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={removeAllPrinter}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
          <div className={classes.cardGrid}>
            {/* End hero unit */}
            <Grid container spacing={40}>
              {printers.map(card => (
                <Grid item key={card.name} sm={6} md={4} lg={3} xl={2}>
                  <Card className={classes.card}>
                    <CardActionArea
                      component={Link}
                      to={`/detail/${card.address}`}
                      onClick={() => updatePrinterDetails(card.address)}
                    >
                      <CardMedia
                        className={classes.media}
                        image={cm315z}
                        title={card.name}
                      />
                      <CardContent>
                        <div className={classes.root}>
                          <Avatar
                            aria-label="Recipe"
                            className={classNames({
                              [classes.online]: card.alive,
                              [classes.offline]: !card.alive
                            })}
                          >
                            {card.alive ? <PowerOnIcon /> : <PowerOffIcon />}
                          </Avatar>
                          <Typography
                            className={classes.cardName}
                            variant="body1"
                            gutterBottom
                          >
                            {card.name}
                          </Typography>
                        </div>
                        <Typography variant="caption" align="right">
                          {card.address}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions
                      className={classes.actions}
                      disableActionSpacing
                    >
                      <IconButton
                        className={classNames({
                          [classes.favorite]: card.favorite
                        })}
                        aria-label="Add to favorites"
                        onClick={() => this.handleFavorite(card)}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              <Button
                variant="fab"
                color="primary"
                aria-label="Add"
                className={classes.addButton}
                onClick={this.handleClickOpen}
              >
                <AddIcon />
              </Button>
            </Grid>
          </div>
        </main>
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="title" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography
            variant="subheading"
            align="center"
            color="textSecondary"
            component="p"
          >
            Something here to give the footer a purpose!
          </Typography>
        </footer>
        {/* End footer */}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Album);
