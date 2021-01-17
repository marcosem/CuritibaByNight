import React, { useEffect, useState, useCallback } from 'react';
import { MdLocalAirport, MdStore, MdLocationOn } from 'react-icons/md';
import {
  GiHouse,
  GiCastle,
  GiGreekTemple,
  GiFamilyHouse,
  GiBookshelf,
  GiGuardedTower,
} from 'react-icons/gi';

import { FiCamera } from 'react-icons/fi';
import { IconType } from 'react-icons';
import cardLocation from '../../assets/cards/card_location.png';
import imgBuilding from '../../assets/building.jpg';

import {
  Container,
  CardSquare,
  CardTitle,
  LocationImage,
  LocationInfo,
  LocationType,
  LocationElysium,
  LocationLevel,
} from './styles';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';

interface ILocationCardProps {
  locationId: string;
  name: string;
  description: string;
  address: string;
  elysium: boolean;
  type: string;
  property: string;
  responsibleId: string;
  responsibleName: string;
  clan: string;
  level: number;
  mysticalLevel: number;
  pictureUrl: string;
  locked?: boolean;
}

const LocationCard: React.FC<ILocationCardProps> = ({
  locationId,
  name,
  description,
  address,
  elysium = false,
  type = 'other',
  property = 'private',
  responsibleId,
  responsibleName,
  clan,
  level,
  mysticalLevel,
  pictureUrl,
  locked = false,
}) => {
  const [locationImg, setLocationImg] = useState<string>('');
  const [typeIcon, setTypeIcon] = useState<IconType | null>(null);
  const [typeTitle, setTypeTitle] = useState<string>('');
  const [propertyTitle, setPropertyTitle] = useState<string>('');
  const { user, char } = useAuth();
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();

  useEffect(() => {
    setLocationImg(pictureUrl || imgBuilding);
  }, [pictureUrl]);

  useEffect(() => {
    switch (type) {
      case 'haven':
        setTypeIcon(GiHouse);
        setTypeTitle('Refúgio');
        break;
      case 'airport':
        setTypeIcon(MdLocalAirport);
        setTypeTitle('Aeroporto');
        break;
      case 'castle':
        setTypeIcon(GiCastle);
        setTypeTitle('Castelo');
        break;
      case 'holding':
        setTypeIcon(GiGreekTemple);
        setTypeTitle('Propriedade');
        break;
      case 'mansion':
        setTypeIcon(GiFamilyHouse);
        setTypeTitle('Mansão');
        break;
      case 'nightclub':
        setTypeIcon(MdStore);
        setTypeTitle('Clube Noturno');
        break;
      case 'university':
        setTypeIcon(GiBookshelf);
        setTypeTitle('Universidade');
        break;
      case 'other':
      default:
        setTypeIcon(MdLocationOn);
        setTypeTitle('Outro');
        break;
    }
  }, [type]);

  useEffect(() => {
    switch (property) {
      case 'public':
        if (responsibleName) {
          setPropertyTitle(`Localização Pública de ${responsibleName}`);
        } else {
          setPropertyTitle('Localização Pública');
        }
        break;
      case 'private': {
        if (responsibleName) {
          setPropertyTitle(`Propriedade Privada de ${responsibleName}`);
        } else {
          setPropertyTitle('Propriedade Privada');
        }
        break;
      }
      case 'clan': {
        if (responsibleName) {
          setPropertyTitle(
            `Refúgio do clã ${clan} sob os cuidados de ${responsibleName}`,
          );
        } else {
          setPropertyTitle(`Refúgio do clã ${clan}`);
        }
        break;
      }
      default: {
        setPropertyTitle('');
      }
    }
  }, [clan, property, responsibleName]);

  /*
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
  */

  const handleImageChange = useCallback(
    async (/* e: ChangeEvent<HTMLInputElement> */) => {
      addToast({
        type: 'error',
        title: 'Erro na atualização',
        description: 'Erro ao atualizar a imagem da localização.',
      });
    },
    [addToast],
  );

  return (
    <Container isMobile={isMobileVersion} locked={locked}>
      <CardSquare cardImg={cardLocation}>
        <CardTitle textLength={description.length}>
          <span>{description}</span>
        </CardTitle>

        <label htmlFor={locationId}>
          <LocationImage locked={locked}>
            <img src={locationImg} alt="" />

            {!locked && (
              <input type="file" id={locationId} onChange={handleImageChange} />
            )}
            <FiCamera />
            <span>Trocar Imagem</span>
          </LocationImage>
        </label>
        <LocationInfo>
          <strong>{name}</strong>
          <span>{address}</span>
          {(user.storyteller ||
            char.id === responsibleId ||
            char.clan === clan) &&
            mysticalLevel > 0 && (
              <span>{`Nível Místico: ${mysticalLevel}`}</span>
            )}
          <small>{propertyTitle}</small>
        </LocationInfo>
        <LocationType title={typeTitle}>{typeIcon}</LocationType>
        {elysium && (
          <LocationElysium title="Elysium">
            <GiGuardedTower />
          </LocationElysium>
        )}
        {(user.storyteller ||
          char.id === responsibleId ||
          char.clan === clan) && (
          <LocationLevel>
            <span>{level}</span>
          </LocationLevel>
        )}
      </CardSquare>
    </Container>
  );
};

export default LocationCard;
