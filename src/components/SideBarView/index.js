import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.scss';

import SideView from '../SideView';

export default function SideBarView({
  className,
  children,
  menus,
  settingMenu,
  currentPath,
  me,
  onSelectMenu,
  onClickAvatar,
}) {
  let SettingIcon = settingMenu.Icon;
  if (settingMenu.isActive(currentPath)) {
    SettingIcon = settingMenu.ActiveIcon;
  }
  return (
    <SideView
      smallSide
      className={className}
      side={
        <div className={styles.side}>
          <div className={styles.avatar} onClick={onClickAvatar}>
            <img src={me.avatar} alt={'me'} />
          </div>
          <div className={styles.menus}>
            {menus.map((menu) => {
              const isActive = menu.isActive(currentPath);
              let Icon = menu.Icon;
              if (isActive) {
                Icon = menu.ActiveIcon;
              }
              return (
                <div
                  key={menu.name}
                  className={classnames(styles.iconHolder, isActive ? styles.active : null)}
                >
                  <Icon
                    width={29}
                    height={30}
                    onClick={() => onSelectMenu(menu)}
                    title={menu.name}
                  />
                </div>
              );
            })}
          </div>
          <div className={styles.setting}>
            <SettingIcon
              width={29}
              height={30}
              onClick={() => onSelectMenu(settingMenu)}
              title={settingMenu.name}
            />
          </div>
        </div>
      }
    >
      {children}
    </SideView>
  );
}

SideBarView.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  menus: PropTypes.array,
  settingMenu: PropTypes.object.isRequired,
  currentPath: PropTypes.string,
  me: PropTypes.object,
  onSelectMenu: PropTypes.func.isRequired,
  onClickAvatar: PropTypes.func.isRequired,
};

SideBarView.defaultProps = {
  className: undefined,
  children: undefined,
  menus: [],
  currentPath: undefined,
  me: {},
};
