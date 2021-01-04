import React, { useState, useEffect } from 'react';
import { FiPower } from 'react-icons/fi';
import { Link } from 'react-router-dom';
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
} from 'react-icons/gi';
import { useAuth } from '../../hooks/auth';
import imgLogoHeader from '../../assets/logo_header.svg';
import imgProfile from '../../assets/profile.jpg';
import {
  Container,
  HeaderContent,
  Navigation,
  NavSpan,
  Profile,
  MyPages,
} from './styles';

interface HeaderProps {
  page?: string;
}

const HeaderMobile: React.FC<HeaderProps> = ({ page }) => {
  const { signOut, user } = useAuth();
  const [firstName, setFirstName] = useState<string>();

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
              href="https://discord.com/channels/708080543043944448/708080543618564099"
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
        </Profile>

        <button type="button" onClick={signOut}>
          <FiPower />
        </button>
      </HeaderContent>
      <Navigation>
        <table>
          <tbody>
            <tr>
              <td>
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
                {page === 'locals' ? (
                  <NavSpan>
                    <GiPositionMarker />
                    Locais
                  </NavSpan>
                ) : (
                  <Link to="/locals">
                    <GiPositionMarker />
                    Locais
                  </Link>
                )}
              </td>
            </tr>

            {user.storyteller && (
              <>
                <tr>
                  <td>
                    {page === 'players' ? (
                      <NavSpan>
                        <GiDarkSquad />
                        Jogadores
                      </NavSpan>
                    ) : (
                      <Link to="/players">
                        <GiDarkSquad />
                        Jogadores
                      </Link>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    {page === 'characters' ? (
                      <NavSpan>
                        <GiVampireDracula />
                        PCs
                      </NavSpan>
                    ) : (
                      <Link to="/characters/pc">
                        <GiVampireDracula />
                        PCs
                      </Link>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    {page === 'npcs' ? (
                      <NavSpan>
                        <GiMinions />
                        NPCs
                      </NavSpan>
                    ) : (
                      <Link to="/characters/npc">
                        <GiMinions />
                        NPCs
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

export default HeaderMobile;
