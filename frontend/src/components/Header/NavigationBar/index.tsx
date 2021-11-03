import React, { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth';

import { Container, NavWrapper, NavOption } from './styles';

interface INavigationBarProps {
  page?: string;
}

const NavigationBar: React.FC<INavigationBarProps> = ({ page }) => {
  const { user } = useAuth();

  return (
    <Container>
      <nav>
        <NavWrapper items={user.storyteller ? 6 : 3}>
          <NavOption selected={page === 'dashboard'}>
            {page === 'dashboard' ? (
              <span>Home</span>
            ) : (
              <Link to="dashboard">Home</Link>
            )}
          </NavOption>
          <NavOption>
            <span>Locais</span>
          </NavOption>
          <NavOption>
            <span>Regras</span>
          </NavOption>
          {user.storyteller && (
            <>
              <NavOption>
                <span>Estatísticas</span>
              </NavOption>
              <NavOption selected={page === 'players'}>
                {page === 'players' ? (
                  <span>Jogadores</span>
                ) : (
                  <Link to="players">Jogadores</Link>
                )}
              </NavOption>
              <NavOption>
                <span>Personagens</span>
              </NavOption>
            </>
          )}
        </NavWrapper>
      </nav>
    </Container>
  );
};

export default NavigationBar;
