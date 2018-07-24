import GlipPosts from 'ringcentral-integration/modules/GlipPosts';
import { Module } from 'ringcentral-integration/lib/di';
import isBlank from 'ringcentral-integration/lib/isBlank';

import getReducer from './getReducer';

@Module({
  deps: []
})
export default class NewGlipPosts extends GlipPosts {
  constructor(options) {
    super(options);
    this._reducer = getReducer(this.actionTypes);
  }

  async create({ groupId }) {
    let text = this.postInputs[groupId] && this.postInputs[groupId].text;
    const mentions = this.postInputs[groupId] && this.postInputs[groupId].mentions;
    if (isBlank(text) || !groupId) {
      return;
    }
    if (mentions && mentions.length > 0) {
      mentions.forEach((mention) => {
        if (!mention.matcherId) {
          return;
        }
        text = text.replace(mention.mention, `![:Person](${mention.matcherId})`);
      });
    }
    const fakeId = `${Date.now()}`;
    const fakeRecord = {
      id: fakeId,
      groupId,
      creatorId: this._auth.ownerId,
      sendStatus: status.creating,
      creationTime: `${new Date(Date.now())}`,
      text,
      type: 'TextMessage',
    };
    try {
      this.store.dispatch({
        type: this.actionTypes.create,
        groupId,
        record: fakeRecord,
      });
      this.updatePostInput({ text: '', groupId, mentions: [] });
      const record = await this._client.glip().groups(groupId).posts().post({
        text,
      });
      this.store.dispatch({
        type: this.actionTypes.createSuccess,
        groupId,
        record,
        oldRecordId: fakeId,
      });
    } catch (e) {
      fakeRecord.sendStatus = status.createError;
      this.store.dispatch({
        type: this.actionTypes.createError,
        record: fakeRecord,
        groupId,
        oldRecordId: fakeId,
      });
      this.updatePostInput({ text, groupId, mentions });
    }
  }

  updatePostInput({ text, groupId, mentions }) {
    this.store.dispatch({
      type: this.actionTypes.updatePostInput,
      groupId,
      mentions,
      textValue: text,
    });
  }
}
