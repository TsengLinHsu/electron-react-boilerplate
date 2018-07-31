// @flow
// import Bonjour from 'bonjour';
// import util from 'util';
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

export function walkPrinterDetails(ip: string) {
  const version = snmp.Version2c;
  const session = snmp.createSession(ip, 'public', { version });

  const oid = '1.3.6.1.2.1.2.2';

  function doneCb(error) {
    if (error) console.error(error.toString());
  }

  function feedCb(varbinds) {
    for (let i = 0; i < varbinds.length; i += 1) {
      if (snmp.isVarbindError(varbinds[i]))
        console.error(snmp.varbindError(varbinds[i]));
      else console.log(`${varbinds[i].oid}|${varbinds[i].value}`);
    }
  }

  const maxRepetitions = 20;

  // The maxRepetitions argument is optional, and will be ignored unless using
  // SNMP verison 2c
  session.walk(oid, maxRepetitions, feedCb, doneCb);
}

export function updatePrinterDetails(ip: string) {
  return (
    dispatch: (action: actionType) => void
    // getState: () => printerStateType
  ) => {
    dispatch(removePrinterDetails());
    // const { printers } = getState();

    function pollDeviceDetails(session, device, pollCb) {
      const newDevice = device;
      console.log('getting system properties...');
      const oids = [
        '1.3.6.1.2.1.1.1.0',
        '1.3.6.1.2.1.1.5.0',
        '1.3.6.1.2.1.1.6.0'
      ];
      session.get(oids, (error, varbinds) => {
        if (error) {
          pollCb(error, null);
        } else {
          for (let i = 0; i < varbinds.length; i += 1) {
            if (snmp.isVarbindError(varbinds[i])) {
              console.error(snmp.varbindError(varbinds[i]));
              return;
            }
          }

          newDevice.ip = ip;
          newDevice.name = varbinds[0].value.toString();
          newDevice.description = varbinds[1].value.toString();
          newDevice.location = varbinds[2].value.toString();

          pollDeviceFullCap(session, newDevice, pollCb);
        }
      });
    }

    function pollDeviceFullCap(session, device, pollCb) {
      const newDevice = device;
      console.log('getting full cap...');
      const oids = [
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
          pollCb(error, null);
        } else {
          for (let i = 0; i < varbinds.length; i += 1) {
            if (snmp.isVarbindError(varbinds[i])) {
              console.error(snmp.varbindError(varbinds[i]));
              return;
            }
          }
          // Cyan Magenta Yellow Black
          newDevice.cTonerCartridgeFullCap = varbinds[0].value;
          newDevice.mTonerCartridgeFullCap = varbinds[1].value;
          newDevice.yTonerCartridgeFullCap = varbinds[2].value;
          newDevice.bTonerCartridgeFullCap = varbinds[3].value;

          pollDeviceRemainCap(session, newDevice, pollCb);
        }
      });
    }

    function pollDeviceRemainCap(session, device, pollCb) {
      const newDevice = device;
      console.log('getting remain cap...');
      const oids = [
        '1.3.6.1.2.1.43.11.1.1.9.1.1',
        '1.3.6.1.2.1.43.11.1.1.9.1.2',
        '1.3.6.1.2.1.43.11.1.1.9.1.3',
        '1.3.6.1.2.1.43.11.1.1.9.1.4',
        '1.3.6.1.2.1.43.11.1.1.9.1.5',
        '1.3.6.1.2.1.43.11.1.1.9.1.6',
        '1.3.6.1.2.1.43.11.1.1.9.1.7',
        '1.3.6.1.2.1.43.11.1.1.9.1.8',
        '1.3.6.1.2.1.43.11.1.1.9.1.9'
      ];
      session.get(oids, (error, varbinds) => {
        if (error) {
          pollCb(error, null);
        } else {
          for (let i = 0; i < varbinds.length; i += 1) {
            if (snmp.isVarbindError(varbinds[i])) {
              console.error(snmp.varbindError(varbinds[i]));
              return;
            }
          }

          newDevice.cTonerCartridgeRemainCap = varbinds[0].value;
          newDevice.mTonerCartridgeRemainCap = varbinds[1].value;
          newDevice.yTonerCartridgeRemainCap = varbinds[2].value;
          newDevice.bTonerCartridgeRemainCap = varbinds[3].value;

          pollCb(null, newDevice);
        }
      });
    }

    function pollDevice(session, device, pollCb) {
      pollDeviceDetails(session, device, pollCb);
    }

    const version = snmp.Version2c;
    const session = snmp.createSession(ip, 'public', { version });

    pollDevice(session, {}, (error, device) => {
      if (error) {
        console.error(error.toString());
      } else {
        // console.warn(util.inspect(device, { depth: 3 }));
        session.close();
        dispatch(addPrinterDetails(ip, device));
      }
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
