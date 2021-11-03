import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IUser, useAuth } from '../../hooks/auth';

import imgProfile from '../../assets/profile.jpg';

import {
  Container,
  AvatarWrapper,
  AvatarImg,
  Tooltip,
  TooltipWrapper,
  TooltipAvatar,
  TooltipData,
  TooltipDataTitle,
  TooltipDataEmail,
  TooltipDataStoryteller,
  FunctionWrapper,
} from './styles';

interface IAvatarUser {
  avatarUser: IUser;
}

const Avatar: React.FC<IAvatarUser> = ({ avatarUser }) => {
  const [tooltipOn, setTooltipOn] = useState<boolean>(false);
  const { signOut, user } = useAuth();

  const ShowTooltip = useCallback((show: boolean) => {
    setTooltipOn(show);
  }, []);

  return (
    <Container>
      <AvatarWrapper
        title={avatarUser.name}
        onMouseOver={() => ShowTooltip(true)}
        onFocus={() => ShowTooltip(true)}
        onMouseOut={() => ShowTooltip(false)}
        onBlur={() => ShowTooltip(false)}
      >
        <AvatarImg
          src={avatarUser.avatar_url || imgProfile}
          alt={avatarUser.name}
          storyteller
        />
        <Tooltip aria-hidden={!tooltipOn} visible={tooltipOn}>
          <TooltipWrapper>
            <TooltipAvatar
              src={avatarUser.avatar_url || imgProfile}
              alt={avatarUser.name}
              storyteller
            />
            <TooltipData>
              <TooltipDataTitle>{avatarUser.name}</TooltipDataTitle>
              <TooltipDataEmail>{avatarUser.email}</TooltipDataEmail>
              <TooltipDataStoryteller>
                {avatarUser.storyteller ? 'Narrador' : 'Jogador'}
              </TooltipDataStoryteller>
              <FunctionWrapper>
                <Link
                  to={
                    user.id === avatarUser.id
                      ? '/profile'
                      : `/updateplayer/${avatarUser.id}`
                  }
                  title="Editar Perfil"
                >
                  <span>Editar Perfil</span>
                </Link>
                <button type="button" onClick={signOut} title="Logout">
                  <span>Logout</span>
                </button>
              </FunctionWrapper>
            </TooltipData>
          </TooltipWrapper>
        </Tooltip>
      </AvatarWrapper>
    </Container>
  );
};

export default Avatar;
