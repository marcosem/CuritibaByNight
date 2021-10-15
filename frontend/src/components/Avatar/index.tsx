/* eslint-disable camelcase */
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IUser, useAuth } from '../../hooks/auth';

import imgProfile from '../../assets/profile.jpg';

import {
  Container,
  AvatarImg,
  Tooltip,
  TooltipWrapper,
  TooltipAvatar,
  TooltipData,
  TooltipDataTitle,
  TooltipDataEmail,
  TooltipDataStoryteller,
} from './styles';

interface IAvatarUser {
  avatarUser: IUser;
}

const Avatar: React.FC<IAvatarUser> = ({ avatarUser }) => {
  const [tooltipOn, setTooltipOn] = useState<boolean>(false);
  const { user } = useAuth();

  const ShowTooltip = useCallback((show: boolean) => {
    setTooltipOn(show);
  }, []);

  return (
    <Container>
      <Link
        to={
          user.id === avatarUser.id
            ? '/profile'
            : `/updateplayer/${avatarUser.id}`
        }
        title="Editar Pefil"
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
            </TooltipData>
          </TooltipWrapper>
        </Tooltip>
      </Link>
    </Container>
  );
};

export default Avatar;
