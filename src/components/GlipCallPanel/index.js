import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import SpinnerOverlay from 'ringcentral-widgets/components/SpinnerOverlay';
import ActiveCallPanel from 'ringcentral-widgets/components/ActiveCallPanel';

import styles from './styles.scss';
import leftArrow from '../../assets/images/left_arrow.png';

import GlipGroupName from '../GlipGroupName';

const props = {};
props.currentLocale = 'en-US';
props.onMute = () => null;
props.onUnmute = () => null;
props.onHold = () => null;
props.onUnhold = () => null;
props.onRecord = () => null;
props.onStopRecord = () => null;
props.onAdd = () => null;
props.onMerge = () => null;
props.onHangup = () => null;
props.onPark = () => null;
props.showBackButton = true;
props.onBackButtonClick = () => null;
props.onKeyPadChange = () => null;
props.formatPhone = phone => phone;
props.phoneNumber = '1234567890';
props.startTime = (new Date()).getTime();
props.areaCode = '';
props.countryCode = 'US';
props.nameMatches = [];
props.onSelectMatcherName = () => null;
props.selectedMatcherIndex = 0;
props.fallBackName = 'Unknown';
props.flipNumbers = [];
props.recordStatus = 'recordStatus-idle';
props.onShowKeyPad = () => null;
props.layout = 'normalCtrl';
props.calls = [];

export default class GlipCallPanel extends Component {
  componentDidMount() {
    // this.props.loadGroup(this.props.groupId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.groupId !== nextProps.groupId) {
      // this.props.loadGroup(nextProps.groupId);
    }
  }

  render() {
    const {
      group,
      className,
      showSpinner,
      onBackClick
    } = this.props;
    const spinner = showSpinner ? (<SpinnerOverlay />) : null;
    const backIcon =
      typeof onBackClick === 'function' ? (
        <img src={leftArrow} className={styles.backIcon} onClick={onBackClick} />
      ) : null
    return (
      <div
        className={classnames(
          styles.root,
          className,
        )}
      >
        <div className={styles.header}>
          {backIcon}
          <GlipGroupName group={group} showNumber />
        </div>
        <div>
          <ActiveCallPanel {...props} />
        </div>
        {spinner}
      </div>
    );
  }
}

GlipCallPanel.propTypes = {
  className: PropTypes.string,
  group: PropTypes.object,
  groupId: PropTypes.string,
  showSpinner: PropTypes.bool,
  onBackClick: PropTypes.func,
};

GlipCallPanel.defaultProps = {
  className: undefined,
  groupId: null,
  glipGroups: {},
  group: {},
  posts: [],
  textValue: '',
  showSpinner: false,
  atRender: undefined,
  onBackClick: undefined,
  openCallPage: undefined,
};
