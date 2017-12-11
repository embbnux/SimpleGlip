import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';

import GlipGroupAvatar from '../GlipGroupAvatar';

function LatestPost({ isGroup, latestPost }) {
  if (!latestPost) {
    return null;
  }
  if (!isGroup || !latestPost.creator) {
    return (
      <div className={styles.latestPost}>
        {latestPost.text || 'Unsupported message'}
      </div>
    );
  }
  return (
    <div className={styles.latestPost}>
      {latestPost.creator.firstName}: {latestPost.text || 'Unsupported message'}
    </div>
  );
}

LatestPost.propTypes = {
  isGroup: PropTypes.bool.isRequired,
  latestPost: PropTypes.object,
};

LatestPost.defaultProps = {
  latestPost: null,
};

export default function GlipGroup({
  group,
  className,
  goToGroup,
  active,
}) {
  return (
    <div
      className={classnames(
        styles.root,
        (active ? styles.active : null),
        className,
      )}
      onClick={goToGroup}
    >
      <GlipGroupAvatar
        avatars={group.avatars}
        alt={group.id}
        className={styles.avatar}
      />
      <div className={styles.content}>
        <div className={styles.name} title={group.name}>{group.name}</div>
        <LatestPost isGroup={group.members.length > 2} latestPost={group.latestPost} />
      </div>
    </div>
  );
}

GlipGroup.propTypes = {
  className: PropTypes.string,
  group: PropTypes.object,
  goToGroup: PropTypes.func.isRequired,
  active: PropTypes.bool,
};

GlipGroup.defaultProps = {
  className: undefined,
  group: {},
  active: false,
};
