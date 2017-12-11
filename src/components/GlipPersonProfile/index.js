import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import SpinnerOverlay from 'ringcentral-widgets/components/SpinnerOverlay';

import styles from './styles.scss';

export default function PersonProfile({
  className,
  person,
  isMe,
  showSpinner,
}) {
  const spinner = showSpinner ? (<SpinnerOverlay />) : null;
  return (
    <div
      className={classnames(
        styles.root,
        className,
      )}
    >
      <div className={styles.avatar}>
        <img src={person.avatar} alt={person.id} />
      </div>
      <div className={styles.name}>
        {person.firstName} {person.lastName}
      </div>
      <div className={styles.email}>
        {person.email}
      </div>
      <div className={styles.welcome}>
        {isMe ? 'Welcome Back' : null}
      </div>
      {spinner}
    </div>
  );
}

PersonProfile.propTypes = {
  className: PropTypes.string,
  person: PropTypes.object,
  isMe: PropTypes.bool,
  showSpinner: PropTypes.bool,
};

PersonProfile.defaultProps = {
  className: undefined,
  person: {},
  isMe: false,
  showSpinner: false,
};
