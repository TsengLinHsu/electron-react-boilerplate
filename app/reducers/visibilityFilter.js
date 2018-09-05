// @flow
import { SET_VISIBILITY_FILTER, VisibilityFilters } from '../actions/printer';
import type { Action } from './types';

const visibilityFilter = (
  state = VisibilityFilters.SHOW_ALL,
  action: Action
) => {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
};

export default visibilityFilter;
