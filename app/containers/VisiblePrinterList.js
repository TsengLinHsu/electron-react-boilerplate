import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PrinterActions from '../actions/printer';
import PrinterList from '../components/PrinterList';

const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_ONLINE: 'SHOW_ONLINE',
  SHOW_FAVORITE: 'SHOW_FAVORITE'
};

const getVisiblePrinters = (printers, filter) => {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return printers;
    case VisibilityFilters.SHOW_ONLINE:
      return printers.filter(t => t.alive);
    case VisibilityFilters.SHOW_FAVORITE:
      return printers.filter(t => t.favorite);
    default:
      throw new Error(`Unknown filter: ${filter}`);
  }
};
const mapStateToProps = state => ({
  printers: getVisiblePrinters(state.printers, state.visibilityFilter)
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PrinterActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrinterList);
