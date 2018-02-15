import { Module } from 'ringcentral-integration/lib/di';
import isBlank from 'ringcentral-integration/lib/isBlank';

import status from 'ringcentral-integration/modules/GlipPosts/status';
import GlipPosts from 'ringcentral-integration/modules/GlipPosts';

import actionTypes from './actionTypes';
import getReducer, {
  getGlipPostsFooterReducer,
  getGlipPostsReadTimeReducer,
} from './getReducer';

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
    this._reducer = getReducer(this.actionTypes);

    this._storage.registerReducer({
      key: this._footerStorageKey,
      reducer: getGlipPostsFooterReducer(this.actionTypes),
    });
    this._storage.registerReducer({
      key: this._readTimeStorageKey,
      reducer: getGlipPostsReadTimeReducer(this.actionTypes),
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

  async loadPosts(groupId, recordCount = 20, pageToken) {
    if (!groupId) {
      return;
    }
    if (!this._fetchPromises[groupId]) {
      this._fetchPromises[groupId] = (async () => {
        try {
          this.store.dispatch({
            type: this.actionTypes.fetch,
          });
          const params = { recordCount };
          if (pageToken) {
            params.pageToken = pageToken;
          }
          const response = await this._client.glip().groups(groupId).posts().list(params);
          this.store.dispatch({
            type: this.actionTypes.fetchSuccess,
            groupId,
            records: response.records,
            lastPageToken: pageToken,
            navigation: response.navigation,
          });
        } catch (e) {
          this.store.dispatch({
            type: this.actionTypes.fetchError,
          });
        }
        this._fetchPromises[groupId] = null;
      })();
    }
    const promise = this._fetchPromises[groupId];
    await promise;
  }

  async loadNextPage(groupId, recordCount) {
    const pageInfo = this.pageInfos[groupId];
    const pageToken = pageInfo && pageInfo.prevPageToken;
    if (!pageToken) {
      return;
    }
    await this.loadPosts(groupId, recordCount, pageToken);
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
      type: this.actionTypes.updateFooter,
      footer,
    });
  }

  updateReadTime(groupId, time) {
    this.store.dispatch({
      type: this.actionTypes.updateReadTime,
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

  get actionTypes() {
    return actionTypes;
  }

  get pageInfos() {
    return this.state.pageInfos;
  }
}
