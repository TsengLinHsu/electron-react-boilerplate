// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import printers from './printers';

const rootReducer = combineReducers({
  printers,
  counter,
  router
});

export default rootReducer;
