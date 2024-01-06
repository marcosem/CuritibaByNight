import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { FiMenu, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../hooks/auth';
import { ISubMenuItem, IMenuItem, menuItems } from './menuItems';
import { useMobile } from '../../hooks/mobile';

import {
  SidebarWrapper,
  SidebarButton,
  SidebarHeader,
  SidebarSubNav,
} from './styles';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const { isMobileVersion } = useMobile();
  const [opened, setOpened] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>('');

  const handleClick = useCallback(
    (item: IMenuItem | ISubMenuItem) => {
      setActiveItem(item.name !== activeItem ? item.name : '');
      if (item.link !== '') {
        history.push(item.link);

        if (isMobileVersion) {
          setOpened(false);
        }
      }
    },
    [activeItem, history, isMobileVersion],
  );

  const isSubNavOpen = useCallback(
    item => {
      return (
        item.items.some((i: ISubMenuItem) => i.name === activeItem) ||
        item.name === activeItem
      );
    },
    [activeItem],
  );

  const handleOpenMenu = useCallback(open => {
    if (!open) {
      setActiveItem('');
    }

    setOpened(open);
  }, []);

  return (
    <SidebarWrapper>
      <SidebarHeader>
        <SidebarButton
          type="button"
          onClick={() => handleOpenMenu(!opened)}
          isMobile={isMobileVersion}
        >
          <FiMenu />
        </SidebarButton>
      </SidebarHeader>
      {opened &&
        menuItems
          .filter(item => !item.stOnly || (item.stOnly && user.storyteller))
          .map(item => (
            <div key={item.name}>
              <>
                <SidebarButton
                  type="button"
                  onClick={() => handleClick(item)}
                  className={activeItem === item.name ? 'active' : ''}
                  isMobile={isMobileVersion}
                >
                  <item.Icon />
                  <span>{item.name}</span>
                  {item.items && <FiChevronDown />}
                </SidebarButton>

                {item.items && (
                  <SidebarSubNav
                    style={{
                      height: isSubNavOpen(item)
                        ? `${
                            item.items.filter(
                              subItem =>
                                !subItem.stOnly ||
                                (subItem.stOnly && user.storyteller),
                            ).length *
                              39 +
                            8
                          }px`
                        : 0,
                    }}
                  >
                    <div>
                      {item.items
                        .filter(
                          subItem =>
                            !subItem.stOnly ||
                            (subItem.stOnly && user.storyteller),
                        )
                        .map(subItem => (
                          <SidebarButton
                            type="button"
                            onClick={() => handleClick(subItem)}
                            className={
                              activeItem === subItem.name ? 'active' : ''
                            }
                            isMobile={isMobileVersion}
                            key={subItem.name}
                          >
                            <span>{subItem.name}</span>
                          </SidebarButton>
                        ))}
                    </div>
                  </SidebarSubNav>
                )}
              </>
            </div>
          ))}
    </SidebarWrapper>
  );
};

export default Sidebar;
