// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import printers from './printers';
import details from './details';

const rootReducer = combineReducers({
  printers,
  details,
  counter,
  router
});

export default rootReducer;
