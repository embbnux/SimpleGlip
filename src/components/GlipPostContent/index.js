import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Markdown from '../Markdown';

import styles from './styles.scss';

function PostContent({ post, className }) {
  if (!post.text) {
    return (
      <div className={classnames(styles.root, className)}>
        Unsupported message
      </div>
    );
  }
  return (
    <div className={classnames(styles.root, className)}>
      <Markdown text={post.text} />
    </div>
  );
}

PostContent.propTypes = {
  post: PropTypes.object.isRequired,
  className: PropTypes.string,
};

PostContent.defaultProps = {
  className: undefined,
};

export default PostContent;
