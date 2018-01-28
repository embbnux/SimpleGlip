import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import defaultAvatar from '../../assets/images/default_avatar.png';
import styles from './styles.scss';

function GroupAvatar({ persons, className }) {
  let image;
  if (persons.length <= 2) {
    let noMes = persons.filter(p => !p.isMe);
    if (noMes.length === 0) {
      noMes = persons;
    }
    const person = noMes && noMes[0];
    image =
      (
        <img
          className={styles.big}
          src={(person && person.avatar) || defaultAvatar}
          alt={person && person.id}
        />
      );
  } else {
    image = (
      <div className={styles.images}>
        {
          persons.slice(0, 9).map(
            person =>
              <img
                key={person.id}
                className={styles.small}
                src={(person && person.avatar) || defaultAvatar}
                alt={person && person.id}
              />
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
  persons: PropTypes.array,
};

GroupAvatar.defaultProps = {
  className: undefined,
  persons: [],
};

export default GroupAvatar;
