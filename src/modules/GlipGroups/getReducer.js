import { combineReducers } from 'redux';
import getModuleStatusReducer from 'ringcentral-integration/lib/getModuleStatusReducer';

export function getDataReducer(types) {
  return (state = [], { type, data }) => {
    switch (type) {
      case types.fetchSuccess:
        return data && data.records;
      case types.resetSuccess:
        return [];
      default:
        return state;
    }
  };
}

export function getPageNumberReducer(types) {
  return (state = 1, { type, pageNumber }) => {
    switch (type) {
      case types.updateFilter:
        if (pageNumber) {
          return pageNumber;
        }
        return state;
      default:
        return state;
    }
  };
}

export function getSearchFilterReducer(types) {
  return (state = '', { type, searchFilter }) => {
    switch (type) {
      case types.updateFilter:
        if (searchFilter !== null && searchFilter !== undefined) {
          return searchFilter;
        }
        return state;
      default:
        return state;
    }
  };
}

export function getCurrentGroupIdReducer(types) {
  return (state = null, { type, groupId }) => {
    switch (type) {
      case types.updateCurrentGroupId:
        return groupId;
      default:
        return state;
    }
  };
}

export function getTimestampReducer(types) {
  return (state = null, { type, timestamp }) => {
    if (type === types.fetchSuccess) return timestamp;
    return state;
  };
}

export default function getReducer(types, reducers = {}) {
  return combineReducers({
    ...reducers,
    status: getModuleStatusReducer(types),
    searchFilter: getSearchFilterReducer(types),
    pageNumber: getPageNumberReducer(types),
  });
}
