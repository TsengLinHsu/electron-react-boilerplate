// @flow
// import Bonjour from 'bonjour';
import {
  UPDATE_PRINTER_DETAILS,
  REMOVE_PRINTER_DETAILS
} from '../actions/detail';

// type actionType = {
//   +type: string
// };

export default function details(state: object = {}, action) {
  switch (action.type) {
    case UPDATE_PRINTER_DETAILS:
      return action.details;
    case REMOVE_PRINTER_DETAILS:
      return {};
    default:
      return state;
  }
}
