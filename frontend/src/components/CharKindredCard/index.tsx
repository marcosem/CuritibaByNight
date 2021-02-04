import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';
import { GiFangedSkull, GiCoffin } from 'react-icons/gi';
import { FiClock, FiCamera } from 'react-icons/fi';
import { IconType } from 'react-icons';
import api from '../../services/api';
import getCardImg from './getCardImg';

import {
  Container,
  CardSquare,
  ProfileImage,
  CharInfo,
  CharSituation,
  CharXPTitle,
  CharXP,
} from './styles';
import tempProfileImg from '../../assets/avatar_placehold.png';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';

interface ICharacterCardProps {
  charId: string;
  name: string;
  experience: string;
  avatar: string;
  sheetFile: string;
  clan: string;
  title: string;
  coterie: string;
  updatedAt: string;
  situation?: string;
  npc?: boolean;
  locked?: boolean;
  readOnly?: boolean;
}

const CharKindredCard: React.FC<ICharacterCardProps> = ({
  charId,
  name,
  experience,
  avatar,
  sheetFile,
  clan,
  title,
  coterie,
  updatedAt,
  situation = 'active',
  npc = false,
  locked = false,
  readOnly = false,
}) => {
  const [charImg, setCharImg] = useState<string>('');
  const [clanImg, setClanImg] = useState<string>('');
  const [situationIcon, setSituationIcon] = useState<IconType | null>(null);
  const [situationTitle, setSituationTitle] = useState<string>('');
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();

  useEffect(() => {
    setCharImg(avatar || tempProfileImg);
  }, [avatar]);

  useEffect(() => {
    setClanImg(getCardImg(clan));
  }, [clan]);

  useEffect(() => {
    if (situation !== 'active') {
      switch (situation) {
        case 'dead':
        case 'destroyed':
          setSituationIcon(GiFangedSkull);
          setSituationTitle('Destruído');
          break;
        case 'torpor':
          setSituationIcon(GiCoffin);
          setSituationTitle('Em Torpor');
          break;
        case 'inactive':
          setSituationIcon(FiClock);
          setSituationTitle('Inativo');
          break;
        default:
          setSituationIcon(null);
      }
    }
  }, [situation]);

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
    <Container isMobile={isMobileVersion}>
      <CardSquare clanImg={clanImg}>
        <span>{updatedAt}</span>
        <label htmlFor={charId === '' ? 'Empty' : charId}>
          <ProfileImage locked={locked}>
            <img src={charImg} alt="" />

            {!locked && (
              <input
                type="file"
                id={charId === '' ? 'Empty' : charId}
                onChange={handleAvatarChange}
              />
            )}
            <FiCamera />
            <span>Trocar Foto</span>
          </ProfileImage>
        </label>
        <CharInfo>
          {readOnly ? (
            <strong>
              <b>{title !== '' && `${title}: `}</b>
              {name}
            </strong>
          ) : (
            <a
              href={sheetFile}
              target="_blank"
              rel="noopener noreferrer"
              title="Baixar Ficha"
            >
              <b>{title !== '' && `${title}: `}</b>
              {name}
            </a>
          )}

          <span>{coterie !== '' && `${coterie}`}</span>
        </CharInfo>

        {situation !== 'active' && (
          <CharSituation title={situationTitle}>{situationIcon}</CharSituation>
        )}

        {npc ? (
          <CharXP>
            <span>NPC</span>
          </CharXP>
        ) : (
          <>
            {readOnly ? (
              <CharXP>
                <GiFangedSkull />
              </CharXP>
            ) : (
              <>
                <CharXPTitle>
                  <span>XP:</span>
                </CharXPTitle>
                <CharXP>
                  <span>{experience}</span>
                </CharXP>
              </>
            )}
          </>
        )}
      </CardSquare>
    </Container>
  );
};

export default CharKindredCard;
