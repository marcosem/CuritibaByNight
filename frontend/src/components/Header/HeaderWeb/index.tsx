import React, { useEffect, useCallback } from 'react';
import { FiPower, FiBell } from 'react-icons/fi';
import { useHistory, Link } from 'react-router-dom';

import { useAuth } from '../../../hooks/auth';
import { useSocket } from '../../../hooks/socket';

import imgLogoHeader from '../../../assets/logo_header.svg';
import imgProfile from '../../../assets/profile.jpg';

import Sidebar from '../../Sidebar';

import {
  Container,
  HeaderContent,
  NotificationButton,
  NotificationCount,
  LogoutButton,
  Navigation,
  Profile,
  ConnectionStatus,
} from './styles';

const HeaderWeb: React.FC = () => {
  const { signOut, user } = useAuth();
  const { isConnected, notifications, updateNotifications } = useSocket();
  const history = useHistory();

  const handleInfluenceActions = useCallback(() => {
    if (user.storyteller) {
      history.push('/actionsreview');
    } else {
      history.push('/actions');
    }
  }, [history, user.storyteller]);

  useEffect(() => {
    updateNotifications();
  }, [updateNotifications]);

  return (
    <Container>
      <HeaderContent>
        <Link to="/">
          <img src={imgLogoHeader} alt="Curitiba By Night" />
        </Link>

        <Profile isST={user.storyteller}>
          <Link to="/profile">
            <div>
              <span>Bem-vindo,</span>
              <strong>{user.name}</strong>
            </div>

            <img
              src={
                user.avatar_url || imgProfile
                // `https://api.adorable.io/avatars/56/${user.name}@adorable.png`
              }
              alt=""
            />
          </Link>
          <ConnectionStatus isConnected={isConnected} />
        </Profile>

        <NotificationButton
          type="button"
          onClick={notifications > 0 ? handleInfluenceActions : undefined}
          hasNotification={notifications > 0}
        >
          <FiBell />
          {notifications > 0 && (
            <NotificationCount>
              <span>{`${notifications > 99 ? '99' : notifications}`}</span>
            </NotificationCount>
          )}
        </NotificationButton>

        <LogoutButton type="button" onClick={signOut}>
          <FiPower />
        </LogoutButton>
      </HeaderContent>
      <Navigation>
        <Sidebar />
      </Navigation>
    </Container>
  );
};

export default HeaderWeb;
