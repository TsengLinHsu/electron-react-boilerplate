// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import printers from './printers';
import visibilityFilter from './visibilityFilter';

const rootReducer = combineReducers({
  printers,
  visibilityFilter,
  counter,
  router
});

export default rootReducer;
