import { connect } from 'react-redux';
import withPhone from 'ringcentral-widgets/lib/withPhone';

import GlipChatPanel from '../..//components/GlipChatPanel';

function mapToProps(_, {
  params,
  phone: {
    glipGroups,
    glipPosts,
  },
}) {
  return {
    groupId: params.groupId,
    group: glipGroups.currentGroup,
    posts: glipGroups.currentGroupPosts,
    textValue:
      (
        glipPosts.postInputs[params.groupId] &&
        glipPosts.postInputs[params.groupId].text
      ),
  };
}

function mapToFunctions(_, {
  phone: {
    glipGroups,
    glipPosts,
    dateTimeFormat,
  },
  dateTimeFormatter = time =>
    dateTimeFormat.formatDateTime({ utcTimestamp: time }),
}) {
  return {
    loadGroup: (groupId) => {
      glipGroups.updateCurrentGroupId(groupId);
    },
    createPost: async () => {
      await glipPosts.create({
        groupId: glipGroups.currentGroupId,
      });
    },
    updateText: (text) => {
      glipPosts.updatePostInput({
        text,
        groupId: glipGroups.currentGroupId,
      });
    },
    dateTimeFormatter,
  };
}

const GlipChatPage = withPhone(connect(
  mapToProps,
  mapToFunctions
)(GlipChatPanel));

export default GlipChatPage;
