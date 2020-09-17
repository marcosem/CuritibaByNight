import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';
// import React, { useCallback, MouseEvent } from 'react';
// import html2canvas from 'html2canvas';
import api from '../../services/api';
import getCardImg from './getCardImg';

import {
  Container,
  CardSquare,
  ProfileImage,
  CharInfo,
  CharXPTitle,
  CharXP,
} from './styles';
import tempProfileImg from '../../assets/sign-up-background.png';
import { useToast } from '../../hooks/toast';

interface ICharacterCardProps {
  charId: string;
  name: string;
  experience: string;
  avatar: string;
  sheetFile: string;
  clan: string;
  updatedAt: string;
  isMobile: boolean;
  locked?: boolean;
}

const CharacterCard: React.FC<ICharacterCardProps> = ({
  charId,
  name,
  experience,
  avatar,
  sheetFile,
  clan,
  updatedAt,
  isMobile,
  locked = false,
}) => {
  const [charImg, setCharImg] = useState<string>('');
  const [clanImg, setClanImg] = useState<string>('');
  const { addToast } = useToast();

  useEffect(() => {
    setCharImg(avatar || tempProfileImg);
  }, [avatar]);

  useEffect(() => {
    setClanImg(getCardImg(clan));
  }, [clan]);

  /*
  const saveCard = useCallback((e: MouseEvent<HTMLDivElement>) => {
    html2canvas(e.currentTarget).then(canvas => {
      const data = canvas.toDataURL('image/jpeg', 1);
      window.open(data, '_blank');
    });
  }, []);
*/

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        try {
          const data = new FormData();

          data.append('avatar', e.target.files[0]);

          const response = await api.patch(`/character/avatar/${charId}`, data);

          const res = response.data;
          if (res.avatar_url) {
            setCharImg(res.avatar_url);
          }

          addToast({
            type: 'success',
            title: 'Avatar Atualizado!',
            description: `Avatar do personagem '${name}' atualizado com sucesso!`,
          });
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Erro na atualização',
            description: 'Erro ao atualizar o avatar do personagem.',
          });
        }
      }
    },
    [addToast, charId, name],
  );

  return (
    <Container isMobile={isMobile}>
      <CardSquare clanImg={clanImg}>
        <span>{updatedAt}</span>
        <label htmlFor={charId}>
          <ProfileImage locked={locked}>
            <img src={charImg} alt="" />
            {!locked && (
              <input type="file" id={charId} onChange={handleAvatarChange} />
            )}
          </ProfileImage>
        </label>
        <CharInfo>
          <a href={sheetFile} target="_blank" rel="noopener noreferrer">
            {name}
          </a>
        </CharInfo>
        <CharXPTitle>
          <span>XP:</span>
        </CharXPTitle>
        <CharXP>
          <span>{experience}</span>
        </CharXP>
      </CardSquare>
    </Container>
  );
};

export default CharacterCard;
