
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Modal from 'ringcentral-widgets/components/Modal';

import DialerPage from 'ringcentral-widgets/containers/DialerPage';
import CallCtrlPage from 'ringcentral-widgets/containers/CallCtrlPage';

export default class GlipModal extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      callStarted: false,
      clickOutToClose: true
    };

    this.mounted = true;
    this._store = props.store;

    if (props.store) {
      props.store.subscribe(() => {
        // this.setState({
        //   callStarted: true
        // });
        // const state = this._store.getState();
        // if (state.call && state.call.callStatus === 'callStatus-connectin') {
        //   if (!this.state.callStarted) {
        //     this.setState({
        //       callStarted: true
        //     });
        //   }
        // }

        // console.log(state && !state.call_Status);
        // if (state && !state.call_Status) {
        //   this.setState({
        //     callStarted: true
        //   });
        // }
      });
    }
  }

  componentDidMount() {
  }

  showModal() {
    this.setState({
      callStarted: true
    });
  }

  onAdd() {

  }
  onBackButtonClicked() {

  }

  render() {
    return (
      <div>
        <Modal clickOutToClose={this.state.clickOutToClose} show={this.state.callStarted} className="active-call-modal">
          {/* <CallCtrlPage onAdd={this.onAdd} onBackButtonClick={this.onBackButtonClicked} /> */}
          <DialerPage />
        </Modal>
      </div>
    );
  }
}

GlipModal.propTypes = {
  store: PropTypes.object.required
};

GlipModal.defaultProps = {
  store: undefined
};
