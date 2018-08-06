import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Network from '../components/Network';
import * as PrinterActions from '../actions/printer';
import * as DetailActions from '../actions/detail';

function mapStateToProps(state) {
  return {
    printers: state.printers
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, PrinterActions, DetailActions),
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Network);
