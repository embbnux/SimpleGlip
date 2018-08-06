import RcModule from 'ringcentral-integration/lib/RcModule';
import { Module } from 'ringcentral-integration/lib/di';
import { addPhoneToContact } from 'ringcentral-integration/lib/contactHelper';
import getter from 'ringcentral-integration/lib/getter';
import { createSelector } from 'reselect';

import actionTypes from './actionTypes';
import getReducer from './getReducer';

@Module({
  deps: [
    'AccountExtension',
    'GlipPersons',
    'AccountPhoneNumber',
    { dep: 'GlipContactsOptions', optional: true }
  ]
})
export default class GlipContacts extends RcModule {
  constructor({
    accountExtension,
    glipPersons,
    accountPhoneNumber,
    ...options,
  }) {
    super({
      ...options,
      actionTypes,
    });
    this._accountExtension = accountExtension;
    this._glipPersons = glipPersons;
    this._accountPhoneNumber = accountPhoneNumber;

    this._reducer = getReducer(this.actionTypes);
  }

  @getter
  contacts = createSelector(
    () => this._accountExtension.availableExtensions,
    () => this._accountPhoneNumber.extensionToPhoneNumberMap,
    () => this._glipPersons.personsMap,
    (extensions, extensionToPhoneNumberMap, personsMap) => {
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
        const contact = {
          id: `${extension.id}`,
          name: extension.name,
          extensionNumber: extension.ext,
          phoneNumbers: [{ phoneNumber: extension.ext, phoneType: 'extension' }],
          emails: extension.contact ? [extension.contact.email] : [],
          ...extension.contact,
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

        const phones = extensionToPhoneNumberMap[contact.extensionNumber];
        if (phones && phones.length > 0) {
          phones.forEach((phone) => {
            addPhoneToContact(contact, phone.phoneNumber, 'directPhone');
          });
        }

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
      this._accountExtension.ready &&
      this._glipPersons.ready &&
      this.pending
    );
  }

  _shouldReset() {
    return (
      (
        !this._accountExtension.ready ||
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
