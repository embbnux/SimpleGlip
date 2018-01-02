import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Markdown from '../Markdown';

import styles from './styles.scss';

function PostContent({ post, className, atRender }) {
  if (!post.text) {
    return (
      <div className={classnames(styles.root, className)}>
        Unsupported message
      </div>
    );
  }
  return (
    <div className={classnames(styles.root, className)}>
      <Markdown text={post.text} atRender={atRender} />
    </div>
  );
}

PostContent.propTypes = {
  post: PropTypes.object.isRequired,
  className: PropTypes.string,
  atRender: PropTypes.func,
};

PostContent.defaultProps = {
  className: undefined,
  atRender: undefined,
};

export default PostContent;
