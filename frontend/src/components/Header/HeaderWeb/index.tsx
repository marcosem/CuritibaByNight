import React, { useEffect, useCallback } from 'react';
import { FiPower, FiBell } from 'react-icons/fi';
import { useHistory, Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaDiscord, FaSpotify } from 'react-icons/fa';

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
  MyPages,
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

        <MyPages>
          <div>
            <a
              href="https://www.facebook.com/groups/283920641632885/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
              <span>Facebook</span>
            </a>
          </div>
          <div>
            <a
              href="https://discord.gg/fzfmJ2V"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDiscord />
              <span>Discord</span>
            </a>
          </div>
          <div>
            <a
              href="https://www.instagram.com/curitibabynight/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
              <span>Instagram</span>
            </a>
          </div>

          <div>
            <a
              href="https://open.spotify.com/playlist/0oaY20yvD69OtJ3rEftmGM?si=2HX7f7dOS7mhXpY3e8fHmg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaSpotify />
              <span>Spotify</span>
            </a>
          </div>
        </MyPages>

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
