import GlipPosts from 'ringcentral-integration/modules/GlipPosts';
import { Module } from 'ringcentral-integration/lib/di';
import isBlank from 'ingcentral-integration/lib/isBlank';

@Module({
  deps: []
})
export default class NewGlipPosts extends GlipPosts {
  async create({ groupId }) {
    const text = this.postInputs[groupId] && this.postInputs[groupId].text;
    if (isBlank(text) || !groupId) {
      return;
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
      this.updatePostInput({ text: '', groupId });
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
      this.updatePostInput({ text, groupId });
    }
  }
}
