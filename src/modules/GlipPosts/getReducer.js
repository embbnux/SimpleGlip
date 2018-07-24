import { combineReducers } from 'redux';

import getModuleStatusReducer from 'ringcentral-integration/lib/getModuleStatusReducer';

import {
  getGlipPostsStatusReducer,
  getGlipPostsCreateStatusReducer,
  getGlipPostsPageInfoReducer,
  getGlipPostsFetchTimeReducer,
} from 'ringcentral-integration/modules/GlipPosts/getReducer';

export function getGlipPostsInputsReducer(types) {
  return (state = {}, { type, groupId, textValue, mentions }) => {
    let newState;
    switch (type) {
      case types.updatePostInput:
        newState = {
          ...state,
        };
        newState[groupId] = {
          text: textValue,
          mentions,
        };
        return newState;
      default:
        return state;
    }
  };
}

export function getGlipPostsStoreReducer(types) {
  return (state = {}, {
    type, groupId, records, record, oldRecordId, isSendByMe, lastPageToken
  }) => {
    let newState;
    let newPosts;
    let oldPostIndex;
    switch (type) {
      case types.fetchSuccess:
        newState = {
          ...state,
        };
        if (!lastPageToken) {
          newState[groupId] = records;
        } else {
          const preRecords = newState[groupId];
          newState[groupId] = [].concat(preRecords).concat(records);
        }
        return newState;
      case types.create:
      case types.createSuccess:
      case types.createError:
        newState = {
          ...state,
        };
        newPosts = (newState[groupId] && [...newState[groupId]]) || [];
        if (oldRecordId) {
          oldPostIndex = newPosts.findIndex(p => p.id === oldRecordId);
        } else {
          oldPostIndex = newPosts.findIndex(p => p.id === record.id);
        }
        if (oldPostIndex > -1) {
          newPosts.splice(oldPostIndex, 1, record);
          newState[groupId] = newPosts;
        } else if (isSendByMe) {
          oldPostIndex = newPosts.findIndex(p =>
            p.creatorId === record.creatorId &&
            p.text === record.text &&
            p.sendStatus === status.creating
          );
          if (oldPostIndex === -1) {
            newState[groupId] = [record].concat(newPosts.filter(p => p.id !== record.id));
          }
        } else {
          newState[groupId] = [record].concat(newPosts.filter(p => p.id !== record.id));
        }
        return newState;
      case types.resetSuccess:
        return {};
      default:
        return state;
    }
  };
}

export default function getGlipPostsReducer(types, reducers = {}) {
  return combineReducers({
    ...reducers,
    status: getModuleStatusReducer(types),
    fetchStatus: getGlipPostsStatusReducer(types),
    glipPostsStore: getGlipPostsStoreReducer(types),
    createStatus: getGlipPostsCreateStatusReducer(types),
    postInputs: getGlipPostsInputsReducer(types),
    pageInfos: getGlipPostsPageInfoReducer(types),
    fetchTimes: getGlipPostsFetchTimeReducer(types),
  });
}
