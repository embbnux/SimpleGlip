import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from 'ringcentral-widgets/components/Button';

import styles from './styles.scss';

export default function GlipSettings({
  className,
  onLogoutButtonClick,
  me,
}) {
  return (
    <div className={classnames(styles.root, className)}>
      <div className={styles.welcome}>
        Hi, {me.firstName || 'friend'}. Good to see you again.
      </div>
      <div className={styles.logoutSection}>
        <Button
          className={styles.button}
          onClick={onLogoutButtonClick}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

GlipSettings.propTypes = {
  className: PropTypes.string,
  me: PropTypes.object,
  onLogoutButtonClick: PropTypes.func.isRequired,
};

GlipSettings.defaultProps = {
  className: undefined,
  me: {},
};
