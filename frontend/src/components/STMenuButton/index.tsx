import React from 'react';
import { FiMenu } from 'react-icons/fi';
import { GiDarkSquad, GiVampireDracula, GiMinions } from 'react-icons/gi';
import { Container, MenuList } from './styles';

interface MenuButtonProps {
  isMobile: boolean;
}

const STMenuButton: React.FC<MenuButtonProps> = ({ isMobile }) => {
  return (
    <Container isMobile={isMobile}>
      <FiMenu />
      <MenuList>
        <ul>
          <li>
            <a href="#players">
              <GiDarkSquad />
              Jogadores
            </a>
          </li>
          <li>
            <a href="#characters">
              <GiVampireDracula />
              Personagens
            </a>
          </li>
          <li>
            <a href="#books">
              <GiMinions />
              NPCs
            </a>
          </li>
        </ul>
      </MenuList>
    </Container>
  );
};

export default STMenuButton;
