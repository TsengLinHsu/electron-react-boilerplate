import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

type State = {
  +counter: number,
  +printers: Array<Printer>,
  +activeDetail?: string
  // ...
};

export type Printer = {
  +name: string,
  +address: string,
  +alive?: boolean,
  +details?: {
    +sysName?: string,
    +sysLocation?: string,
    +prtAlerts?: PrinterAlerts
  }
};

export type Action = {
  type: string,
  printerShortInfo?: ShortInfo,
  printerDetailInfo?: DetailInfo
};

export type ShortInfo = {
  name: string,
  address: string,
  alive?: boolean
};

export type DetailInfo = {
  +sysName: string,
  +sysLocation: string,
  +prtAlerts: PrinterAlerts
};

export type PrinterAlerts = Array<{
  +prtAlertIndex: number,
  +prtAlertSeverityLevel: string,
  +prtAlertGroup: number,
  +prtAlertCode: number,
  +prtAlertDescription: string,
  +prtAlertTime: number
}>;

export type GetState = () => State;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
