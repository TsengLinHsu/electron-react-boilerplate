// @flow
// import Bonjour from 'bonjour';
import {
  ADD_NETWORK_PRINTER,
  REMOVE_ALL_PRINTER,
  TOGGLE_FAVORITE,
  UPDATE_PRINTER_DETAILS,
  REMOVE_PRINTER_DETAILS,
  UPDATE_PRINTER_ALIVE
} from '../actions/printer';
import type { Action, Printer } from './types';

const initialState: Array<Printer> = [];

export default function printers(
  state: Array<Printer> = initialState,
  action: Action
) {
  switch (action.type) {
    case ADD_NETWORK_PRINTER:
      return state.concat([action.printer]);

    case REMOVE_ALL_PRINTER:
      return [];

    case TOGGLE_FAVORITE:
      return state.map(
        printer =>
          printer.name === action.name
            ? { ...printer, favorite: !printer.favorite }
            : printer
      );

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
