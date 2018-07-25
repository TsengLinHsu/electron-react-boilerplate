// @flow
// import Bonjour from 'bonjour';
import {
  UPDATE_PRINTER_DETAILS,
  REMOVE_PRINTER_DETAILS
} from '../actions/detail';

export type detailStateType = {
  +detail: Array
};

// type actionType = {
//   +type: string
// };

export default function printers(state: Array = [], action) {
  switch (action.type) {
    case UPDATE_PRINTER_DETAILS:
      return action.details;
    case REMOVE_PRINTER_DETAILS:
      return [];
    default:
      return state;
  }
}
