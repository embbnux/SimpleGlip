import React from 'react';
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
    glipPersons,
    dateTimeFormat,
    routerInteraction,
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
    atRender: ({ id, type }) => {
      let name;
      if (type === 'Team') {
        name = glipGroups.currentGroup && glipGroups.currentGroup.name;
      } else {
        const person = glipPersons.personsMap[id];
        name = (person && `${person.firstName} ${person.lastName}`) || id;
      }
      const onClickAtLink = (e) => {
        e.preventDefault();
        if (type === 'Person') {
          routerInteraction.push(`/glip/persons/${id}`);
        }
      };
      return (
        <a href={`#${id}`} onClick={onClickAtLink}>@{name}</a>
      );
    },
    dateTimeFormatter,
  };
}

const GlipChatPage = withPhone(connect(
  mapToProps,
  mapToFunctions
)(GlipChatPanel));

export default GlipChatPage;
