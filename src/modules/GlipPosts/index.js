import { Module } from 'ringcentral-integration/lib/di';
import isBlank from 'ringcentral-integration/lib/isBlank';

import status from 'ringcentral-integration/modules/GlipPosts/status';
import GlipPosts from 'ringcentral-integration/modules/GlipPosts';

import Enum from 'ringcentral-integration/lib/Enum';

const storageActionTypes = new Enum([
  'updateFooter',
  'updateReadTime',
  'resetSuccess',
], 'glipPosts');

function getGlipPostsFooterReducer(types) {
  return (state = null, { type, footer }) => {
    switch (type) {
      case types.updateFooter:
        return footer;
      default:
        return state;
    }
  };
}

function getGlipPostsReadTimeReducer(types) {
  return (state = {}, { type, groupId, time = Date.now() }) => {
    let newState;
    switch (type) {
      case types.updateReadTime:
        newState = {
          ...state,
        };
        newState[groupId] = time;
        return newState;
      case types.resetSuccess:
        return {};
      default:
        return state;
    }
  };
}

const glipPostsRegExp = /glip\/posts$/;

@Module({ deps: ['Storage'] })
export default class NewGlipPosts extends GlipPosts {
  constructor({
    storage,
    ...options
  }) {
    super({
      ...options,
    });
    this._storage = storage;
    this._footerStorageKey = 'glipPostFooter';
    this._readTimeStorageKey = 'glipPostReadTime';
    this._storage.registerReducer({
      key: this._footerStorageKey,
      reducer: getGlipPostsFooterReducer(storageActionTypes),
    });
    this._storage.registerReducer({
      key: this._readTimeStorageKey,
      reducer: getGlipPostsReadTimeReducer(storageActionTypes),
    });
    this._newPostListeners = [];
  }

  addNewPostListener(listen) {
    if (typeof listen === 'function') {
      this._newPostListeners.push(listen);
    }
  }

  _processSubscription() {
    super._processSubscription();
    const { message } = this._subscription;
    if (
      message &&
      glipPostsRegExp.test(message.event) &&
      message.body
    ) {
      const {
        eventType,
        ...post,
      } = message.body;
      if (eventType === 'PostAdded' && post.creatorId !== this._auth.ownerId) {
        this._newPostListeners.forEach((listen) => {
          listen(post);
        });
      }
    }
  }

  async create({ groupId }) {
    let text = this.postInputs[groupId] && this.postInputs[groupId].text;
    if (isBlank(text) || !groupId) {
      return;
    }
    if (this.footer) {
      text = `${text}\n${this.footer}`;
    }
    const fakeId = `${Date.now()}`;
    const fakeRecord = {
      id: fakeId,
      groupId,
      creatorId: this._auth.ownerId,
      sendStatus: status.creating,
      creationTime: `${new Date(Date.now())}`,
      text,
      type: 'TextMessage',
    };
    try {
      this.store.dispatch({
        type: this.actionTypes.create,
        groupId,
        record: fakeRecord,
      });
      this.updatePostInput({ text: '', groupId });
      const record = await this._client.glip().groups(groupId).posts().post({
        text,
      });
      this.store.dispatch({
        type: this.actionTypes.createSuccess,
        groupId,
        record,
        oldRecordId: fakeId,
      });
    } catch (e) {
      fakeRecord.sendStatus = status.createError;
      this.store.dispatch({
        type: this.actionTypes.createError,
        record: fakeRecord,
        groupId,
        oldRecordId: fakeId,
      });
      this.updatePostInput({ text, groupId });
    }
  }

  updateFooter(footer) {
    this.store.dispatch({
      type: storageActionTypes.updateFooter,
      footer,
    });
  }

  updateReadTime(groupId, time) {
    this.store.dispatch({
      type: storageActionTypes.updateReadTime,
      groupId,
      time
    });
  }

  get footer() {
    return this._storage.getItem(this._footerStorageKey);
  }

  get readTimeMap() {
    return this._storage.getItem(this._readTimeStorageKey);
  }
}
