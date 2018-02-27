import React from 'react';
import { connect } from 'react-redux';

import withPhone from 'ringcentral-widgets/lib/withPhone';

import ComposeTextIcon from 'ringcentral-widgets/assets/images/ComposeText.svg';
import ContactIcon from 'ringcentral-widgets/assets/images/Contact.svg';
import ComposeTextHoverIcon from 'ringcentral-widgets/assets/images/ComposeTextHover.svg';
import ContactHoverIcon from 'ringcentral-widgets/assets/images/ContactHover.svg';
import MoreMenuIcon from 'ringcentral-widgets/assets/images/MoreMenu.svg';
import MoreMenuHoverIcon from 'ringcentral-widgets/assets/images/MoreMenuHover.svg';

import SideBarView from '../../components/SideBarView';
import styles from './styles.scss';

const menus = [
  {
    name: 'Glip',
    path: '/glip',
    Icon: ComposeTextIcon,
    ActiveIcon: ComposeTextHoverIcon,
    isActive: currentPath => currentPath.indexOf('/glip') !== -1,
  },
  {
    name: 'Contacts',
    path: '/contacts',
    Icon: ContactIcon,
    ActiveIcon:
      props =>
        <ContactHoverIcon {...props} className={styles.contactHoverIcon} />,
    isActive: currentPath => currentPath.indexOf('/contacts') !== -1,
  }
];

const settingMenu = {
  name: 'Settings',
  path: '/settings',
  Icon: MoreMenuIcon,
  ActiveIcon: MoreMenuHoverIcon,
  isActive: currentPath => currentPath.indexOf('/settings') !== -1,
};

function mapToProps(_, {
  phone: {
    routerInteraction,
    glipPersons,
  },
}) {
  return {
    menus,
    settingMenu,
    me: glipPersons.me,
    currentPath: routerInteraction.currentPath,
  };
}
function mapToFunctions(_, {
  phone: {
    routerInteraction,
  }
}) {
  return {
    onSelectMenu: (menu) => {
      if (menu && menu.path) {
        routerInteraction.push(menu.path);
      }
    },
    onClickAvatar: () => {
      routerInteraction.push('/glip/persons/me');
    }
  };
}

const MainView = withPhone(connect(
  mapToProps,
  mapToFunctions
)(SideBarView));

export default MainView;
