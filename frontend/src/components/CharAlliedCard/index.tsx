/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';
import { GiFangedSkull, GiCoffin, GiRun } from 'react-icons/gi';
import { FiClock, FiCamera } from 'react-icons/fi';
import { IconType } from 'react-icons';
import api from '../../services/api';
import cardRetainer from '../../assets/cards/card_retainer.png';
import cardAlly from '../../assets/cards/card_ally.png';
import cardST from '../../assets/cards/card_location.png';

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
  title: string;
  clan: string;
  creature_type: string;
  sect?: string;
  regnant: string;
  coterie?: string;
  updatedAt: string;
  situation?: string;
  npc?: boolean;
  locked?: boolean;
  readOnly?: boolean;
}

const CharAlliedCard: React.FC<ICharacterCardProps> = ({
  charId,
  name,
  experience,
  avatar,
  sheetFile,
  title,
  clan,
  creature_type,
  regnant,
  coterie = '',
  updatedAt,
  situation = 'active',
  npc = false,
  locked = false,
  readOnly = false,
}) => {
  const [cardImg, setCardImg] = useState<string>('');
  const [charImg, setCharImg] = useState<string>('');
  const [situationIcon, setSituationIcon] = useState<IconType | null>(null);
  const [situationTitle, setSituationTitle] = useState<string>('');
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();

  useEffect(() => {
    setCharImg(avatar || tempProfileImg);
  }, [avatar]);

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
        case 'archived':
          setSituationIcon(FiClock);
          setSituationTitle('Inativo');
          break;
        case 'transfered':
          setSituationIcon(GiRun);
          setSituationTitle('Transferido');
          break;
        default:
          setSituationIcon(null);
          setSituationTitle('');
      }
    }
  }, [situation]);

  useEffect(() => {
    if (clan.indexOf('Ghoul') >= 0 || clan.indexOf('Mortal') >= 0) {
      setCardImg(cardRetainer);
    } else if (clan.indexOf('Curitiba By Night') >= 0) {
      setCardImg(cardST);
    } else {
      setCardImg(cardAlly);
    }
  }, [clan]);

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
      <CardSquare clanImg={cardImg}>
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
            <>
              {clan.indexOf('Wraith') >= 0 ? (
                <strong>
                  <b>{`${clan}: `}</b>
                  {name}
                </strong>
              ) : (
                <strong>
                  <b>{title !== '' && `${title}: `}</b>
                  {name}
                </strong>
              )}
            </>
          ) : (
            <a
              href={sheetFile}
              target="_blank"
              rel="noopener noreferrer"
              title="Baixar Ficha"
            >
              {creature_type !== 'Mortal' ? (
                <>
                  <b>{`${creature_type}: `}</b>
                  <br />
                  {name}
                </>
              ) : (
                <>
                  <b>{title !== '' && `${title}: `}</b>
                  {name}
                </>
              )}
            </a>
          )}

          {creature_type !== 'Mortal' ? (
            <>
              {clan !== '' && <span>{clan}</span>}
              {regnant !== '' && <span>{`Ligado à ${regnant}`}</span>}
              {coterie !== '' && <span>{coterie}</span>}
            </>
          ) : (
            <>
              {regnant !== '' ? (
                <span>{`${clan} de ${regnant}`}</span>
              ) : (
                <>{clan && <span>{clan}</span>}</>
              )}
            </>
          )}
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

export default CharAlliedCard;
