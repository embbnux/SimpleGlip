import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';

function GroupAvatar({ avatars, alt, className }) {
  let image;
  if (avatars.length === 1) {
    image = (<img className={styles.big} src={avatars[0]} alt={alt} />);
  } else {
    image = (
      <div className={styles.images}>
        {
          avatars.slice(0, 9).map(
            (avatar, index) =>
              <img key={`${avatar}${index}`} className={styles.small} src={avatar} alt={`${alt}${index}`} />
          )
        }
      </div>
    );
  }
  return (
    <div className={classnames(styles.root, className)}>
      {image}
    </div>
  );
}

GroupAvatar.propTypes = {
  className: PropTypes.string,
  avatars: PropTypes.array,
  alt: PropTypes.string.isRequired,
};

GroupAvatar.defaultProps = {
  className: undefined,
  avatars: [],
};

export default GroupAvatar;
