import { connect } from 'react-redux';
import withPhone from 'ringcentral-widgets/lib/withPhone';

import GlipPersonProfile from '../../components/GlipPersonProfile';

function mapToProps(_, {
  params = {},
  phone: {
    locale,
    contacts,
    glipPersons,
  },
}) {
  const { contactId, contactType } = params;
  const person = contacts.find({ id: contactId, type: contactType });
  const me = glipPersons.personsMap.me || {};

  return {
    person,
    currentLocale: locale.currentLocale,
    isMe: contactId === 'me' || contactId === me.id,
    canShowCall: false,
    showSpinner: !contacts.ready,
  };
}

function mapToFunctions(_, {
  phone: {
    routerInteraction,
    glipPersons,
    glipGroups,
  }
}) {
  return {
    onVisit: (contactId) => {
      glipPersons.loadPerson(contactId);
    },
    startChat: async (personId) => {
      const group = await glipGroups.startChat(personId);
      if (group) {
        routerInteraction.push(`/glip/groups/${group.id}`);
      }
    },

    startCall: async (person) => {
      // todo
    },
  };
}

const GlipPersonProfilePage = withPhone(connect(
  mapToProps,
  mapToFunctions
)(GlipPersonProfile));

export default GlipPersonProfilePage;
