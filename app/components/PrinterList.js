// @flow
import React from 'react';
import PrinterItem from './PrinterItem';
import type { Printer } from '../reducers/types';

type Props = {
  children: React.Node,
  printers: Array<Printer>
};

const PrinterItemList = ({ printers, children, ...other }: Props) => (
  <React.Fragment>
    {printers.map(printer => (
      <PrinterItem key={printer.name} printer={printer} {...other} />
    ))}
    {children}
  </React.Fragment>
);

export default PrinterItemList;
