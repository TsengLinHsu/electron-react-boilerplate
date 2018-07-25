// @flow
// import Bonjour from 'bonjour';
import {
  ADD_NETWORK_PRINTER,
  REMOVE_ALL_PRINTER,
  TOGGLE_PRINTER_DETAILS
} from '../actions/printer';

export type printerStateType = {
  +printer: Array
};

// type actionType = {
//   +type: string
// };

export default function printers(state: Array = [], action) {
  switch (action.type) {
    case ADD_NETWORK_PRINTER:
      return state.concat([action.service]);
    case REMOVE_ALL_PRINTER:
      return []; // []; // https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
    case TOGGLE_PRINTER_DETAILS: {
      return state.map(printer => {
        if (printer.referer.address === action.ipv4) {
          return Object.assign({}, printer, {
            toggleDetails: true
          });
        }
        return printer;
      });
    }
    default:
      return state;
  }
}
