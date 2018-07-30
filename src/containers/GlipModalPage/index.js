import { connect } from 'react-redux';
import withPhone from 'ringcentral-widgets/lib/withPhone';

import GlipModal from '../../components/GlipModal';

function mapToProps(_, {
  phone: {
    webphone,
  }
}) {
  return {
    callStatus: {
      callStarted: (webphone && webphone.ringSessions.length === 1) ||
         (webphone.sessions && webphone.sessions.length > 0),
      direction: webphone && webphone.ringSessions.length === 1 ? 'inbound' : 'outbound'
    }
  };
}

function mapToFunctions() {
  return {

  };
}

const GlipModalPage = withPhone(connect(
  mapToProps,
  mapToFunctions,
)(GlipModal));

export {
  mapToFunctions,
  mapToProps,
  GlipModalPage as default,
};
