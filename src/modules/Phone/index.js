import 'whatwg-fetch';
import SDK from 'ringcentral';
import RingCentralClient from 'ringcentral-client';
import { hashHistory } from 'react-router'

import { ModuleFactory } from 'ringcentral-integration/lib/di';
import RcModule from 'ringcentral-integration/lib/RcModule';

import Alert from 'ringcentral-integration/modules/Alert';
import Brand from 'ringcentral-integration/modules/Brand';

import ConnectivityMonitor from 'ringcentral-integration/modules/ConnectivityMonitor';
import DateTimeFormat from 'ringcentral-integration/modules/DateTimeFormat';
import GlobalStorage from 'ringcentral-integration/modules/GlobalStorage';
import Locale from 'ringcentral-integration/modules/Locale';
import RateLimiter from 'ringcentral-integration/modules/RateLimiter';
import Storage from 'ringcentral-integration/modules/Storage';
import AccountExtension from 'ringcentral-integration/modules/AccountExtension';
import Subscription from 'ringcentral-integration/modules/Subscription';
import ExtensionInfo from 'ringcentral-integration/modules/ExtensionInfo';
import TabManager from 'ringcentral-integration/modules/TabManager';
import RolesAndPermissions from 'ringcentral-integration/modules/RolesAndPermissions';
import Contacts from 'ringcentral-integration/modules/Contacts';
import Auth from 'ringcentral-integration/modules/Auth';
import OAuth from 'ringcentral-widgets/modules/ProxyFrameOAuth';
import GlipCompany from 'ringcentral-integration/modules/GlipCompany';
import GlipPersons from 'ringcentral-integration/modules/GlipPersons';
import GlipGroups from 'ringcentral-integration/modules/GlipGroups';
import GlipPosts from 'ringcentral-integration/modules/GlipPosts';

import RouterInteraction from 'ringcentral-widgets/modules/RouterInteraction';

import Environment from '../Environment';
import GlipContacts from '../GlipContacts';

import Notification from '../../lib/notification';

// user Dependency Injection with decorator to create a phone class
// https://github.com/ringcentral/ringcentral-js-integration-commons/blob/master/docs/dependency-injection.md
@ModuleFactory({
  providers: [
    { provide: 'Alert', useClass: Alert },
    { provide: 'Brand', useClass: Brand },
    { provide: 'Locale', useClass: Locale },
    { provide: 'TabManager', useClass: TabManager },
    { provide: 'GlobalStorage', useClass: GlobalStorage },
    { provide: 'ConnectivityMonitor', useClass: ConnectivityMonitor },
    { provide: 'Auth', useClass: Auth },
    { provide: 'OAuth', useClass: OAuth },
    { provide: 'Storage', useClass: Storage },
    { provide: 'RateLimiter', useClass: RateLimiter },
    { provide: 'Subscription', useClass: Subscription },
    { provide: 'AccountExtension', useClass: AccountExtension },
    { provide: 'RolesAndPermissions', useClass: RolesAndPermissions },
    { provide: 'ExtensionInfo', useClass: ExtensionInfo },
    { provide: 'Contacts', useClass: Contacts },
    { provide: 'GlipContacts', useClass: GlipContacts },
    {
      provide: 'ContactSources',
      useFactory: ({ glipContacts }) =>
        [glipContacts],
      deps: ['GlipContacts']
    },
    { provide: 'DateTimeFormat', useClass: DateTimeFormat },
    { provide: 'RouterInteraction', useClass: RouterInteraction },
    {
      provide: 'RouterInteractionOptions',
      useValue: { history: hashHistory },
      spread: true,
    },
    { provide: 'Auth', useClass: Auth },
    { provide: 'Environment', useClass: Environment },
    { provide: 'GlipCompany', useClass: GlipCompany },
    { provide: 'GlipGroups', useClass: GlipGroups },
    { provide: 'GlipPosts', useClass: GlipPosts },
    { provide: 'GlipPersons', useClass: GlipPersons },
    {
      provide: 'GlipPersonsOptions',
      useValue: { batchFetchDelay: 1000 },
      spread: true,
    },
    {
      provide: 'EnvironmentOptions',
      useFactory: ({ sdkConfig }) => sdkConfig,
      deps: [
        { dep: 'SdkConfig' },
      ],
    },
    {
      provide: 'Client',
      useFactory: ({ sdkConfig }) =>
        new RingCentralClient(new SDK(sdkConfig)),
      deps: [
        { dep: 'SdkConfig', useParam: true, },
      ],
    },
  ]
})
export default class BasePhone extends RcModule {
  constructor(options) {
    super(options);
    const {
      appConfig,
      moduleOptions,
    } = options;
    this._appConfig = appConfig;
    this._notification = new Notification();
    this._mobile = moduleOptions.mobile;
    this._redirectUriAfterLogin = null;
  }

  initialize() {
    this.glipPosts.addNewPostListener((post) => {
      if (this.glipGroups.currentGroupId === post.groupId) {
        return;
      }
      const creator = this.glipPersons.personsMap[post.creatorId];
      this._notification.notify({
        title: creator && creator.firstName,
        text: post.text,
        icon: creator && creator.avatar,
        onClick: () => {
          this.glipGroups.updateCurrentGroupId(post.groupId);
        }
      });
    });
    this.store.subscribe(() => {
      if (!this.auth.ready) {
        return;
      }
      if (
        this.routerInteraction.currentPath !== '/' &&
        !this.auth.loggedIn
      ) {
        this._redirectUriAfterLogin = this.routerInteraction.currentPath;
        this.routerInteraction.push('/');
        return;
      }
      if (!(this.auth.loggedIn && this.glipGroups.ready)) {
        return;
      }
      if (
        this.routerInteraction.currentPath === '/'
      ) {
        if (this._redirectUriAfterLogin) {
          this.routerInteraction.push(this._redirectUriAfterLogin);
          return;
        }
        if (this._mobile) {
          this.routerInteraction.push('/glip');
          return;
        }
        this.routerInteraction.push('/glip/persons/me');
        return;
      }
      if (
        this.routerInteraction.currentPath === '/glip' &&
        !this._mobile
      ) {
        if (this.glipGroups.currentGroupId) {
          this.routerInteraction.push(`/glip/groups/${this.glipGroups.currentGroupId}`);
          return;
        }
        this.routerInteraction.push('/glip/persons/me');
      }
    });
  }

  get name() {
    return this._appConfig.name;
  }

  get version() {
    return this._appConfig.version;
  }

  get _actionTypes() {
    return null;
  }
}

export function createPhone({
  prefix,
  apiConfig,
  brandConfig,
  appVersion,
  redirectUri,
  stylesUri,
  mobile,
  preloadPosts,
}) {
  @ModuleFactory({
    providers: [
      { provide: 'ModuleOptions', useValue: { prefix, mobile }, spread: true },
      {
        provide: 'SdkConfig',
        useValue: {
          ...apiConfig,
          cachePrefix: `sdk-${prefix}`,
          clearCacheOnRefreshError: false,
        },
      },
      {
        provide: 'AppConfig',
        useValue: { name: brandConfig.appName, version: appVersion },
      },
      { provide: 'BrandOptions', useValue: brandConfig, spread: true },
      { provide: 'OAuthOptions', useValue: { redirectUri }, spread: true },
      { provide: 'InteractionOptions', useValue: { stylesUri }, spread: true },
      {
        provide: 'WebphoneOptions',
        spread: true,
        useValue: {
          appKey: apiConfig.appKey,
          appName: brandConfig.appName,
          appVersion,
          webphoneLogLevel: 1,
        },
      },
      {
        provide: 'GLipGroupsOptions',
        useValue: { preloadPosts },
        spread: true
      }
    ]
  })
  class Phone extends BasePhone {}
  return Phone.create();
}
