import React from 'react';
import { connect } from 'react-redux';
import withPhone from 'ringcentral-widgets/lib/withPhone';

import GlipGroupsPanel from '../../components/GlipGroupsPanel';

function mapToProps(_, {
  phone: {
    glipGroups,
  },
  mobile,
}) {
  return {
    groups: glipGroups.groupsWithUnread,
    currentGroupId: mobile ? null : glipGroups.currentGroupId,
    searchFilter: glipGroups.searchFilter,
    currentPage: glipGroups.pageNumber,
  };
}
function mapToFunctions(_, {
  phone: {
    routerInteraction,
    glipGroups,
    glipPersons,
  }
}) {
  return {
    goToGroup: (groupId) => {
      if (groupId) {
        routerInteraction.push(`/glip/groups/${groupId}`);
      }
    },
    updateSearchFilter: (searchFilter) => {
      glipGroups.updateFilter({ searchFilter });
    },
    onNextPage: (pageNumber) => {
      glipGroups.updateFilter({ pageNumber });
    },
    atRender: ({ id, type }) => {
      let name;
      if (type === 'Team') {
        name = glipGroups.currentGroup && glipGroups.currentGroup.name;
      } else {
        const person = glipPersons.personsMap[id];
        name = (
          person &&
          `${person.firstName}${person.lastName ? ` ${person.lastName}` : ''}`
        ) || id;
      }
      return `@${name}`;
    },
  };
}

const GlipGroupsPage = withPhone(connect(
  mapToProps,
  mapToFunctions
)(GlipGroupsPanel));

export default GlipGroupsPage;
