import RcModule from 'ringcentral-integration/lib/RcModule';
import { Module } from 'ringcentral-integration/lib/di';


import getReducer from './getReducer';
import actionTypes from './actionTypes';


@Module({
  deps: [
    { dep: 'Auth' },
    { dep: 'GlipGroups' },
    { dep: 'RouterInteraction' },
    { dep: 'AdapterOptions', optional: true, spread: true },
  ],
})
export default class Adapter extends RcModule {
  constructor({
    auth,
    glipGroups,
    routerInteraction,
    ...options,
  }) {
    super({
      actionTypes,
      ...options,
    });

    this._auth = auth;
    this._glipGroups = glipGroups;
    this._routerInteraction = routerInteraction;

    this._reducer = getReducer(this.actionTypes);

    this._lastGroupId = null;
  }
  // your codes here

  // Codes on state change
  async _onStateChange() {
    if (this._shouldInit()) {
      this.store.dispatch({
        type: this.actionTypes.initSuccess
      });
      this._lastGroupId = this._glipGroups.currentGroupId;
    } else if (this._shouldReset()) {
      this.store.dispatch({
        type: this.actionTypes.resetSuccess,
      });
    } else if (
      this._glipGroups.ready &&
      this._lastGroupId !== this._glipGroups.currentGroupId
    ) {
      this._lastGroupId = this._glipGroups.currentGroupId;
      if (this._routerInteraction.currentPath !== '/glip') {
        this._postMessage({
          type: 'rc-glip-group-changed',
          groupId: this._glipGroups.currentGroupId
        });
      }
    }
  }

  _shouldInit() {
    return (
      this._auth.ready &&
      this._glipGroups.ready &&
      this.pending
    );
  }

  _shouldReset() {
    return (
      (
        !this._auth.ready ||
        !this._glipGroups.ready
      ) &&
      this.ready
    );
  }

  get status() {
    return this.state.status;
  }

  _postMessage(data) {
    if (window && window.parent) {
      window.parent.postMessage(data, '*');
    }
  }
}
