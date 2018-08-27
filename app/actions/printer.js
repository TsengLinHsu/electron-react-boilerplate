// @flow
import snmp from 'net-snmp';
import fastDeepEqual from 'fast-deep-equal';
import Bonjour from 'bonjour';
import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import ping from 'ping';
import type { GetState, Dispatch, Action, Printer } from '../reducers/types';

export const ADD_NETWORK_PRINTER = 'ADD_NETWORK_PRINTER';
export const REMOVE_ALL_PRINTER = 'REMOVE_ALL_PRINTER';
export const TOGGLE_PRINTER_DETAILS = 'TOGGLE_PRINTER_DETAILS';
export const PRINTER_IS_EXIST = 'PRINTER_IS_EXIST';
export const UPDATE_PRINTER_DETAILS = 'UPDATE_PRINTER_DETAILS';
export const REMOVE_PRINTER_DETAILS = 'REMOVE_PRINTER_DETAILS';
export const WALK_PRINTER_DETAILS = 'WALK_PRINTER_DETAILS';
export const DETAIL_IS_THE_SAME = 'DETAIL_IS_THE_SAME';
export const UPDATE_PRINTER_ALIVE = 'UPDATE_PRINTER_ALIVE';

// export function checkPrinterAlive() {
//   return (dispatch: Dispatch, getState: GetState) => {
//     const { printers } = getState();
//     printers.forEach(printer => {
//       ping.sys.probe(printer.address, alive => {
//         const aliveData = {
//           address: printer.address,
//           alive
//         };
//         dispatch(updatePrinterAlive(aliveData));
//       });
//     });
//   };
// }

export function checkPrinterAliveWithAddress(address) {
  return (dispatch: Dispatch) => {
    ping.sys.probe(address, alive => {
      const aliveData = {
        address,
        alive
      };
      dispatch(updatePrinterAlive(aliveData));
    });
  };
}

export function updatePrinterAlive(aliveData) {
  return {
    aliveData,
    type: UPDATE_PRINTER_ALIVE
  };
}

export function startUpdatePrinters() {
  return (dispatch: Dispatch) => {
    // dispatch(removeAllPrinter());
    // console.log(printers);

    const adapter = new LocalStorage('db');
    const db = low(adapter);
    // db.unset('printers').write();
    db.defaults({ printers: [] }).write();
    const localPrinters = db.getState();

    // console.log(localPrinters);

    localPrinters.printers.forEach(localPrinter => {
      dispatch(addPrinterAndUpdateAlive(localPrinter));
    });

    const bonjour = Bonjour();
    const browser = bonjour.find({ type: 'printer' }, service => {
      const printer: Printer = {
        name: service.name,
        address: service.referer.address
      };
      dispatch(addPrinterAndUpdateAlive(printer));
    });
    /* Stop searching after 5 seconds */
    setTimeout(() => {
      browser.stop();
    }, 5 * 1000);
  };
}

export function addPrinterAndUpdateAlive(printer: Printer) {
  return (dispatch: Dispatch, getState: GetState) => {
    const { printers } = getState();

    // console.log(service, printers);
    let isExist = false;
    for (let i = 0; i < printers.length; i += 1) {
      if (
        printers[i].name === printer.name ||
        printers[i].address === printer.address
      ) {
        isExist = true;
        break;
      }
    }

    if (isExist) {
      dispatch({
        type: PRINTER_IS_EXIST
      });
      dispatch(checkPrinterAliveWithAddress(printer.address));
    } else {
      dispatch(addNetworkPrinter(printer));
      dispatch(checkPrinterAliveWithAddress(printer.address));
    }
  };
}

export function addNetworkPrinter(printer: Printer): Action {
  return {
    type: ADD_NETWORK_PRINTER,
    printer
  };
}

export function removeAllPrinter(): Action {
  const adapter = new LocalStorage('db');
  const db = low(adapter);
  db.unset('printers').write();
  return {
    type: REMOVE_ALL_PRINTER
  };
}

export function removePrinterDetails(address: string) {
  return {
    address,
    type: REMOVE_PRINTER_DETAILS
  };
}

export function walkPrinterDetails(address: string) {
  const version = snmp.Version2c;
  const session = snmp.createSession(address, 'public', { version });

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

export function updatePrinterDetails(address: string) {
  return (dispatch: Dispatch, getState: GetState) => {
    // dispatch(removePrinterDetails());
    const { details } = getState();
    // console.log(details)

    function pollDeviceDetails(session, device, pollCb) {
      const newDevice = device;
      // console.log('getting system properties...');
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

          newDevice.address = address;
          newDevice.name = varbinds[0].value.toString();
          newDevice.location = varbinds[1].value.toString();
          newDevice.productName = varbinds[2].value.toString();
          newDevice.serialNumber = varbinds[3].value.toString();

          pollDeviceStatus(session, newDevice, pollCb);
        }
      });
    }

    function pollDeviceStatus(session, device, pollCb) {
      const newDevice = device;
      // console.log('getting alert status...');

      // 1.3.6.1.2.1.43.18.1.1.2
      // prtAlertSeverityLevel OBJECT-TYPE
      // -- This value is a type 1 enumeration
      // SYNTAX INTEGER {
      // other(1),
      // critical(3),
      // warning(4)
      // }

      // 1.3.6.1.2.1.43.18.1.1.4
      // prtAlertGroup OBJECT-TYPE
      // -- This value is a type 1 enumeration
      // SYNTAX INTEGER {
      // other(1),
      // hostResourcesMIBStorageTable(3),
      // hostResourcesMIBDeviceTable(4),
      // generalPrinter(5),
      // cover(6),
      // localization(7),
      // input(8),
      // output(9),
      // marker(10),
      // markerSupplies(11),
      // markerColorant(12),
      // mediaPath(13),
      // channel(14),
      // interpreter(15),
      // consoleDisplayBuffer(16),
      // consoleLights(17)
      // }

      // 1.3.6.1.2.1.43.18.1.1.7
      // prtAlertCode OBJECT-TYPE
      // -- This value is a type 2 enumeration
      // SYNTAX INTEGER {
      // other(1),
      // unknown(2),
      // -- codes common to serveral groups
      // coverOpen(3),
      // coverClosed(4),
      // interlockOpen(5),
      // interlockClosed(6),
      // configurationChange(7),
      // jam(8),
      // -- general Printer group
      // doorOpen(501),
      // doorClosed(502),
      // powerUp(503),
      // powerDown(504),
      // -- Input Group
      // inputMediaTrayMissing(801),
      // inputMediaSizeChange(802),
      // inputMediaWeightChange(803),
      // inputMediaTypeChange(804),
      // inputMediaColorChange(805),
      // inputMediaFormPartsChange(806),
      // inputMediaSupplyLow(807),
      // inputMediaSupplyEmpty(808),
      // -- Output Group
      // outputMediaTrayMissing(901),
      // outputMediaTrayAlmostFull(902),
      // outputMediaTrayFull(903),
      // -- Marker group
      // markerFuserUnderTemperature(1001),
      // markerFuserOverTemperature(1002),
      // -- Marker Supplies group
      // markerTonerEmpty(1101),
      // markerInkEmpty(1102),
      // markerPrintRibbonEmpty(1103),
      // markerTonerAlmostEmpty(1104),
      // markerInkAlmostEmpty(1105),
      // markerPrintRibbonAlmostEmpty(1106),
      // markerWasteTonerReceptacleAlmostFull(1107),
      // markerWasteInkReceptacleAlmostFull(1108),
      // markerWasteTonerReceptacleFull(1109),
      // markerWasteInkReceptacleFull(1110),
      // markerOpcLifeAlmostOver(1111),
      // markerOpcLifeOver(1112),
      // markerDeveloperAlmostEmpty(1113),
      // markerDeveloperEmpty(1114),
      // -- Media Path Device Group
      // mediaPathMediaTrayMissing(1301),
      // mediaPathMediaTrayAlmostFull(1302),
      // mediaPathMediaTrayFull(1303),
      // -- interpreter Group
      // interpreterMemoryIncrease(1501),
      // interpreterMemoryDecrease(1502),
      // interpreterCartridgeAdded(1503),
      // interpreterCartridgeDeleted(1504),
      // interpreterResourceAdded(1505),
      // interpreterResourceDeleted(1506),
      // interpreterResourceUnavailable(1507)
      // }

      // prtAlertDescription OBJECT-TYPE
      // SYNTAX OCTET STRING (SIZE(0..255))
      // MAX-ACCESS read-only
      // STATUS current
      // DESCRIPTION
      // "A description of this alert entry in the localization
      // specified by prtGeneralCurrentLocalization. The description is
      // provided by the printer to further elaborate on the enumerated
      // alert or provide information in the case where the code is
      // classified ask `other or `unknown. The printer is required
      // to return a description string but the string may be a null
      // string."

      // prtAlertTime OBJECT-TYPE
      // SYNTAX TimeTicks
      // MAX-ACCESS read-only
      // STATUS current
      // DESCRIPTION
      // "The value of sysUpTime at the time that this alert was
      // generated."
      function responseCb(error, table) {
        if (error) {
          console.error(error.toString());
        } else {
          const alertArray = [];

          const alerts = Object.values(table);

          alerts.forEach(value => {
            const alertObject = {
              prtAlertIndex: value[1],
              // prtAlertSeverityLevel: value[2],
              prtAlertGroup: value[4],
              prtAlertCode: value[7],
              prtAlertDescription: value[8].toString(),
              prtAlertTime: value[9]
            };

            switch (value[2]) {
              case 1:
                alertObject.prtAlertSeverityLevel = 'Other';
                break;
              case 3:
                alertObject.prtAlertSeverityLevel = 'Critical';
                break;
              case 4:
                alertObject.prtAlertSeverityLevel = 'Warning';
                break;
              default:
                alertObject.prtAlertSeverityLevel = 'Unknown';
                break;
            }
            alertArray.push(alertObject);
            // console.log(index, alertObject);
          });
          // console.log(alertArray);
          newDevice.prtAlertEntry = alertArray;

          pollDeviceFullCap(session, newDevice, pollCb);
        }
      }

      // session.tableColumns('1.3.6.1.2.1.43.18.1.1.8', [3], (error, table) => {
      const oids = '1.3.6.1.2.1.43.18.1';
      const maxRepetitions = 20;
      session.table(oids, maxRepetitions, responseCb);
    }

    function pollDeviceFullCap(session, device, pollCb) {
      const newDevice = device;
      // console.log('getting full cap...');
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
      // console.log('getting remain cap...');
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
        case 3:
        case 5:
          return 'Open';
        case 4:
        case 6:
          return 'Closed';
        default:
          return 'Unknown';
      }
    }

    function pollCoverStatus(session, device, pollCb) {
      const newDevice = device;
      // console.log('getting Cover status...');
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
    const session = snmp.createSession(address, 'public', { version });

    pollDevice(session, {}, (error, device) => {
      if (error) {
        console.error(error.toString());
      } else {
        session.close();

        if (fastDeepEqual(details, device)) {
          dispatch({
            type: DETAIL_IS_THE_SAME
          });
        } else {
          dispatch(addPrinterDetails(device));
        }
      }
    });
  };
}

export function addPrinterDetails(details) {
  return {
    details,
    type: UPDATE_PRINTER_DETAILS
  };
}
