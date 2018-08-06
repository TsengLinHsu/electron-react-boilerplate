// @flow
// import Bonjour from 'bonjour';
// import util from 'util';
import snmp from 'net-snmp';
import fastDeepEqual from 'fast-deep-equal';
import type { detailsStateType } from '../reducers/details';

type actionType = {
  +type: string
};

export const UPDATE_PRINTER_DETAILS = 'UPDATE_PRINTER_DETAILS';
export const REMOVE_PRINTER_DETAILS = 'REMOVE_PRINTER_DETAILS';
export const WALK_PRINTER_DETAILS = 'WALK_PRINTER_DETAILS';
export const DETAIL_IS_THE_SAME = 'DETAIL_IS_THE_SAME';

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
  return { type: WALK_PRINTER_DETAILS };
}

export function updatePrinterDetails(ip: string) {
  return (
    dispatch: (action: actionType) => void,
    getState: () => detailsStateType
  ) => {
    // dispatch(removePrinterDetails());
    const { details } = getState();
    // console.log(details)

    function pollDeviceDetails(session, device, pollCb) {
      const newDevice = device;
      console.log('getting system properties...');
      const oids = [
        '1.3.6.1.2.1.1.5.0',
        '1.3.6.1.2.1.1.6.0',
        '1.3.6.1.2.1.43.5.1.1.16.1',
        '1.3.6.1.2.1.43.5.1.1.17.1'
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
          newDevice.location = varbinds[1].value.toString();
          newDevice.productName = varbinds[2].value.toString();
          newDevice.serialNumber = varbinds[3].value.toString();

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

          newDevice.cDrumCartridgeFullCap = varbinds[4].value;
          newDevice.mDrumCartridgeFullCap = varbinds[5].value;
          newDevice.yDrumCartridgeFullCap = varbinds[6].value;
          newDevice.bDrumCartridgeFullCap = varbinds[7].value;

          newDevice.wasteTonerBoxFullCap = varbinds[8].value;

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

          newDevice.cDrumCartridgeRemainCap = varbinds[4].value;
          newDevice.mDrumCartridgeRemainCap = varbinds[5].value;
          newDevice.yDrumCartridgeRemainCap = varbinds[6].value;
          newDevice.bDrumCartridgeRemainCap = varbinds[7].value;

          newDevice.wasteTonerBoxRemainCap = varbinds[8].value;

          pollCoverStatus(session, newDevice, pollCb);
        }
      });
    }

    function getDoorStatus(status) {
      switch (status) {
        case 1:
          return 'Unknown';
        case (3, 5):
          return 'Open';
        case (4, 6):
          return 'Closed';
        default:
          return 'Unknown';
      }
    }

    function pollCoverStatus(session, device, pollCb) {
      const newDevice = device;
      console.log('getting Cover status...');
      const oids = [
        '1.3.6.1.2.1.43.6.1.1.3.1.1',
        '1.3.6.1.2.1.43.6.1.1.3.1.2',
        '1.3.6.1.2.1.43.6.1.1.3.1.3'
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

          // {
          //     other(1),
          //     doorOpen(3),
          //     doorClosed(4),
          //     interlockOpen(5),
          //     interlockClosed(6)
          // }

          newDevice.rightSideCover = getDoorStatus(varbinds[0].value);
          newDevice.rearCover = getDoorStatus(varbinds[1].value);
          newDevice.dadfCover = getDoorStatus(varbinds[2].value);

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

        if (fastDeepEqual(details, device)) {
          dispatch({
            type: DETAIL_IS_THE_SAME
          });
        } else {
          dispatch(addPrinterDetails(ip, device));
        }
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
