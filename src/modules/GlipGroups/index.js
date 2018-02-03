import { Module } from 'ringcentral-integration/lib/di';

import GlipGroups from 'ringcentral-integration/modules/GlipGroups';

@Module({ deps: [] })
export default class NewGlipGroups extends GlipGroups {
  updateCurrentGroupId(groupId) {
    if (!groupId) {
      return;
    }
    this.store.dispatch({
      type: this.actionTypes.updateCurrentGroupId,
      groupId,
    });
    this._glipPosts.loadPosts(groupId, 50);
    if (this._glipPersons) {
      this._glipPersons.loadPersons(
        this.currentGroup && this.currentGroup.members
      );
    }
  }
}
