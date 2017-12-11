import { Module } from 'ringcentral-integration/lib/di';
import RcModule from 'ringcentral-integration/lib/RcModule';
import sleep from 'ringcentral-integration/lib/sleep';
import moduleStatuses from 'ringcentral-integration/enums/moduleStatuses';
import { batchGetApi } from 'ringcentral-integration/lib/batchApiHelper';

import actionTypes from './actionTypes';
import getReducer from './getReducer';

const MaximumBatchGetPersons = 30;

@Module({
  deps: [
    'Client',
    'Auth',
    { dep: 'GlipPersonsOptions', optional: true }
  ]
})
export default class GlipPersons extends RcModule {
  constructor({
    client,
    auth,
    ...options
  }) {
    super({
      ...options,
      actionTypes,
    });
    this._reducer = getReducer(this.actionTypes);

    this._client = client;
    this._auth = auth;

    this._fetchingIds = {};
  }

  initialize() {
    this.store.subscribe(() => this._onStateChange());
  }

  async _onStateChange() {
    if (this._shouldInit()) {
      this.store.dispatch({
        type: this.actionTypes.init,
      });
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
      this.pending
    );
  }

  _shouldReset() {
    return (
      (
        !this._auth.loggedIn
      ) &&
      this.ready
    );
  }

  async loadMe() {
    try {
      this.store.dispatch({
        type: this.actionTypes.fetch,
      });
      const person = await this._client.glip().persons('~').get();
      this.store.dispatch({
        type: this.actionTypes.fetchSuccess,
        personId: 'me',
        person,
      });
    } catch (e) {
      this.store.dispatch({
        type: this.actionTypes.fetchError,
      });
    }
  }

  async loadPersons(personIds) {
    if (!personIds) {
      return;
    }
    const newPersonIds = [];
    personIds.forEach((id) => {
      if (!this.personsMap[id] && !this._fetchingIds[id]) {
        newPersonIds.push(id);
        this._fetchingIds[id] = 1;
      }
    });
    if (newPersonIds.length === 0) {
      return;
    }
    const ids = newPersonIds.slice(0, MaximumBatchGetPersons);
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
      await sleep(500);
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
    const responses = multipartResponse.map(x => x.json());
    return responses;
  }

  get _actionTypes() {
    return actionTypes;
  }

  get personsMap() {
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
