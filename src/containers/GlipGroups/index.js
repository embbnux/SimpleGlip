import React from 'react';
import { connect } from 'react-redux';
import withPhone from 'ringcentral-widgets/lib/withPhone';

import GlipGroupsPanel from '../../components/GlipGroupsPanel';

function mapToProps(_, {
  phone: {
    glipGroups,
    contacts,
    routerInteraction,
  },
  mobile,
}) {
  const isInChat = routerInteraction.currentPath.indexOf('/glip/groups') > -1;
  return {
    groups: glipGroups.groupsWithUnread,
    currentGroupId: (!isInChat || mobile) ? null : glipGroups.currentGroupId,
    searchFilter: glipGroups.searchFilter,
    currentPage: glipGroups.pageNumber,
    filteredContacts: contacts.filteredContacts,
    contactSearchFilter: contacts.searchFilter,
  };
}
function mapToFunctions(_, {
  phone: {
    routerInteraction,
    glipGroups,
    contacts,
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
    updateContactSearchFilter: (searchFilter) => {
      contacts.updateFilter({ searchFilter });
    },
    createTeam: async ({ teamName, selectedContacts }) => {
      const groupId = await glipGroups.createTeam(teamName, selectedContacts.map(sc => sc.email));
      routerInteraction.push(`/glip/groups/${groupId}`);
    }
  };
}

const GlipGroupsPage = withPhone(connect(
  mapToProps,
  mapToFunctions
)(GlipGroupsPanel));

export default GlipGroupsPage;
