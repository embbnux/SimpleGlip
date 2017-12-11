import { combineReducers } from 'redux';
import getModuleStatusReducer from 'ringcentral-integration/lib/getModuleStatusReducer';
import status from './status';

export function getGlipPersonsStatusReducer(types) {
  return (state = status.idle, { type }) => {
    switch (type) {
      case types.fetch:
        return status.fetching;
      case types.fetchError:
      case types.fetchSuccess:
      case types.batchFetchSuccess:
        return status.idle;
      default:
        return state;
    }
  };
}

export function getGlipPersonStoreReducer(types) {
  return (state = {}, { type, personId, person, persons }) => {
    let newState;
    switch (type) {
      case types.fetchSuccess:
        newState = {
          ...state,
        };
        newState[personId] = person;
        return newState;
      case types.batchFetchSuccess:
        newState = {
          ...state,
        };
        persons.forEach((p) => {
          if (p.id) {
            newState[p.id] = p;
          }
        });
        return newState;
      default:
        return state;
    }
  };
}

export default function getGlipPostsReducer(types, reducers = {}) {
  return combineReducers({
    ...reducers,
    status: getModuleStatusReducer(types),
    glipPostsStatus: getGlipPersonsStatusReducer(types),
    glipPersonStore: getGlipPersonStoreReducer(types),
  });
}
