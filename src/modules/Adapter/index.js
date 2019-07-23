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
    this._currentPath = null;
  }

  initialize() {
    window.addEventListener('message', msg => this._onMessage(msg));
    this.store.subscribe(() => this._onStateChange());
  }

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
      this._onGroupChanged();
    }
    this._checkLoginStatus();
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

  _onMessage(event) {
    const data = event.data;
    if (data) {
      switch (data.type) {
        case 'rc-adapter-logout':
          if (this._auth.loggedIn) {
            this._auth.logout();
          }
          break;
        default:
          break;
      }
    }
  }

  _onGroupChanged() {
    if (this._currentPath === this._routerInteraction.currentPath) {
      return;
    }
    this._currentPath = this._routerInteraction.currentPath;
    const match = this._currentPath.match(/\/glip\/groups\/(\d+)/);
    const groupId = match === null ? null : parseInt(match[1]);
    if (groupId !== this._lastGroupId) {
      this._postMessage({
        type: 'rc-glip-group-changed',
        groupId
      });
      this._lastGroupId = groupId;
    }
  }

  _checkLoginStatus() {
    if (!this._auth.ready) {
      return;
    }
    if (this._loggedIn === this._auth.loggedIn) {
      return;
    }
    this._loggedIn = this._auth.loggedIn;
    this._postMessage({
      type: 'rc-login-status-notify',
      loggedIn: this._loggedIn,
    });
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
