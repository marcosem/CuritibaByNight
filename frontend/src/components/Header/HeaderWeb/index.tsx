import React, { useEffect, useCallback } from 'react';
import { FiPower, FiBell } from 'react-icons/fi';
import { useHistory, Link } from 'react-router-dom';
import {
  FaHome,
  FaFacebook,
  FaInstagram,
  FaDiscord,
  FaSpotify,
} from 'react-icons/fa';
import {
  GiDarkSquad,
  GiVampireDracula,
  GiMinions,
  GiPositionMarker,
  GiStoneTower,
  GiStabbedNote,
  GiSpikedHalo,
} from 'react-icons/gi';
import { useAuth } from '../../../hooks/auth';
import { useSocket } from '../../../hooks/socket';

import imgLogoHeader from '../../../assets/logo_header.svg';
import imgProfile from '../../../assets/profile.jpg';
import {
  Container,
  HeaderContent,
  NotificationButton,
  NotificationCount,
  LogoutButton,
  Navigation,
  NavSpan,
  Profile,
  ConnectionStatus,
  MyPages,
  ToolTip,
} from './styles';

interface IHeaderProps {
  page?: string;
}

const HeaderWeb: React.FC<IHeaderProps> = ({ page }) => {
  const { signOut, user } = useAuth();
  const { isConnected, notifications, updateNotifications } = useSocket();
  const history = useHistory();

  const handleInfluenceActionsReview = useCallback(() => {
    history.push('/actionsreview');
  }, [history]);

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
          onClick={notifications > 0 ? handleInfluenceActionsReview : undefined}
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
        <table>
          <tbody>
            <tr>
              <td>
                <ToolTip>Home</ToolTip>
                {page === 'dashboard' ? (
                  <NavSpan>
                    <FaHome />
                  </NavSpan>
                ) : (
                  <Link to="/dashboard">
                    <FaHome />
                  </Link>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <ToolTip>Locais Importantes</ToolTip>
                {page === 'locals' ? (
                  <NavSpan>
                    <GiPositionMarker />
                  </NavSpan>
                ) : (
                  <Link to="/locals">
                    <GiPositionMarker />
                  </Link>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <ToolTip>Influências</ToolTip>
                {page === 'influences' ? (
                  <NavSpan>
                    <GiStoneTower />
                  </NavSpan>
                ) : (
                  <Link to="/influences">
                    <GiStoneTower />
                  </Link>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <ToolTip>Regras</ToolTip>
                {page === 'rules' ? (
                  <NavSpan>
                    <GiStabbedNote />
                  </NavSpan>
                ) : (
                  <Link to="/rules">
                    <GiStabbedNote />
                  </Link>
                )}
              </td>
            </tr>

            {user.storyteller && (
              <>
                <tr>
                  <td>
                    <ToolTip>Jogadores</ToolTip>
                    {page === 'players' ? (
                      <NavSpan>
                        <GiDarkSquad />
                      </NavSpan>
                    ) : (
                      <Link to="/players">
                        <GiDarkSquad />
                      </Link>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <ToolTip>Personagens</ToolTip>
                    {page === 'characters' ? (
                      <NavSpan>
                        <GiVampireDracula />
                      </NavSpan>
                    ) : (
                      <Link to="/characters/pc">
                        <GiVampireDracula />
                      </Link>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <ToolTip>NPCs</ToolTip>
                    {page === 'npcs' ? (
                      <NavSpan>
                        <GiMinions />
                      </NavSpan>
                    ) : (
                      <Link to="/characters/npc">
                        <GiMinions />
                      </Link>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <ToolTip>Poderes</ToolTip>
                    {page === 'powers' ? (
                      <NavSpan>
                        <GiSpikedHalo />
                      </NavSpan>
                    ) : (
                      <Link to="/powers">
                        <GiSpikedHalo />
                      </Link>
                    )}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </Navigation>
    </Container>
  );
};

export default HeaderWeb;
