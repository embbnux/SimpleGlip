import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SearchInput from 'ringcentral-widgets/components/SearchInput';
import SpinnerOverlay from 'ringcentral-widgets/components/SpinnerOverlay';

import GlipGroupList from '../GlipGroupList';

import styles from './styles.scss';

export default class GlipGroupsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: props.seachFilter,
    };
    this.updateSeachString = (e) => {
      const searchString = e.target.value;
      this.setState({
        searchString,
      });
      this.props.updateSearchFilter(searchString);
    };
    this.goToGroup = (id) => {
      if (id === this.props.currentGroupId) {
        return;
      }
      this.props.goToGroup(id);
    };
  }

  render() {
    const {
      groups,
      className,
      currentGroupId,
      showSpinner,
      currentPage,
      onNextPage,
    } = this.props;
    const spinner = showSpinner ? (<SpinnerOverlay />) : null;
    return (
      <div className={classnames(styles.root, className)}>
        <div className={styles.header}>
          <SearchInput
            className={styles.searchInput}
            value={this.state.searchString}
            onChange={this.updateSeachString}
            placeholder={'Searching'}
          />
        </div>
        <div className={styles.content}>
          <GlipGroupList
            groups={groups}
            goToGroup={this.goToGroup}
            currentGroupId={currentGroupId}
            onNextPage={onNextPage}
            currentPage={currentPage}
          />
        </div>
        {spinner}
      </div>
    );
  }
}

GlipGroupsPanel.propTypes = {
  groups: PropTypes.array,
  className: PropTypes.string,
  seachFilter: PropTypes.string,
  currentGroupId: PropTypes.string,
  goToGroup: PropTypes.func.isRequired,
  updateSearchFilter: PropTypes.func.isRequired,
  showSpinner: PropTypes.bool,
  currentPage: PropTypes.number,
  onNextPage: PropTypes.func,
};

GlipGroupsPanel.defaultProps = {
  groups: [],
  className: undefined,
  seachFilter: '',
  currentGroupId: undefined,
  showSpinner: false,
  currentPage: 1,
  onNextPage: undefined,
};
