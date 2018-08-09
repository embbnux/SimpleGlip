import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import SpinnerOverlay from 'ringcentral-widgets/components/SpinnerOverlay';
import Button from 'ringcentral-widgets/components/Button';

import defaultAvatar from '@ringcentral-integration/glip-widgets/assets/images/default_avatar.png';
import leftArrow from '@ringcentral-integration/glip-widgets/assets/images/left_arrow.png';

import styles from './styles.scss';

export default class PersonProfile extends Component {
  constructor() {
    super();
    this.state = {
      buttonDisabled: false,
    };

    this.onStartChat = async () => {
      this.setState({
        buttonDisabled: true,
      });
      await this.props.startChat(this.props.person.id);
      if (!this._mounted) {
        return;
      }
      this.setState({
        buttonDisabled: false,
      });
    };
  }

  componentDidMount() {
    this._mounted = true;
    if (typeof this.props.onVisit === 'function') {
      this.props.onVisit(this.props.person && this.props.person.id);
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    const {
      className,
      person,
      isMe,
      showSpinner,
      onBackClick,
    } = this.props;

    if (!person) {
      return null;
    }

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
        {backIcon}
        <div className={styles.avatar}>
          <img src={person.avatar || defaultAvatar} alt={person.id} />
        </div>
        <div className={styles.name}>
          {person.firstName} {person.lastName}
        </div>
        <div className={styles.email}>
          {person.email}
        </div>
        {
          isMe && (
            <div className={styles.welcome}>
              Welcome Back
            </div>
          )
        }
        {
          !isMe && (
            <div className={styles.welcome}>
              <Button
                className={styles.chatButton}
                onClick={this.onStartChat}
                disabled={this.state.buttonDisabled}
              >
                Chat
              </Button>
            </div>
          )
        }
        {spinner}
      </div>
    );
  }
}

PersonProfile.propTypes = {
  className: PropTypes.string,
  person: PropTypes.object,
  isMe: PropTypes.bool,
  showSpinner: PropTypes.bool,
  onVisit: PropTypes.func,
  startChat: PropTypes.func.isRequired
};

PersonProfile.defaultProps = {
  className: undefined,
  person: {},
  isMe: false,
  showSpinner: false,
  onVisit: undefined,
};
