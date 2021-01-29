/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiUserPlus } from 'react-icons/fi';
import { Map, TileLayer, Marker, Tooltip } from 'react-leaflet';
import Leaflet from 'leaflet';

import { MdLocalAirport, MdStore, MdLocationOn } from 'react-icons/md';
import {
  GiHouse,
  GiCampingTent,
  GiCastle,
  GiGreekTemple,
  GiFamilyHouse,
  GiBookshelf,
  GiGuardedTower,
} from 'react-icons/gi';
import api from '../../services/api';

import {
  Container,
  Content,
  TitleBox,
  Select,
  LocationLegend,
  FunctionsContainer,
} from './styles';
import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import Loading from '../../components/Loading';
import 'leaflet/dist/leaflet.css';
import imgBuilding from '../../assets/building.jpg';
import LocationCard from '../../components/LocationCard';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';

import mapMakerIcon from '../../assets/mapMakerIcon.svg';

interface IRouteParams {
  local: string;
}

interface IResponsible {
  name: string;
}

interface ILocation {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  elysium: boolean;
  type: string;
  property: string;
  responsible: string;
  responsible_char: IResponsible;
  clan: string;
  level: number;
  mystical_level: number;
  picture_url: string;
  icon: Leaflet.Icon<Leaflet.IconOptions>;
}

interface ICharacter {
  id: string | undefined;
  name: string;
  situation: string;
}

const Locals: React.FC = () => {
  const { local } = useParams<IRouteParams>();
  const [coordLatitude, setCoordLatitude] = useState<number>(-25.442152);
  const [coordLongitude, setCoordLongitude] = useState<number>(-49.2742434);
  const [zoom, setZoom] = useState<number>(9);

  const [locationsList, setLocationsList] = useState<ILocation[]>([]);
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [selectedChar, setSelectedChar] = useState<ICharacter>({
    id: undefined,
    name: 'Narrador',
    situation: 'active',
  });
  const [isBusy, setBusy] = useState(true);
  const { addToast } = useToast();
  const { user, char, signOut } = useAuth();
  const { isMobileVersion } = useMobile();

  const loadCharacters = useCallback(async () => {
    setBusy(true);

    try {
      await api.get('characters/list/all').then(response => {
        const res = response.data;

        const fullList: ICharacter[] = res;

        const filteredList = fullList.filter(
          character => character.situation === 'active',
        );

        setCharList(filteredList);
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message.indexOf('token') > 0 && error.response.status === 401) {
          addToast({
            type: 'error',
            title: 'Sessão Expirada',
            description: 'Sessão de usuário expirada, faça o login novamente!',
          });

          signOut();
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar personagens',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, signOut]);

  const loadLocations = useCallback(async () => {
    setBusy(true);

    try {
      await api
        .post('locations/list', {
          char_id: user.storyteller ? selectedChar.id : char.id,
        })
        .then(response => {
          const res = response.data;
          let foundMyLocal = false;

          const newArray = res.map((location: ILocation) => {
            const icon = Leaflet.icon({
              iconUrl: location.picture_url || imgBuilding,
              iconSize: [48, 48],
              shadowUrl: mapMakerIcon,
              shadowAnchor: [28, 65],
              iconAnchor: [24, 61],
              tooltipAnchor: [24, -32],
            });

            const newLocation = {
              id: location.id,
              name: location.name,
              description: location.description,
              address: location.address,
              latitude: location.latitude,
              longitude: location.longitude,
              responsible: location.responsible,
              responsible_char: location.responsible_char,
              elysium: location.elysium,
              type: location.type,
              property: location.property,
              clan: location.clan,
              level: location.level,
              mystical_level: location.mystical_level,
              picture_url: location.picture_url || imgBuilding,
              icon,
            };

            if (location.id === local) {
              setZoom(16);
              setCoordLatitude(location.latitude);
              setCoordLongitude(location.longitude);

              foundMyLocal = true;
            }

            return newLocation;
          });

          setLocationsList(newArray);

          if (foundMyLocal === false && local) {
            addToast({
              type: 'error',
              title: 'Erro ao tentar encontrar o local',
              description: `Erro: Esta localização é desconhecida para seu personagem.`,
            });
          }
        });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message.indexOf('token') > 0 && error.response.status === 401) {
          addToast({
            type: 'error',
            title: 'Sessão Expirada',
            description: 'Sessão de usuário expirada, faça o login novamente!',
          });

          signOut();
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar os locais',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [
    addToast,
    char.id,
    local,
    selectedChar.id,
    setCoordLatitude,
    setCoordLongitude,
    signOut,
    user.storyteller,
  ]);

  useEffect(() => {
    if (user.storyteller) {
      loadCharacters();
    }

    loadLocations();
  }, [loadLocations, loadCharacters, user.storyteller]);

  const handleCharacterChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let selectedCharacter: ICharacter;
      if (selIndex > 0) {
        const selChar = charList[selIndex - 1];

        selectedCharacter = {
          id: selChar.id,
          name: selChar.name,
          situation: selChar.situation,
        };
      } else {
        selectedCharacter = {
          id: undefined,
          name: 'Narrador',
          situation: 'active',
        };
      }

      setSelectedChar(selectedCharacter);
    },
    [charList],
  );

  return (
    <Container>
      {isMobileVersion ? (
        <HeaderMobile page="locals" />
      ) : (
        <Header page="locals" />
      )}

      {user.storyteller && (
        <TitleBox>
          {charList.length > 0 ? (
            <>
              <strong>Ver o mapa como:</strong>

              <Select
                name="character"
                id="character"
                value={selectedChar.name}
                onChange={handleCharacterChange}
              >
                <option value="">Selecione um personagem:</option>
                {charList.map(character => (
                  <option key={character.id} value={character.name}>
                    {character.name}
                  </option>
                ))}
              </Select>
            </>
          ) : (
            <strong>
              Não foi encontrado nenhum personagem na base de dados.
            </strong>
          )}
        </TitleBox>
      )}

      <Content isMobile={isMobileVersion} isSt={user.storyteller}>
        <Map
          center={[coordLatitude, coordLongitude]}
          zoom={zoom}
          style={{
            border: 'solid #888 1px',
            width: '100%',
            height: '100%',
          }}
        >
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
          />

          {isBusy ? (
            <Loading />
          ) : (
            <>
              {locationsList.map(location => (
                <Marker
                  key={location.id}
                  icon={location.icon}
                  position={[location.latitude, location.longitude]}
                >
                  <Tooltip>
                    <LocationCard
                      locationId={location.id}
                      name={location.name}
                      description={location.description}
                      address={location.address}
                      elysium={location.elysium}
                      type={location.type}
                      property={location.property}
                      responsibleId={location.responsible}
                      responsibleName={
                        location.responsible_char !== null
                          ? location.responsible_char.name
                          : ''
                      }
                      clan={location.clan}
                      level={location.level}
                      mysticalLevel={location.mystical_level}
                      pictureUrl={location.picture_url}
                      locked
                    />
                  </Tooltip>
                </Marker>
              ))}
            </>
          )}
        </Map>

        <LocationLegend>
          <strong>Legenda</strong>
          <span>
            <MdLocalAirport />- Aeroporto
          </span>
          <span>
            <GiCampingTent /> - Acampamento
          </span>
          <span>
            <GiCastle />- Castelo
          </span>
          <span>
            <MdStore />- Clube Noturno
          </span>
          <span>
            <GiGuardedTower />- Elysium
          </span>
          <span>
            <GiFamilyHouse />- Mansão
          </span>
          <span>
            <GiGreekTemple />- Propriedade
          </span>
          <span>
            <GiHouse />- Refúgio
          </span>
          <span>
            <GiBookshelf />- Universidade
          </span>
          <span>
            <MdLocationOn />- Outros
          </span>
        </LocationLegend>

        {user.storyteller && !isMobileVersion && (
          <FunctionsContainer>
            <Link to="/updatelocal" title="Editar Localização">
              <FiEdit />
            </Link>
            <Link to="/localchars" title="Definir quem conhece a Localização">
              <FiUserPlus />
            </Link>
            <Link to="/addlocal" title="Adicionar Localização">
              <FiPlus />
            </Link>
          </FunctionsContainer>
        )}
      </Content>
    </Container>
  );
};

export default Locals;
