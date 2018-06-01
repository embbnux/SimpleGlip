import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'ringcentral-widgets/components/Modal';
import SearchInput from 'ringcentral-widgets/components/SearchInput';
import TextInput from 'ringcentral-widgets/components/TextInput';

import styles from './styles.scss';

export default class GlipTeamCreationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedContacts: [],
      teamName: '',
    };

    this.updateSeachString = (e) => {
      const searchString = e.target.value;
      this.props.updateFilter(searchString);
    };

    this.updateTeamName = (e) => {
      const name = e.target.value;
      this.setState({
        teamName: name
      });
    };

    this.removeContact = (email) => {
      this.setState(previousState => ({
        selectedContacts:
          previousState.selectedContacts.filter(c => c.email !== email)
      }));
    };

    this.onCancel = () => {
      this.props.updateFilter('');
      this.props.onCancel();
    };

    this.onConfirm = () => {
      this.props.updateFilter('');
      this.props.onConfirm(this.state);
    };

    this.addContact = (contact) => {
      const oldIndex = this.state.selectedContacts
                           .findIndex((c) => c.email === contact.email);
      if (oldIndex > -1) {
        return;
      }
      const contacts =
      this.setState({
        selectedContacts: [{
          name: contact.name,
          email: contact.email
        }].concat(this.state.selectedContacts)
      });
    };
  }

  render() {
    let contacts;
    if (this.props.searchFilter.length < 3) {
      contacts = [];
    } else {
      contacts = this.props.filteredContacts.slice(0, 10);
    }
    return (
      <Modal
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
        currentLocale="en-US"
        show={this.props.show}
        title="Create Team"
        textCancel="Close"
        textConfirm="Create"
      >
        <TextInput
          className={styles.teamName}
          value={this.state.teamName}
          onChange={this.updateTeamName}
          placeholder={'Team name'}
        />
        <SearchInput
          className={styles.searchInput}
          value={this.props.searchFilter}
          onChange={this.updateSeachString}
          placeholder={'Search and add people..'}
        />
        <div className={styles.selectedContacts}>
          {
            this.state.selectedContacts.map((contact) => (
              <span className={styles.selectedContactItem} key={contact.email}>
                {contact.name}
                <span className={styles.closeIcon} onClick={() => this.removeContact(contact.email)}>
                  x
                </span>
              </span>
            ))
          }
        </div>
        <div className={styles.contacts}>
          {
            contacts.map((contact) => (
              <div className={styles.contactItem} key={contact.email} onClick={() => this.addContact(contact)}>
                <div className={styles.contactName} title={contact.name}>{contact.name}</div>
                <div className={styles.contactEmail} title={contact.email}>{contact.email}</div>
              </div>
            ))
          }
        </div>
      </Modal>
    );
  }
}