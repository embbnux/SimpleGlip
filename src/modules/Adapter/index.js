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
    ...options
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
    } else if (this._shouldReset()) {
      this.store.dispatch({
        type: this.actionTypes.resetSuccess,
      });
    } else {
      const match = this._routerInteraction.currentPath.match(/\/glip\/groups\/(\d+)/);
      const groupId = match === null ? null : parseInt(match[1]);
      if (groupId !== this._lastGroupId) {
        this._postMessage({
          type: 'rc-glip-group-changed',
          groupId
        });
        this._lastGroupId = groupId;
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
