import React, { useState, useEffect } from 'react';
import { FiPower, FiBell } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaDiscord, FaSpotify } from 'react-icons/fa';
import { useAuth } from '../../../hooks/auth';
import { useSocket } from '../../../hooks/socket';

import imgLogoHeader from '../../../assets/logo_header.svg';
import imgProfile from '../../../assets/profile.jpg';
import {
  Container,
  HeaderContent,
  LogoutButton,
  NotificationButton,
  NotificationCount,
  Navigation,
  Profile,
  ConnectionStatus,
  MyPages,
} from './styles';

import Sidebar from '../../Sidebar';

const HeaderMobile: React.FC = () => {
  const { signOut, user } = useAuth();
  const [firstName, setFirstName] = useState<string>();
  const { isConnected, notifications, updateNotifications } = useSocket();

  useEffect(() => {
    updateNotifications();
  }, [updateNotifications]);

  useEffect(() => {
    const userNames = user.name.split(' ');
    setFirstName(userNames[0]);
  }, [user]);

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
            <img
              src={
                user.avatar_url || imgProfile
                // `https://api.adorable.io/avatars/56/${user.name}@adorable.png`
              }
              alt={firstName}
            />
            <div>
              <strong>{firstName}</strong>
            </div>
          </Link>
          <ConnectionStatus isConnected={isConnected} />
        </Profile>

        <NotificationButton
          type="button"
          // onClick={signOut}
          hasNotification={notifications > 0}
        >
          <FiBell />
          {notifications > 0 && (
            <NotificationCount>
              <span>{notifications}</span>
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

export default HeaderMobile;
