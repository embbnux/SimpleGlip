import { connect } from 'react-redux';
import withPhone from 'ringcentral-widgets/lib/withPhone';

import GlipPersonProfile from '../../components/GlipPersonProfile';

function mapToProps(_, {
  params = {},
  phone: {
    glipPersons,
  },
}) {
  const personId = params.personId;
  const person = glipPersons.personsMap[personId] || {};
  const me = glipPersons.personsMap.me || {};

  return {
    person,
    isMe: personId === 'me' || personId === me.id,
    showSpinner: !glipPersons.ready,
  };
}
function mapToFunctions(_, {
  phone: {
    routerInteraction,
  }
}) {
  return {
    goToGroup: (groupId) => {
      if (groupId) {
        routerInteraction.push(`/glip/groups/${groupId}`);
      }
    },
  };
}

const GlipPersonProfilePage = withPhone(connect(
  mapToProps,
  mapToFunctions
)(GlipPersonProfile));

export default GlipPersonProfilePage;
