import { createSelector } from 'reselect';

import { Module } from 'ringcentral-integration/lib/di';
import getter from 'ringcentral-integration/lib/getter';
import sleep from 'ringcentral-integration/lib/sleep';

import GlipGroups from 'ringcentral-integration/modules/GlipGroups';

@Module({ deps: ['ConnectivityMonitor'] })
export default class NewGlipGroups extends GlipGroups {
  constructor({
    connectivityMonitor,
    ...options
  }) {
    super(options);
    if (this._glipPosts) {
      this._glipPosts.addNewPostListener(post => this.onNewPost(post));
    }
    this._connectivityMonitor = connectivityMonitor;
  }

  _shouldInit() {
    return super._shouldInit() && this._connectivityMonitor.ready;
  }

  _shouldReset() {
    return super._shouldReset() || !this._connectivityMonitor.ready;
  }

  async _init() {
    await super._init();
    this._connectivity = this._connectivityMonitor.connectivity;
  }

  async _onStateChange() {
    await super._onStateChange();
    if (this.ready && !this._shouldReset() && this._connectivityMonitor.ready) {
      if (
        this._connectivity === this._connectivityMonitor.connectivity
      ) {
        return;
      }
      this._connectivity = this._connectivityMonitor.connectivity;
      if (!this._connectivity) {
        return;
      }
      await this.fetchData();
      this._preloadGroupPosts(true);
    }
  }

  async _fetchFunction() {
    const result = await this._client.glip().groups().list({ recordCount: 250 });
    return result;
  }

  onNewPost(post) {
    if (post.groupId === this.currentGroupId && this._glipPosts) {
      this._glipPosts.updateReadTime(post.groupId);
    }
  }

  updateCurrentGroupId(groupId) {
    if (groupId === this.currentGroupId) {
      return;
    }
    const lastGroupId = this.currentGroupId;
    super.updateCurrentGroupId(groupId);
    this._glipPosts.loadPosts(lastGroupId);
    this._glipPosts.updateReadTime(groupId);
  }

  async _preloadGroupPosts(force) {
    for (const group of this.groups) {
      if (this._glipPosts) {
        if (!this._glipPosts.postsMap[group.id] || force) {
          await sleep(300);
          await this._glipPosts.loadPosts(group.id);
        }
        if (!this._glipPosts.readTimeMap[group.id]) {
          this._glipPosts.updateReadTime(group.id, (Date.now() - (1000 * 3600 * 2)));
        }
      }
    }
  }

  updateFilter(params) {
    super.updateFilter(params);
    this._preloadGroupPosts();
  }

  @getter
  currentGroupPosts = createSelector(
    () => {
      const postsMap = (this._glipPosts && this._glipPosts.postsMap) || {};
      return postsMap[this.currentGroupId];
    },
    () => (this._glipPersons && this._glipPersons.personsMap) || {},
    (posts, personsMap) => {
      // const posts = postsMap[currentGroupId] || [];
      const reversePosts = (posts || []).slice(0).reverse();
      return reversePosts.map((post) => {
        const creator = personsMap[post.creatorId];
        return {
          ...post,
          sentByMe: post.creatorId === this._auth.ownerId,
          creator,
        };
      });
    },
  )

  @getter
  groupsWithUnread = createSelector(
    () => this.groups,
    () => (this._glipPosts && this._glipPosts.postsMap) || {},
    () => (this._glipPosts && this._glipPosts.readTimeMap) || {},
    (groups, postsMap, readTimeMap) => groups.map((group) => {
      const posts = postsMap[group.id] || [];
      const readTime = readTimeMap[group.id] || Date.now();
      return {
        ...group,
        unread:
          posts.filter(post =>
            (new Date(post.creationTime)).getTime() > readTime &&
            post.creatorId !== this._auth.ownerId
          ).length
      };
    })
  )
}
