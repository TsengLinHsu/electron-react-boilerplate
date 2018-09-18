// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Tooltip from '@material-ui/core/Tooltip';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SettingsIcon from '@material-ui/icons/Settings';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';

export const MainListItems = () => (
  <div>
    <Tooltip title="Dashboard" placement="right">
      <ListItem button component={Link} to={routes.NETWORK} draggable="false">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </Tooltip>
    <Tooltip title="Settings" placement="right">
      <ListItem button component={Link} to={routes.SETTING} draggable="false">
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItem>
    </Tooltip>
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
        <Tooltip title={printer.name} placement="right" key={printer.address}>
          <ListItem
            button
            disabled={!printer.alive}
            component={Link}
            to={`/detail/${printer.address}`}
            onClick={() => updatePrinterDetails(printer.address)}
            draggable="false"
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary={printer.address} />
          </ListItem>
        </Tooltip>
      );
    }
    return null;
  });
};
