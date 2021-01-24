import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';
import { GiFangedSkull, GiCoffin } from 'react-icons/gi';
import { FiClock, FiCamera } from 'react-icons/fi';
import { IconType } from 'react-icons';
import api from '../../services/api';
import ICharacter from '../CharacterList/ICharacter';
import cardRetainer from '../../assets/cards/card_retainer.png';

import {
  Container,
  CardSquare,
  ProfileImage,
  CharInfo,
  CharSituation,
  CharXPTitle,
  CharXP,
} from './styles';
import tempProfileImg from '../../assets/sign-up-background.png';
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
  regnant: string;
  updatedAt: string;
  situation?: string;
  npc?: boolean;
  locked?: boolean;
}

const CharRetainerCard: React.FC<ICharacterCardProps> = ({
  charId,
  name,
  experience,
  avatar,
  sheetFile,
  title,
  clan,
  regnant,
  updatedAt,
  situation = 'active',
  npc = false,
  locked = false,
}) => {
  const [charImg, setCharImg] = useState<string>('');
  const [regnantName, setRegnantName] = useState<string>('');
  const [situationIcon, setSituationIcon] = useState<IconType | null>(null);
  const [situationTitle, setSituationTitle] = useState<string>('');
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();

  const getRenantName = useCallback(async () => {
    if (regnant === '' || regnant === null) {
      setRegnantName('');
      return;
    }

    try {
      await api.get(`/character/${regnant}`).then(response => {
        const res = response.data;
        const char: ICharacter = res;

        const regName = char.name;
        setRegnantName(regName);
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao carregar Regente',
        description: 'Erro ao carregar regente do mortal.',
      });
    }
  }, [addToast, regnant]);

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
          setSituationIcon(FiClock);
          setSituationTitle('Inativo');
          break;
        default:
          setSituationIcon(GiFangedSkull);
          setSituationTitle('Destruído');
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

  useEffect(() => {
    getRenantName();
  }, [getRenantName]);

  return (
    <Container isMobile={isMobileVersion}>
      <CardSquare clanImg={cardRetainer}>
        <span>{updatedAt}</span>
        <label htmlFor={charId}>
          <ProfileImage locked={locked}>
            <img src={charImg} alt="" />

            {!locked && (
              <input type="file" id={charId} onChange={handleAvatarChange} />
            )}
            <FiCamera />
            <span>Trocar Foto</span>
          </ProfileImage>
        </label>
        <CharInfo>
          <a href={sheetFile} target="_blank" rel="noopener noreferrer">
            <b>{title !== '' && `${title}: `}</b>
            {name}
          </a>
          {regnantName !== '' && <span>{`${clan} de ${regnantName}`}</span>}
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
            <CharXPTitle>
              <span>XP:</span>
            </CharXPTitle>
            <CharXP>
              <span>{experience}</span>
            </CharXP>
          </>
        )}
      </CardSquare>
    </Container>
  );
};

export default CharRetainerCard;
