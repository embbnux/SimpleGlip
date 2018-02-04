import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import i18n from 'ringcentral-widgets/components/LoginPanel/i18n';
import SpinnerOverlay from 'ringcentral-widgets/components/SpinnerOverlay';
import Particles from 'react-particles-js';

import particlesConfig from './particles.json';
import styles from './styles.scss';

export default class LoginPanel extends Component {
  componentDidMount() {
    this.props.setupOAuth();
  }

  componentWillUnmount() {
    this.props.destroyOAuth();
  }

  render() {
    const {
      className,
      onLoginButtonClick,
      currentLocale,
      disabled,
      version,
      showSpinner,
      children,
    } = this.props;
    const spinner = showSpinner ?
      <SpinnerOverlay /> :
      null;
    const versionDisplay = version ?
      (
        <div className={styles.versionContainer} >
          {i18n.getString('version', currentLocale)} {version}
        </div>
      ) :
      null;
    return (
      <div className={classnames(styles.root, className)}>
        <Particles
          params={particlesConfig}
          className={styles.background}
        />
        <div className={styles.content}>
          <h1 className={styles.title}>
            Simple Glip
          </h1>
          <button
            className={styles.loginButton}
            onClick={onLoginButtonClick}
            disabled={disabled} >
            Login With RingCentral
          </button>
          <p className={styles.description}>
            A light client of RingCentral Glip
          </p>
        </div>

        {versionDisplay}
        {spinner}
        {children}
      </div>
    );
  }
}

LoginPanel.propTypes = {
  className: PropTypes.string,
  setupOAuth: PropTypes.func.isRequired,
  destroyOAuth: PropTypes.func.isRequired,
  currentLocale: PropTypes.string.isRequired,
  onLoginButtonClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  version: PropTypes.string,
  showSpinner: PropTypes.bool,
  children: PropTypes.node,
};

LoginPanel.defaultProps = {
  className: null,
  disabled: false,
  version: undefined,
  showSpinner: false,
  children: undefined,
};
