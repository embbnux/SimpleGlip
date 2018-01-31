import { Module } from 'ringcentral-integration/lib/di';
import RcModule from 'ringcentral-integration/lib/RcModule';
import sleep from 'ringcentral-integration/lib/sleep';
import moduleStatuses from 'ringcentral-integration/enums/moduleStatuses';
import { batchGetApi } from 'ringcentral-integration/lib/batchApiHelper';

import actionTypes from './actionTypes';
import getReducer, { getGlipPersonStoreReducer } from './getReducer';

const MaximumBatchGetPersons = 30;

@Module({
  deps: [
    'Client',
    'Auth',
    { dep: 'Storage', optional: true },
    { dep: 'TabManager', optional: true },
    { dep: 'GlipPersonsOptions', optional: true }
  ]
})
export default class GlipPersons extends RcModule {
  constructor({
    client,
    auth,
    storage,
    tabManager,
    ...options
  }) {
    super({
      ...options,
      actionTypes,
    });

    this._client = client;
    this._auth = auth;
    this._tabManager = tabManager;
    this._storage = storage;

    this._fetchingIds = {};

    this._dataStorageKey = 'glipPersonsData';
    if (this._storage) {
      this._reducer = getReducer(this.actionTypes);
      this._storage.registerReducer({
        key: this._dataStorageKey,
        reducer: getGlipPersonStoreReducer(this.actionTypes),
      });
    } else {
      this._reducer = getReducer(this.actionTypes, {
        glipPersonStore: getGlipPersonStoreReducer(this.actionTypes),
      });
    }
  }

  initialize() {
    this.store.subscribe(() => this._onStateChange());
  }

  async _onStateChange() {
    if (this._shouldInit()) {
      this.store.dispatch({
        type: this.actionTypes.init,
      });
      if (this._auth.isFreshLogin) {
        this.store.dispatch({
          type: this.actionTypes.cleanUp,
        });
      }
      await this.loadMe();
      this.store.dispatch({
        type: this.actionTypes.initSuccess,
      });
    } else if (this._shouldReset()) {
      this.store.dispatch({
        type: this.actionTypes.resetSuccess,
      });
    }
  }

  _shouldInit() {
    return (
      this._auth.loggedIn &&
      (!this._storage || this._storage.ready) &&
      (!this._tabManager || this._tabManager.ready) &&
      this.pending
    );
  }

  _shouldReset() {
    return (
      (
        (this._storage && !this._storage.ready) ||
        (this._tabManager && !this._tabManager.ready) ||
        !this._auth.loggedIn
      ) &&
      this.ready
    );
  }

  async loadMe() {
    await this.loadPerson('me');
  }

  async loadPerson(id) {
    try {
      this.store.dispatch({
        type: this.actionTypes.fetch,
      });
      const person = await this._client.glip().persons(id === 'me' ? '~' : id).get();
      this.store.dispatch({
        type: this.actionTypes.fetchSuccess,
        personId: id,
        person,
      });
    } catch (e) {
      this.store.dispatch({
        type: this.actionTypes.fetchError,
      });
    }
  }

  async loadPersons(personIds) {
    if (!this._auth.loggedIn) {
      return;
    }
    if (!personIds) {
      return;
    }
    const newPersonIds = [];
    personIds.forEach((id) => {
      if (!this.personsMap[id] && !this._fetchingIds[id]) {
        newPersonIds.push(id);
      }
    });
    if (newPersonIds.length === 0) {
      return;
    }
    const ids = newPersonIds.slice(0, MaximumBatchGetPersons);
    ids.forEach((id) => {
      this._fetchingIds[id] = 1;
    });
    try {
      this.store.dispatch({
        type: this.actionTypes.fetch,
      });
      const persons = await this._batchGetPersons(ids);
      this.store.dispatch({
        type: this.actionTypes.batchFetchSuccess,
        persons,
      });
      ids.forEach((id) => {
        delete this._fetchingIds[id];
      });
    } catch (e) {
      this.store.dispatch({
        type: this.actionTypes.fetchError,
      });
      ids.forEach((id) => {
        delete this._fetchingIds[id];
      });
    }
    const lastIds = newPersonIds.slice(MaximumBatchGetPersons);
    if (lastIds.length > 0) {
      await sleep(100);
      await this.loadPersons(lastIds);
    }
  }

  async _batchGetPersons(personIds) {
    if (!personIds || personIds.length === 0) {
      return [];
    }
    if (personIds.length === 1) {
      const response = await this._client.glip().persons(personIds[0]).get();
      return [response];
    }
    const ids = personIds.join(',');
    const multipartResponse = await batchGetApi({
      platform: this._client.service.platform(),
      url: `/glip/persons/${ids}`,
    });
    const responses = multipartResponse.filter(r => r.ok()).map(x => x.json());
    return responses;
  }

  get _actionTypes() {
    return actionTypes;
  }

  get personsMap() {
    if (this._storage) {
      return this._storage.getItem(this._dataStorageKey) || {};
    }
    return this.state.glipPersonStore;
  }

  get status() {
    return this.state.status;
  }

  get ready() {
    return this.status === moduleStatuses.ready;
  }

  get me() {
    return this.personsMap.me;
  }
}
