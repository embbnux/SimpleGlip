import { combineReducers } from 'redux';
import getModuleStatusReducer from 'ringcentral-integration/lib/getModuleStatusReducer';

export function callControlReducer(types) {
  return (state = {}, { type, direction, callStarted }) => {
    if (type === types.startCall) {
      const newState = {
        ...state
      };

      newState.call_Status = {
        direction,
        callStarted
      };

      return newState;
    }

    return state;
  };
}


export default function getReducer(types) {
  return combineReducers({
    status: getModuleStatusReducer(types),
    startCall: callControlReducer(types)
  });
}

