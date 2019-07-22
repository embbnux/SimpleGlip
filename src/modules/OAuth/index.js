import ProxyFrameOAuth from 'ringcentral-widgets/modules/ProxyFrameOAuth';
import { Module } from 'ringcentral-integration/lib/di';

@Module({
  name: 'OAuth',
  deps: [
    { dep: 'OAuthOptions', optional: true }
  ]
})
export default class OAuth extends ProxyFrameOAuth {
  constructor({
    authorizationCode,
    ...options
  }) {
    super(options);
    this._authorizationCode = authorizationCode;
  }

  async _onStateChange() {
    if (
      this.pending &&
      (
        this._auth.ready &&
        this._locale.ready &&
        this._alert.ready &&
        (!this._tabManager || this._tabManager.ready)
      )
    ) {
      this.store.dispatch({
        type: this.actionTypes.init,
      });
      if (!this._auth.loggedIn && this._authorizationCode) {
        await this._slientLoginWithCode()
      }
      this.store.dispatch({
        type: this.actionTypes.initSuccess,
      });
    }
  }

  async _slientLoginWithCode() {
    try {
      await this._loginWithCallbackQuery({ code: this._authorizationCode });
    } catch (e) {
      console.error(e);
    }
  }
}
