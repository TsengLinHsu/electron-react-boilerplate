// @flow
import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ListItemText from '@material-ui/core/ListItemText';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import { MainListItems, SecondaryListItems } from './listItems';
import type { Printer } from '../reducers/types';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto'
  },
  chartContainer: {
    marginLeft: -22
  },
  tableContainer: {
    height: 320
  },
  info: {
    backgroundColor: green[500]
  },
  warning: {
    backgroundColor: yellow[500]
  },
  error: {
    backgroundColor: red[500]
  }
});

type Props = {
  classes: {},
  printers: Array<Printer>,
  children: React.Node
};

class Dashboard extends React.Component<Props> {
  props: Props;

  state = {
    open: false,
    notificationOpen: false
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleToggle = () => {
    this.setState(state => ({ notificationOpen: !state.notificationOpen }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ notificationOpen: false });
  };

  render() {
    const { classes, children, printers } = this.props;
    const { open, notificationOpen } = this.state;

    const printersDetails = printers
      .filter(printer => printer.details != null)
      .map(printer => printer.details);

    const AlertIcon = ({ level }) => {
      switch (level) {
        case 'Other':
          return (
            <Avatar className={classes.info}>
              <InfoIcon />
            </Avatar>
          );
        case 'Critical':
          return (
            <Avatar className={classes.error}>
              <ErrorIcon />
            </Avatar>
          );
        case 'Warning':
          return (
            <Avatar className={classes.warning}>
              <WarningIcon />
            </Avatar>
          );
        default:
          return (
            <Avatar className={classes.info}>
              <InfoIcon />
            </Avatar>
          );
      }
    };

    const AlertItem = ({ alerts }) =>
      alerts.map(alert => (
        <ListItem key={alert.prtAlertIndex}>
          <AlertIcon level={alert.prtAlertSeverityLevel} />
          <ListItemText
            primary={alert.prtAlertDescription}
            secondary={alert.prtAlertSeverityLevel}
          />
        </ListItem>
      ));

    const PrintersAlerts = ({ address, prtAlertEntry }) => (
      <React.Fragment>
        <ListSubheader>{`Address: ${address}`}</ListSubheader>

        <AlertItem alerts={prtAlertEntry} />
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar
            position="absolute"
            className={classNames(classes.appBar, open && classes.appBarShift)}
          >
            <Toolbar disableGutters={!open} className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  open && classes.menuButtonHidden
                )}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="title"
                color="inherit"
                noWrap
                className={classes.title}
              >
                Dashboard
              </Typography>
              <IconButton
                color="inherit"
                buttonRef={node => {
                  this.anchorEl = node;
                }}
                aria-owns={notificationOpen ? 'menu-list-grow' : null}
                aria-haspopup="true"
                onClick={this.handleToggle}
              >
                <Badge badgeContent={printersDetails.length} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Popper
                open={notificationOpen}
                anchorEl={this.anchorEl}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    id="menu-list-grow"
                    style={{
                      transformOrigin:
                        placement === 'bottom' ? 'center top' : 'center bottom'
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={this.handleClose}>
                        <List>
                          {printersDetails.map(details => (
                            <PrintersAlerts
                              key={details.address}
                              {...details}
                            />
                          ))}
                        </List>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(
                classes.drawerPaper,
                !open && classes.drawerPaperClose
              )
            }}
            open={open}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              <MainListItems />
            </List>
            <Divider />
            <List>
              <SecondaryListItems {...this.props} />
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <React.Fragment>{children}</React.Fragment>
          </main>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Dashboard);
