// @flow
import React from 'react';
import classNames from 'classnames';
import red from '@material-ui/core/colors/red';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PowerOnIcon from '@material-ui/icons/Power';
import PowerOffIcon from '@material-ui/icons/PowerOff';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import cm315z from '../../resources/imgs/cm315z.jpg';
import type { Printer } from '../reducers/types';

const styles = theme => ({
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
  }
});

type Props = {
  classes: {},
  printer: Printer,
  updatePrinterDetails: () => void,
  handleFavorite: () => void
};

const PrinterItem = ({
  classes,
  printer,
  updatePrinterDetails,
  handleFavorite
}: Props) => (
  <Grid item key={printer.name} sm={6} md={4} lg={3} xl={2}>
    <Card className={classes.card}>
      <CardActionArea
        disabled={!printer.alive}
        component={Link}
        to={`/detail/${printer.address}`}
        onClick={() => updatePrinterDetails(printer.address)}
      >
        <CardMedia className={classes.media} image={cm315z} />
        <CardContent>
          <div className={classes.root}>
            <Avatar
              aria-label="Recipe"
              className={classNames({
                [classes.online]: printer.alive,
                [classes.offline]: !printer.alive
              })}
            >
              {printer.alive ? <PowerOnIcon /> : <PowerOffIcon />}
            </Avatar>
            <Typography
              className={classes.cardName}
              variant="body1"
              gutterBottom
            >
              {printer.name}
            </Typography>
          </div>
          <Typography variant="caption" align="right">
            {printer.address}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.actions} disableActionSpacing>
        <IconButton
          className={classNames({
            [classes.favorite]: printer.favorite
          })}
          aria-label="Add to favorites"
          onClick={() => handleFavorite(printer)}
        >
          <FavoriteIcon />
        </IconButton>
      </CardActions>
    </Card>
  </Grid>
);

export default withStyles(styles)(PrinterItem);
