import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';

import GlipPostItem from '../GlipPostItem';

export default class GlipPostList extends Component {
  componentDidMount() {
    this._scrollToLastMessage();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.groupId !== this.props.groupId ||
      prevProps.posts.length !== this.props.posts.length
    ) {
      this._scrollToLastMessage();
    }
  }

  _scrollToLastMessage() {
    if (this._listRef) {
      this._listRef.scrollTop = this._listRef.scrollHeight;
    }
  }

  render() {
    const {
      posts,
      className,
      dateTimeFormatter,
      showName,
      atRender,
      viewProfile,
    } = this.props;
    let lastDate;
    return (
      <div
        className={classnames(
          styles.root,
          className,
        )}
        ref={(list) => { this._listRef = list; }}
      >
        {
          posts.map((post) => {
            const date = new Date(post.creationTime);
            const time = (
              date - lastDate < 60 * 1000 && date.getMinutes() === lastDate.getMinutes()
            ) ? null : dateTimeFormatter(post.creationTime);
            lastDate = date;
            return (
              <GlipPostItem
                post={post}
                key={post.id}
                creationTime={time}
                showName={showName}
                atRender={atRender}
                viewProfile={viewProfile}
              />
            );
          })
        }
      </div>
    );
  }
}

GlipPostList.propTypes = {
  className: PropTypes.string,
  posts: PropTypes.array,
  groupId: PropTypes.string,
  showName: PropTypes.bool,
  dateTimeFormatter: PropTypes.func.isRequired,
  viewProfile: PropTypes.func.isRequired,
  atRender: PropTypes.func,
};

GlipPostList.defaultProps = {
  className: undefined,
  posts: [],
  showName: true,
  groupId: undefined,
  atRender: undefined,
};
