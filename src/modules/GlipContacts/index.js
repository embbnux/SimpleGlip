import RcModule from 'ringcentral-integration/lib/RcModule';
import { Module } from 'ringcentral-integration/lib/di';
import getter from 'ringcentral-integration/lib/getter';
import { createSelector } from 'reselect';

import actionTypes from './actionTypes';
import getReducer from './getReducer';

@Module({
  deps: [
    'AccountDirectory',
    'GlipPersons',
    { dep: 'GlipContactsOptions', optional: true }
  ]
})
export default class GlipContacts extends RcModule {
  constructor({
    accountDirectory,
    glipPersons,
    ...options
  }) {
    super({
      ...options,
      actionTypes,
    });
    this._accountDirectory = accountDirectory;
    this._glipPersons = glipPersons;

    this._reducer = getReducer(this.actionTypes);
  }

  @getter
  contacts = createSelector(
    () => this._accountDirectory.availableExtensions,
    () => this._glipPersons.personsMap,
    (extensions, personsMap) => {
      const newContacts = [];
      const personsMapTemp = { ...personsMap };
      extensions.forEach((extension) => {
        if (!(extension.status === 'Enabled' &&
          ['DigitalUser', 'User', 'Department'].indexOf(extension.type) >= 0)) {
          return;
        }
        const glipPerson = personsMapTemp[extension.id];
        if (glipPerson) {
          delete personsMapTemp[extension.id];
        }
        let name = extension.name;
        if (!name) {
          name = `${extension.firstName || '' } ${extension.lastName || '' }`
        }
        const contact = {
          id: `${extension.id}`,
          name,
          extensionNumber: extension.extensionNumber,
          phoneNumbers: [{ phoneNumber: extension.extensionNumber, phoneType: 'extension' }],
          emails: extension.contact ? [extension.contact.email] : [],
          ...glipPerson,
          type: this.sourceName,
          profileImageUrl: glipPerson && glipPerson.avatar,
        };
        newContacts.push(contact);
      });
      Object.keys(personsMapTemp).forEach((key) => {
        const person = personsMapTemp[key];
        const contact = {
          ...person,
          name: `${person.firstName || ''} ${person.lastName || ''}`,
          emails: person.email ? [person.email] : [],
          phoneNumbers: [],
          type: this.sourceName,
          profileImageUrl: person.avatar,
        };
        newContacts.push(contact);
      });
      return newContacts;
    }
  )

  _onStateChange() {
    if (this._shouldInit()) {
      this.store.dispatch({
        type: this.actionTypes.initSuccess,
      });
    } else if (this._shouldReset()) {
      this.store.dispatch({
        type: this.actionTypes.resetSuccess,
      });
    }
  }

  _shouldInit() {
    return (
      this._accountDirectory.ready &&
      this._glipPersons.ready &&
      this.pending
    );
  }

  _shouldReset() {
    return (
      (
        !this._accountDirectory.ready ||
        !this._glipPersons.ready
      ) &&
      this.ready
    );
  }

  get status() {
    return this.state.status;
  }

  get sourceName() {
    return 'Glip';
  }

  get sourceReady() {
    return this.ready;
  }
}
