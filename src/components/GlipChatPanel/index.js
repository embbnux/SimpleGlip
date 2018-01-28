import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import SpinnerOverlay from 'ringcentral-widgets/components/SpinnerOverlay';

import styles from './styles.scss';

import GlipPostList from '../GlipPostList';
import GlipChatForm from '../GlipChatForm';
import GlipGroupName from '../GlipGroupName';

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
      uploadFile,
      viewProfile,
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
          <GlipGroupName group={group} />
        </div>
        <div className={styles.content}>
          <GlipPostList
            posts={posts}
            atRender={atRender}
            groupId={group.id}
            showName={group.members && (group.members.length > 2)}
            dateTimeFormatter={dateTimeFormatter}
            viewProfile={viewProfile}
          />
        </div>
        <div className={styles.inputArea}>
          <GlipChatForm
            textValue={textValue}
            onTextChange={updateText}
            groupId={group.id}
            onSubmit={createPost}
            onUploadFile={uploadFile}
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
  uploadFile: PropTypes.func.isRequired,
  dateTimeFormatter: PropTypes.func.isRequired,
  atRender: PropTypes.func,
  viewProfile: PropTypes.func.isRequired,
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
