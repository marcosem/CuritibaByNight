/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback } from 'react';
import { MdLocalAirport, MdStore, MdLocationOn } from 'react-icons/md';
import {
  GiHouse,
  GiCampingTent,
  GiCastle,
  GiGreekTemple,
  GiHaunting,
  GiFamilyHouse,
  GiBookshelf,
  GiGuardedTower,
} from 'react-icons/gi';
import { FiCamera } from 'react-icons/fi';
import { IconType } from 'react-icons';
import api from '../../services/api';
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
import { useImageCrop } from '../../hooks/imageCrop';

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
  creature_type: string;
  sect: string;
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
  creature_type,
  sect,
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
  const { showImageCrop, getImage, isImageSelected } = useImageCrop();
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
      case 'camp':
        setTypeIcon(GiCampingTent);
        setTypeTitle('Acampamento');
        break;
      case 'castle':
        setTypeIcon(GiCastle);
        setTypeTitle('Castelo');
        break;
      case 'haunt':
        setTypeIcon(GiHaunting);
        setTypeTitle('Local Assombrado');
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
      case 'creature': {
        if (responsibleName) {
          setPropertyTitle(
            `Propriedade dos ${creature_type}s sob os cuidados de ${responsibleName}`,
          );
        } else {
          setPropertyTitle(`Propriedade dos ${creature_type}s`);
        }
        break;
      }
      case 'sect': {
        if (responsibleName) {
          setPropertyTitle(
            `Propriedade ${sect} sob os cuidados de ${responsibleName}`,
          );
        } else {
          setPropertyTitle(`Propriedade ${sect}`);
        }
        break;
      }
      default: {
        setPropertyTitle('');
      }
    }
  }, [clan, creature_type, property, responsibleName, sect]);

  const handleImageChange = useCallback(async () => {
    if (!locked) showImageCrop(198, 172);
  }, [locked, showImageCrop]);

  const setNewImage = useCallback(
    async (newImage: File) => {
      try {
        const data = new FormData();

        data.append('locations', newImage);

        const response = await api.patch(
          `/locations/picture/${locationId}`,
          data,
        );

        const res = response.data;
        if (res.picture_url) {
          setLocationImg(res.picture_url);
        }

        addToast({
          type: 'success',
          title: 'Imagem Atualizada!',
          description: `Imagem da localização: '${name}' atualizada com sucesso!`,
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description: 'Erro ao atualizar a imagem da localização.',
        });
      }
    },
    [addToast, locationId, name],
  );

  useEffect(() => {
    if (isImageSelected) {
      const newImage = getImage();

      if (newImage) {
        setNewImage(newImage);
      }
    }
  }, [getImage, isImageSelected, setNewImage]);

  return (
    <Container isMobile={isMobileVersion} locked={locked}>
      <CardSquare cardImg={cardLocation}>
        <CardTitle textLength={description.length}>
          <span>{description}</span>
        </CardTitle>

        <label htmlFor={locationId}>
          <LocationImage
            locked={locked}
            onClick={!locked ? handleImageChange : undefined}
          >
            <img src={locationImg} alt="" />

            {/*! locked && (
              <input type="file" id={locationId} onChange={handleImageChange} />
            ) */}
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
