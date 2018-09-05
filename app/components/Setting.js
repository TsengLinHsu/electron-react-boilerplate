// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import Input from '@material-ui/core/Input';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import FormControl from '@material-ui/core/FormControl';
// import AccessTimeIcon from '@material-ui/icons/AccessTime';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import VisibilityIcon from '@material-ui/icons/Visibility';
import FilterLink from '../containers/FilterLink';
import { VisibilityFilters } from '../actions/printer';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  margin: {
    marginRight: theme.spacing.unit,
    marginLeft: theme.spacing.unit
  }
});

type Props = {
  classes: {}
};

class Setting extends Component<Props> {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     checked: [],
  //     timer: ''
  //   };
  // }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List subheader={<ListSubheader>Settings</ListSubheader>}>
          <ListItem>
            <ListItemIcon>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText primary="Show" />
            <ListItemSecondaryAction className={classes.margin}>
              <FilterLink filter={VisibilityFilters.SHOW_ALL}>All</FilterLink>
              <FilterLink filter={VisibilityFilters.SHOW_ONLINE}>
                Online
              </FilterLink>
              <FilterLink filter={VisibilityFilters.SHOW_FAVORITE}>
                Favorite
              </FilterLink>
            </ListItemSecondaryAction>
          </ListItem>
          {/* <ListItem>
            <ListItemIcon>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText primary="Refresh time" />
            <ListItemSecondaryAction>
              <FormControl
                className={classes.margin}
                aria-describedby="weight-helper-text"
              >
                <Input
                  id="number"
                  label="Number"
                  value={this.state.timer}
                  onChange={this.handleChange('timer')}
                  type="number"
                  className={classes.margin}
                  endAdornment={
                    <InputAdornment position="end">s</InputAdornment>
                  }
                />
              </FormControl>
            </ListItemSecondaryAction>
          </ListItem> */}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(Setting);
