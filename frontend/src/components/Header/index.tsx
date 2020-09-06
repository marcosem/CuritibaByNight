import React from 'react';
import { FiPower } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaDiscord } from 'react-icons/fa';
import { useAuth } from '../../hooks/auth';

import imgLogoHeader from '../../assets/logo_header.svg';
import { Container, HeaderContent, Profile, MyPages } from './styles';

const Header: React.FC = () => {
  const { signOut, user } = useAuth();

  return (
    <Container>
      <HeaderContent>
        <img src={imgLogoHeader} alt="Curitiba By Night" />
        <Profile isST={user.storyteller}>
          <img
            src={
              user.avatar_url ||
              `https://api.adorable.io/avatars/56/${user.name}@adorable.png`
            }
            alt={user.name}
          />
          <div>
            <span>Bem-vindo,</span>
            <Link to="/profile">
              <strong>{user.name}</strong>
            </Link>
          </div>
        </Profile>

        <MyPages>
          <div>
            <a
              href="https://www.facebook.com/groups/283920641632885/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
          </div>
          <div>
            <a
              href="https://discord.com/channels/708080543043944448/708080543618564099"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDiscord />
            </a>
          </div>
          <div>
            <a
              href="https://www.instagram.com/curitibabynight/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
          </div>
        </MyPages>

        <button type="button" onClick={signOut}>
          <FiPower />
        </button>
      </HeaderContent>
    </Container>
  );
};

export default Header;