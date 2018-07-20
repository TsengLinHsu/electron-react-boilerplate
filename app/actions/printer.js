// @flow
import Bonjour from 'bonjour';
// import type { printerStateType } from '../reducers/printers';

type actionType = {
  +type: string
};

export const ADD_NETWORK_PRINTER = 'ADD_NETWORK_PRINTER';
export const REMOVE_ALL_PRINTER = 'REMOVE_ALL_PRINTER';

export function startBonjour() {
  return (
    dispatch: (action: actionType) => void
    // getState: () => printerStateType
  ) => {
    dispatch(removeAllPrinter());
    // const { printers } = getState();

    const bonjour = Bonjour();
    bonjour.find({ type: 'printer' }, service => {
      console.log(service);
      dispatch(addNetworkPrinter(service));
    });
  };
}

export function addNetworkPrinter(Service) {
  return {
    service: Service,
    type: ADD_NETWORK_PRINTER
  };
}

export function removeAllPrinter() {
  return {
    type: REMOVE_ALL_PRINTER
  };
}
