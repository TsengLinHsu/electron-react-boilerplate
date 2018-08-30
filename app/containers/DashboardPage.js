import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard';
import * as PrinterActions from '../actions/printer';

function mapStateToProps(state) {
  return {
    printers: state.printers
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PrinterActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
