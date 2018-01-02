import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import SpinnerOverlay from 'ringcentral-widgets/components/SpinnerOverlay';

import styles from './styles.scss';

import GlipPostList from '../GlipPostList';
import GlipChatForm from '../GlipChatForm';

export default class GlipChatPage extends Component {
  componentDidMount() {
    this.props.loadGroup(this.props.groupId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.groupId !== nextProps.groupId) {
      this.props.loadGroup(nextProps.groupId);
    }
  }

  render() {
    const {
      group,
      className,
      posts,
      updateText,
      createPost,
      textValue,
      dateTimeFormatter,
      showSpinner,
      atRender,
    } = this.props;
    const spinner = showSpinner ? (<SpinnerOverlay />) : null;
    return (
      <div
        className={classnames(
          styles.root,
          className,
        )}
      >
        <div className={styles.header}>
          {group.name}
        </div>
        <div className={styles.content}>
          <GlipPostList
            posts={posts}
            atRender={atRender}
            groupId={group.id}
            showName={group.members && (group.members.length > 2)}
            dateTimeFormatter={dateTimeFormatter}
          />
        </div>
        <div className={styles.inputArea}>
          <GlipChatForm
            textValue={textValue}
            onTextChange={updateText}
            groupId={group.id}
            onSubmit={createPost}
          />
        </div>
        {spinner}
      </div>
    );
  }
}

GlipChatPage.propTypes = {
  className: PropTypes.string,
  group: PropTypes.object,
  posts: PropTypes.array,
  groupId: PropTypes.string,
  textValue: PropTypes.string,
  showSpinner: PropTypes.bool,
  loadGroup: PropTypes.func.isRequired,
  updateText: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired,
  dateTimeFormatter: PropTypes.func.isRequired,
  atRender: PropTypes.func,
};

GlipChatPage.defaultProps = {
  className: undefined,
  groupId: null,
  group: {},
  posts: [],
  textValue: '',
  showSpinner: false,
  atRender: undefined,
};
