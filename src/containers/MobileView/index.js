import React from 'react';
import { connect } from 'react-redux';

import withPhone from 'ringcentral-widgets/lib/withPhone';

import TabNavigationView from 'ringcentral-widgets/components/TabNavigationView';

import ComposeTextIcon from 'ringcentral-widgets/assets/images/ComposeText.svg';
import SettingsIcon from 'ringcentral-widgets/assets/images/Settings.svg';
import ContactIcon from 'ringcentral-widgets/assets/images/Contact.svg';

import SettingsHoverIcon from 'ringcentral-widgets/assets/images/SettingsHover.svg';
import ContactHoverIcon from 'ringcentral-widgets/assets/images/ContactHover.svg';
import ComposeTextHoverIcon from 'ringcentral-widgets/assets/images/ComposeTextHover.svg';

const TABS = [
  {
    name: 'Glip',
    path: '/glip',
    icon: ComposeTextIcon,
    activeIcon: ComposeTextHoverIcon,
    isActive: currentPath => currentPath.indexOf('/glip') !== -1,
  },
  {
    icon: ContactIcon,
    activeIcon: ContactHoverIcon,
    label: 'Contacts',
    path: '/contacts',
    isActive: currentPath => (
      currentPath.substr(0, 9) === '/contacts'
    ),
  },
  {
    icon: SettingsIcon,
    activeIcon: SettingsHoverIcon,
    label: 'Settings',
    path: '/settings',
    isActive: (currentPath) => (
      currentPath === '/settings'
    )
  },
];

function mapToProps(_, {
  phone: {
    routerInteraction,
  },
}) {
  const tabs = TABS;
  return {
    tabs,
    currentPath: routerInteraction.currentPath,
  };
}
function mapToFunctions(_, {
  phone: {
    routerInteraction,
  }
}) {
  return {
    goTo: (path) => {
      if (path) {
        routerInteraction.push(path);
      }
    },
  };
}

const MobileView = withPhone(connect(
  mapToProps,
  mapToFunctions
)(TabNavigationView));

export default MobileView;
