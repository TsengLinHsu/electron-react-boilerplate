import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Setting from '../components/Setting';
import * as PrinterActions from '../actions/printer';

function mapStateToProps(state) {
  return {
    setting: state.setting
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PrinterActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Setting);
