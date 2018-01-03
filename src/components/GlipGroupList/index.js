import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';

import GlipGroupItem from '../GlipGroupItem';

export default class GlipGroupList extends Component {
  constructor(props) {
    super(props);
    this._downwards = false;

    this._onScroll = (e) => {
      this._detectNextPage(e.target);
    };
  }

  componentDidMount() {
    this._nextTimeOut = setTimeout(() => {
      this._detectNextPage(this._rootElem);
    }, 1000);
  }

  componentWillUnmount() {
    if (this._nextTimeOut) {
      clearTimeout(this._nextTimeOut);
    }
  }

  _detectNextPage(el) {
    if (!el) {
      return;
    }
    if (this._downwards) {
      if ((el.scrollTop + el.clientHeight) > (el.scrollHeight - 20)) {
        this._downwards = false;
        const { currentPage, onNextPage } = this.props;
        if (typeof onNextPage === 'function') {
          onNextPage(currentPage + 1);
        }
      }
    } else if ((el.scrollTop + el.clientHeight) < (el.scrollHeight - 30)) {
      this._downwards = true;
    }
  }

  render() {
    const {
      groups,
      className,
      currentGroupId,
      goToGroup,
      atRender,
    } = this.props;
    return (
      <div
        className={classnames(
          styles.root,
          className,
        )}
        onScroll={this._onScroll}
        ref={(el) => { this._rootElem = el; }}
      >
        {
          groups.map(group => (
            <GlipGroupItem
              group={group}
              key={group.id}
              active={group.id === currentGroupId}
              goToGroup={() => { goToGroup(group.id); }}
              atRender={atRender}
            />
          ))
        }
      </div>
    );
  }
}

GlipGroupList.propTypes = {
  className: PropTypes.string,
  groups: PropTypes.array,
  goToGroup: PropTypes.func.isRequired,
  currentGroupId: PropTypes.string,
  currentPage: PropTypes.number,
  onNextPage: PropTypes.func,
  atRender: PropTypes.func,
};

GlipGroupList.defaultProps = {
  className: undefined,
  groups: [],
  currentGroupId: undefined,
  currentPage: 1,
  onNextPage: undefined,
  atRender: undefined,
};
