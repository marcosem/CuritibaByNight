import React from 'react';
import { Link } from 'react-router-dom';

import { Container, HeaderTitle, Division } from './styles';

import imgLogoHeader from '../../../assets/logo_header.svg';

import Avatar from '../../Avatar';

import { useAuth } from '../../../hooks/auth';

interface IHeaderProps {
  page?: string;
}

const HeaderWeb: React.FC<IHeaderProps> = ({ page }) => {
  const { user } = useAuth();

  return (
    <Container>
      <HeaderTitle>
        <Link to="/">
          <img src={imgLogoHeader} alt="Curitiba By Night" />
          <Division />
          <span>Curitiba By Night</span>
        </Link>
      </HeaderTitle>
      <Avatar avatarUser={user} />
    </Container>
  );
};

export default HeaderWeb;
