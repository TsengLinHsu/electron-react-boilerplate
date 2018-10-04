import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type State = {
  +counter: number,
  +printers: Array<Printer>,
  +activeDetail?: string
  // ...
};

export type Printer = {
  +name: string,
  +address: string,
  +favorite: boolean,
  +alive?: boolean,
  +details?: {
    +sysName?: string,
    +sysLocation?: string,
    +prtAlerts?: PrinterAlerts
  }
};

export type Action = {
  type: string
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
