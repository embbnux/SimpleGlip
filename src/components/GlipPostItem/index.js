import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import status from '../../modules/GlipPosts/status';
import styles from './styles.scss';

import GlipPostContent from '../GlipPostContent';

function PostAvatar({ creator }) {
  if (!creator) {
    return null;
  }
  return (
    <img src={creator.avatar} alt={creator.id} />
  );
}

PostAvatar.propTypes = {
  creator: PropTypes.object,
};

PostAvatar.defaultProps = {
  creator: null,
};

function PostName({ creator, showName }) {
  if (!creator || !showName) {
    return null;
  }
  return (
    <span>
      {creator.firstName} {creator.lastName}
    </span>
  );
}

PostName.propTypes = {
  creator: PropTypes.object,
  showName: PropTypes.bool.isRequired,
};

PostName.defaultProps = {
  creator: null,
};

function PostStatus({ sendStatus }) {
  if (!sendStatus) {
    return null;
  }
  return (
    <span>
      ({sendStatus === status.creating ? 'Sending' : 'Send failed'})
    </span>
  );
}

PostStatus.propTypes = {
  sendStatus: PropTypes.string,
};

PostStatus.defaultProps = {
  sendStatus: null,
};

function PostTime({ creationTime }) {
  if (!creationTime) {
    return null;
  }
  return (
    <div className={styles.time}>
      {creationTime}
    </div>
  );
}

PostTime.propTypes = {
  creationTime: PropTypes.string,
};

PostTime.defaultProps = {
  creationTime: null,
};

export default function GlipPost({
  post,
  className,
  creationTime,
  showName,
}) {
  return (
    <div
      className={classnames(
        styles.root,
        className,
      )}
    >
      <PostTime
        creationTime={creationTime}
      />
      <div className={styles.avatar}>
        <PostAvatar creator={post.creator} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          <PostName creator={post.creator} showName={showName} />
          <PostStatus sendStatus={post.sendStatus} />
        </div>
        <GlipPostContent post={post} />
      </div>
    </div>
  );
}

GlipPost.propTypes = {
  className: PropTypes.string,
  post: PropTypes.object,
  creationTime: PropTypes.string,
  showName: PropTypes.bool,
};

GlipPost.defaultProps = {
  className: undefined,
  creationTime: undefined,
  post: {},
  showName: true,
};
