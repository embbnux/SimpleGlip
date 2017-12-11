import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';

export default function SideView({
  className,
  children,
  side,
  smallSide,
}) {
  return (
    <div
      className={classnames(
        styles.root,
        (smallSide ? styles.smallSide : null),
        className,
      )}
    >
      <div className={styles.side}>
        {side}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
SideView.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  side: PropTypes.node,
  smallSide: PropTypes.bool,
};

SideView.defaultProps = {
  className: undefined,
  children: undefined,
  side: undefined,
  smallSide: false,
};
