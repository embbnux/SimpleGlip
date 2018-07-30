
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Modal from 'ringcentral-widgets/components/Modal';

import DialerPage from 'ringcentral-widgets/containers/DialerPage';
import CallCtrlPage from 'ringcentral-widgets/containers/CallCtrlPage';
import IncomingCallPage from 'ringcentral-widgets/containers/IncomingCallPage';

export default class GlipModal extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      callStatus: props.callStatus,
      clickOutToClose: true
    };
  }

  componentDidMount() {
  }

  render() {
    const {
      callStatus
    } = this.props;
    return (
      <div>
        <Modal clickOutToClose={this.state.clickOutToClose} show={callStatus && callStatus.callStarted} className="active-call-modal">
          {
            callStatus && callStatus.direction === 'inbound' && (
              <IncomingCallPage onBackButtonClick={() => {}} />
            )
          }
          {
            callStatus && callStatus.direction === 'outbound' && (
              <CallCtrlPage onAdd={() => {}} onBackButtonClick={() => { }} />
            )
          }

          <DialerPage />
        </Modal>
      </div>
    );
  }
}

GlipModal.propTypes = {
  callStatus: PropTypes.object
};

GlipModal.defaultProps = {
  callStatus: { callStarted: false }
};
