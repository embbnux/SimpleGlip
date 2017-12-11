import { connect } from 'react-redux';
import withPhone from 'ringcentral-widgets/lib/withPhone';

import GlipSettings from '../../components/GlipSettings';

function mapToProps(_, {
  phone: {
    glipPersons,
  },
}) {
  return {
    me: glipPersons.personsMap.me,
  };
}
function mapToFunctions(_, {
  phone: {
    auth,
  }
}) {
  return {
    onLogoutButtonClick: async () => {
      await auth.logout();
    },
  };
}

const GlipSettingsPage = withPhone(connect(
  mapToProps,
  mapToFunctions
)(GlipSettings));

export default GlipSettingsPage;
