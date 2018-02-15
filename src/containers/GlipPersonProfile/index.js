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
  const me = glipPersons.me || {};
  const person =
    personId === 'me' ? me : glipPersons.personsMap[personId];
  return {
    person: person || {},
    isMe: personId === 'me' || personId === me.id,
    showSpinner: !glipPersons.ready,
  };
}

function mapToFunctions(_, {
  phone: {
    routerInteraction,
    glipGroups,
  }
}) {
  return {
    startChat: async (personId) => {
      const group = await glipGroups.startChat(personId);
      if (group) {
        routerInteraction.push(`/glip/groups/${group.id}`);
      }
    },
  };
}

const GlipPersonProfilePage = withPhone(connect(
  mapToProps,
  mapToFunctions
)(GlipPersonProfile));

export default GlipPersonProfilePage;
