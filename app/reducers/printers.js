// @flow
// import Bonjour from 'bonjour';
import {
  ADD_NETWORK_PRINTER,
  REMOVE_ALL_PRINTER,
  UPDATE_PRINTER_DETAILS,
  REMOVE_PRINTER_DETAILS,
  UPDATE_PRINTER_ALIVE
} from '../actions/printer';
import type { Action, Printers } from './types';

const initialState: Printers = [];

export default function printers(
  state: Printers = initialState,
  action: Action
) {
  switch (action.type) {
    case ADD_NETWORK_PRINTER:
      return state.concat([action.printerShortInfo]);

    case REMOVE_ALL_PRINTER:
      return [];

    case UPDATE_PRINTER_DETAILS: {
      return state.map(printer => {
        if (printer.address === action.details.address) {
          return Object.assign({}, printer, {
            details: action.details
          });
        }
        return printer;
      });
    }

    case REMOVE_PRINTER_DETAILS: {
      return state.map(printer => {
        if (printer.address === action.address) {
          const newPrinter = printer;
          delete newPrinter.details;
          return newPrinter;
        }
        return printer;
      });
    }

    case UPDATE_PRINTER_ALIVE: {
      return state.map(printer => {
        if (printer.address === action.aliveData.address) {
          return Object.assign({}, printer, {
            alive: action.aliveData.alive
          });
        }
        return printer;
      });
    }

    default:
      return state;
  }
}
