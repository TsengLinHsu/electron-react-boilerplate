// @flow
// import Bonjour from 'bonjour';
import snmp from 'net-snmp';
// import type { printerStateType } from '../reducers/printers';

type actionType = {
  +type: string
};

export const UPDATE_PRINTER_DETAILS = 'UPDATE_PRINTER_DETAILS';
export const REMOVE_PRINTER_DETAILS = 'REMOVE_PRINTER_DETAILS';

export function removePrinterDetails() {
  return {
    type: REMOVE_PRINTER_DETAILS
  };
}

export function updatePrinterDetails(ip: string) {
  return (
    dispatch: (action: actionType) => void
    // getState: () => printerStateType
  ) => {
    dispatch(removePrinterDetails());
    // const { printers } = getState();

    const session = snmp.createSession(ip, 'public');

    const oids = [
      '1.3.6.1.2.1.1.1.0',
      '1.3.6.1.2.1.1.5.0',
      '1.3.6.1.2.1.1.6.0',
      '1.3.6.1.2.1.43.18.1.1.8.1.1',
      '1.3.6.1.2.1.43.18.1.1.8.1.2',
      '1.3.6.1.4.1.2699.1.2.1.2.1.1.2.1',
      '1.3.6.1.2.1.43.11.1.1.8.1.1',
      '1.3.6.1.2.1.43.11.1.1.8.1.2',
      '1.3.6.1.2.1.43.11.1.1.8.1.3',
      '1.3.6.1.2.1.43.11.1.1.8.1.4',
      '1.3.6.1.2.1.43.11.1.1.8.1.5',
      '1.3.6.1.2.1.43.11.1.1.8.1.6',
      '1.3.6.1.2.1.43.11.1.1.8.1.7',
      '1.3.6.1.2.1.43.11.1.1.8.1.8',
      '1.3.6.1.2.1.43.11.1.1.8.1.9'
    ];

    session.get(oids, (error, varbinds) => {
      if (error) {
        console.error(error);
      } else {
        for (let i = 0; i < varbinds.length; i += 1)
          if (snmp.isVarbindError(varbinds[i]))
            console.error(snmp.varbindError(varbinds[i]));
        // else console.log(`${varbinds[i].oid} = ${varbinds[i].value}`);
      }
      // console.log(varbinds);
      dispatch(addPrinterDetails(ip, varbinds));
      // If done, close the session
      session.close();
    });

    session.trap(snmp.TrapType.LinkDown, error => {
      if (error) console.error(error);
    });
  };
}

export function addPrinterDetails(ip: string, Details) {
  return {
    ipv4: ip,
    details: Details,
    type: UPDATE_PRINTER_DETAILS
  };
}
