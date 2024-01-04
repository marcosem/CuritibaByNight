import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { FaHome, FaUser, FaMap } from 'react-icons/fa';
import {
  GiPositionMarker,
  GiSwordSpade,
  GiDarkSquad,
  GiVampireDracula,
  GiSpikedHalo,
  GiStoneTower,
  GiStabbedNote,
} from 'react-icons/gi';
import { FiFlag, FiMenu, FiChevronDown } from 'react-icons/fi';
import { IconType } from 'react-icons';

import { useAuth } from '../../hooks/auth';

import {
  SidebarWrapper,
  SidebarButton,
  SidebarHeader,
  // SidebarLogo,
  SidebarSubNav,
} from './styles';

interface ISubMenuItem {
  name: string;
  link: string;
  stOnly: boolean;
}

interface IMenuItem {
  name: string;
  Icon: IconType;
  link: string;
  stOnly: boolean;
  items?: ISubMenuItem[];
}

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [opened, setOpened] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>('');

  const menuItems: IMenuItem[] = [
    {
      name: 'Home',
      Icon: FaHome,
      link: '/dashboard',
      stOnly: false,
    },
    {
      name: 'Perfil',
      Icon: FaUser,
      link: '/profile',
      stOnly: false,
    },
    {
      name: 'Mapa',
      Icon: FaMap,
      link: '/locals',
      stOnly: false,
    },
    {
      name: 'Locais',
      Icon: GiPositionMarker,
      link: '',
      stOnly: false,
      items: [
        {
          name: 'Locais conhecidos',
          link: '',
          stOnly: false,
        },
        {
          name: 'Adicionar local',
          link: '/addlocal',
          stOnly: true,
        },
        {
          name: 'Editar local',
          link: '/updatelocal',
          stOnly: true,
        },
        {
          name: 'Definir conhecido',
          link: '/localchars',
          stOnly: true,
        },
      ],
    },
    {
      name: 'Territórios',
      link: '/territories',
      Icon: FiFlag,
      stOnly: true,
    },
    {
      name: 'Ações',
      Icon: GiSwordSpade,
      link: '',
      stOnly: false,
      items: [
        {
          name: 'Minhas ações',
          link: '/actions',
          stOnly: false,
        },
        {
          name: 'Revisar ações',
          link: '/actionsreview',
          stOnly: true,
        },
      ],
    },
    {
      name: 'Jogadores',
      Icon: GiDarkSquad,
      link: '/players',
      stOnly: true,
    },
    {
      name: 'Personagens',
      Icon: GiVampireDracula,
      link: '',
      stOnly: true,
      items: [
        {
          name: 'PCs',
          link: '/characters/pc',
          stOnly: true,
        },
        {
          name: 'NPCs',
          link: '/characters/npc',
          stOnly: true,
        },
      ],
    },
    {
      name: 'Poderes',
      Icon: GiSpikedHalo,
      link: '/powers',
      stOnly: true,
    },
    {
      name: 'Influências',
      Icon: GiStoneTower,
      link: '',
      stOnly: false,
      items: [
        {
          name: 'Descrições',
          link: '/influences',
          stOnly: false,
        },
        {
          name: 'Estatísticas',
          link: '/influences/stat',
          stOnly: true,
        },
      ],
    },
    {
      name: 'Regras',
      Icon: GiStabbedNote,
      link: '/rules',
      stOnly: false,
    },
  ];

  const handleClick = useCallback(
    (item: IMenuItem | ISubMenuItem) => {
      setActiveItem(item.name !== activeItem ? item.name : '');
      if (item.link !== '') {
        history.push(item.link);
      }
    },
    [activeItem, history],
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

  return (
    <SidebarWrapper>
      <SidebarHeader>
        <SidebarButton type="button" onClick={() => setOpened(!opened)}>
          <FiMenu />
        </SidebarButton>
        {activeItem !== 'Home' && <span>{activeItem}</span>}
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
