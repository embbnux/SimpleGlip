import { connect } from 'react-redux';
import withPhone from 'ringcentral-widgets/lib/withPhone';

import GlipGroupsPanel from '../../components/GlipGroupsPanel';

function mapToProps(_, {
  phone: {
    glipGroups,
  },
}) {
  return {
    groups: glipGroups.groups,
    currentGroupId: glipGroups.currentGroupId,
    seachFilter: glipGroups.seachFilter,
    currentPage: glipGroups.pageNumber,
  };
}
function mapToFunctions(_, {
  phone: {
    routerInteraction,
    glipGroups,
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
  };
}

const GlipGroupsPage = withPhone(connect(
  mapToProps,
  mapToFunctions
)(GlipGroupsPanel));

export default GlipGroupsPage;
