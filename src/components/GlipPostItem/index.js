import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import defaultAvatar from '../../assets/images/default_avatar.png';
import status from '../../modules/GlipPosts/status';
import styles from './styles.scss';

import GlipPostContent from '../GlipPostContent';

function PostAvatar({ creator, viewProfile }) {
  if (!creator) {
    return (
      <img src={defaultAvatar} alt="default avatar" />
    );
  }
  return (
    <img
      onClick={() => viewProfile(creator.id)}
      src={creator.avatar || defaultAvatar}
      alt={creator.id}
    />
  );
}

PostAvatar.propTypes = {
  creator: PropTypes.object,
  viewProfile: PropTypes.func.isRequired,
};

PostAvatar.defaultProps = {
  creator: null,
};

function PostName({ creator, showName, viewProfile }) {
  if (!creator || !showName) {
    return null;
  }
  return (
    <span className={styles.name} onClick={() => viewProfile(creator.id)}>
      {creator.firstName} {creator.lastName}
    </span>
  );
}

PostName.propTypes = {
  creator: PropTypes.object,
  viewProfile: PropTypes.func.isRequired,
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
  atRender,
  viewProfile,
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
        <PostAvatar creator={post.creator} viewProfile={viewProfile} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          <PostName creator={post.creator} showName={showName} viewProfile={viewProfile} />
          <PostStatus sendStatus={post.sendStatus} />
        </div>
        <GlipPostContent post={post} atRender={atRender} />
      </div>
    </div>
  );
}

GlipPost.propTypes = {
  className: PropTypes.string,
  post: PropTypes.object,
  creationTime: PropTypes.string,
  showName: PropTypes.bool,
  atRender: PropTypes.func,
  viewProfile: PropTypes.func.isRequired,
};

GlipPost.defaultProps = {
  className: undefined,
  creationTime: undefined,
  post: {},
  showName: true,
  atRender: undefined,
};
