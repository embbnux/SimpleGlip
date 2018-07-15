import GlipGroups from 'ringcentral-integration/modules/GlipGroups';
import { Module } from 'ringcentral-integration/lib/di';
import getter from 'ringcentral-integration/lib/getter';
import sleep from 'ringcentral-integration/lib/sleep';

import { createSelector } from 'reselect';

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

  async _preloadGroupPosts(force) {
    const groups = this.groups.slice(0, 20);
    for (const group of groups) {
      if (!this._glipPosts) {
        break;
      }
      if (this._preloadedPosts[group.id]) {
        continue;
      }
      this._preloadedPosts[group.id] = true;
      if (!this._glipPosts.postsMap[group.id] || force) {
        await sleep(this._preloadPostsDelayTtl);
        if (!this._glipPosts.postsMap[group.id] || force) {
          await this._glipPosts.fetchPosts(group.id);
        }
      }
      if (!this._glipPosts.readTimeMap[group.id]) {
        this._glipPosts.updateReadTime(group.id, (Date.now() - (1000 * 3600 * 2)));
      }
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

  @getter
  groups = createSelector(
    () => this.filteredGroups,
    (filteredGroups) => {
      const sortedGroups =
        filteredGroups.sort((a, b) => {
          if (a.updatedTime === b.updatedTime) return 0;
          return a.updatedTime > b.updatedTime ?
            -1 :
            1;
        });
      return sortedGroups;
    },
  )
}
