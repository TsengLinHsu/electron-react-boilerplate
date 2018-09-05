import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
});

type Props = {
  classes: {},
  active: boolean,
  children: React.Node,
  onClick: () => void
};

const Link = ({ classes, active, children, onClick }: Props) => (
  <Button
    variant="outlined"
    className={classes.button}
    onClick={onClick}
    disabled={active}
  >
    {children}
  </Button>
);

export default withStyles(styles)(Link);
