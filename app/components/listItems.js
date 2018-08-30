// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SettingsIcon from '@material-ui/icons/Settings';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Grow from '@material-ui/core/Grow';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';

export const MainListItems = () => (
  <div>
    <ListItem button component={Link} to={routes.NETWORK}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Settings" />
    </ListItem>
  </div>
);

export const SecondaryListItems = props => (
  <div>
    <ListSubheader inset>Details</ListSubheader>
    <FavoriteList {...props} />
  </div>
);

const FavoriteList = props => {
  const { printers, updatePrinterDetails } = props;

  if (printers.length <= 0) {
    return null;
  }
  return printers.map(printer => {
    if (printer.favorite) {
      return (
        <Grow in={printer.favorite} key={printer.address}>
          <ListItem
            button
            component={Link}
            to={`/detail/${printer.address}`}
            onClick={() => updatePrinterDetails(printer.address)}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary={printer.address} />
          </ListItem>
        </Grow>
      );
    }
    return null;
  });
};
