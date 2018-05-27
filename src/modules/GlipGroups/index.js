import GlipGroups from 'ringcentral-integration/modules/GlipGroups';
import { Module } from 'ringcentral-integration/lib/di';

import getReducer, {
  getCurrentGroupIdReducer,
} from 'ringcentral-integration/modules/GlipGroups/getReducer';

@Module({
  deps: []
})
export default class NewGlipGroups extends GlipGroups {
  constructor(options) {
    super(options);

    if (this._storage) {
      this._reducer = getReducer(this.actionTypes, {
        currentGroupId: getCurrentGroupIdReducer(this.actionTypes)
      });
    }

    this._mobile = options.mobile;
  }

  _onDataReady() {
    if (this._glipPersons) {
      this._glipPersons.loadPersons(this.groupMemberIds);
    }
    if (!this.currentGroupId && this.currentGroupIdFromStorage && !this._mobile) {
      this.updateCurrentGroupId(this.currentGroupIdFromStorage);
    }
    if (!this.currentGroupId && !this.currentGroupIdFromStorage && !this._mobile) {
      this.updateCurrentGroupId(this.groups[0] && this.groups[0].id);
    }
    if (this._preloadPosts) {
      this._preloadedPosts = {};
      this._preloadGroupPosts();
    }
  }

  get currentGroupId() {
    return this.state.currentGroupId;
  }

  get currentGroupIdFromStorage() {
    return this.state.currentGroupId;
  }

  async createTeam(name, members) {
    const group = await this._client.glip().groups().post({
      type: 'Team',
      name,
      members,
      isPublic: true,
      description: ''
    });
    return group.id;
  }
}
