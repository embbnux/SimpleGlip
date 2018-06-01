import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SearchInput from 'ringcentral-widgets/components/SearchInput';
import SpinnerOverlay from 'ringcentral-widgets/components/SpinnerOverlay';

import GlipGroupList from '../GlipGroupList';
import GlipTeamCreationModal from '../GlipTeamCreation';

import styles from './styles.scss';

export default class GlipGroupsPanel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchString: props.searchFilter,
      showTeamCreationModal: false,
    };
    this.updateSeachString = (e) => {
      const searchString = e.target.value;
      this.setState({
        searchString,
      });
      this.props.updateSearchFilter(searchString);
    };
    this.toggleShowTeamCreationModal = () => {
      console.log('click');
      this.setState(preState => ({
        showTeamCreationModal: !preState.showTeamCreationModal,
      }));
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
      atRender,
      goToGroup,
      filteredContacts,
      updateContactSearchFilter,
      contactSearchFilter,
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
          <div
            className={styles.addTeam}
            onClick={this.toggleShowTeamCreationModal}
          >
            +
          </div>
        </div>
        <div className={styles.content}>
          <GlipGroupList
            groups={groups}
            goToGroup={goToGroup}
            currentGroupId={currentGroupId}
            onNextPage={onNextPage}
            currentPage={currentPage}
            atRender={atRender}
          />
        </div>
        <GlipTeamCreationModal
          filteredContacts={filteredContacts}
          updateFilter={updateContactSearchFilter}
          searchFilter={contactSearchFilter}
          onCancel={this.toggleShowTeamCreationModal}
          show={this.state.showTeamCreationModal}
        />
        {spinner}
      </div>
    );
  }
}

GlipGroupsPanel.propTypes = {
  groups: PropTypes.array,
  className: PropTypes.string,
  searchFilter: PropTypes.string,
  currentGroupId: PropTypes.string,
  goToGroup: PropTypes.func.isRequired,
  updateSearchFilter: PropTypes.func.isRequired,
  showSpinner: PropTypes.bool,
  currentPage: PropTypes.number,
  onNextPage: PropTypes.func,
  atRender: PropTypes.func,
};

GlipGroupsPanel.defaultProps = {
  groups: [],
  className: undefined,
  searchFilter: '',
  currentGroupId: undefined,
  showSpinner: false,
  currentPage: 1,
  onNextPage: undefined,
  atRender: undefined,
};
