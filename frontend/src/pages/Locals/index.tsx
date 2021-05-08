/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
import ReactDomServer from 'react-dom/server';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons';
import { FiPlus, FiEdit, FiUserPlus, FiFlag } from 'react-icons/fi';
import {
  Map,
  TileLayer,
  Marker,
  Tooltip,
  Polyline,
  Popup,
} from 'react-leaflet';
import Leaflet from 'leaflet';

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
import api from '../../services/api';

import {
  Container,
  Content,
  TitleBox,
  Select,
  LocationLegend,
  FunctionsContainer,
  CheckboxContainer,
} from './styles';
import Loading from '../../components/Loading';
import 'leaflet/dist/leaflet.css';
import imgBuilding from '../../assets/building.jpg';
import LocationCard from '../../components/LocationCard';
import Checkbox from '../../components/Checkbox';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';
import { useHeader } from '../../hooks/header';

import { territories } from './territories.json';

import MapMaker from '../../components/MapMaker';

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
  creature_type: string;
  sect: string;
  level: number;
  mystical_level: number;
  picture_url: string;
  icon: Leaflet.Icon<Leaflet.IconOptions>;
}

interface ICharacter {
  id: string | undefined;
  name: string;
  clan: string;
  situation: string;
}

interface ITerritory {
  name: string;
  population: string;
  sect: string;
  coordinates: [number, number][];
  color: string;
}

interface ITerritoryRes {
  name: string;
  population: number;
  sect?: string;
}

const Locals: React.FC = () => {
  const { local } = useParams<IRouteParams>();
  const [coordLatitude, setCoordLatitude] = useState<number>(-25.442152);
  const [coordLongitude, setCoordLongitude] = useState<number>(-49.2742434);
  const [zoom, setZoom] = useState<number>(9);
  const [showBorders, setShowBorders] = useState<boolean>(false);
  const [borders, setBorders] = useState<ITerritory[]>([]);
  const [locationsList, setLocationsList] = useState<ILocation[]>([]);
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [selectedChar, setSelectedChar] = useState<ICharacter>({
    id: undefined,
    name: 'Narrador',
    situation: 'active',
    clan: 'None',
  });
  const [isBusy, setBusy] = useState(true);
  const { addToast } = useToast();
  const { user, char, signOut } = useAuth();
  const { isMobileVersion } = useMobile();
  const { setCurrentPage } = useHeader();

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

        if (error.response.status !== 401) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar personagens',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast]);

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
          const currentChar = selectedChar.id ? selectedChar : char;
          const ownerId = currentChar.id;

          // https://leafletjs.com/reference-1.7.1.html#divicon-option
          const newArray = res.map((location: ILocation) => {
            let ownwership = '';

            const filteredClan1 = currentChar.clan.split(':');
            const filteredClan2 = filteredClan1[0].split(' (');

            if (ownerId === location.responsible) {
              ownwership = 'owner';
            } else if (
              location.property === 'clan' &&
              location.clan === filteredClan2[0]
            ) {
              ownwership = 'clan';
            }

            let MyIcon: IconType;
            if (location.elysium) {
              MyIcon = GiGuardedTower;
            } else {
              switch (location.type) {
                case 'haven':
                  MyIcon = GiHouse;
                  break;
                case 'airport':
                  MyIcon = MdLocalAirport;
                  break;
                case 'camp':
                  MyIcon = GiCampingTent;
                  break;
                case 'castle':
                  MyIcon = GiCastle;
                  break;
                case 'haunt':
                  MyIcon = GiHaunting;
                  break;
                case 'holding':
                  MyIcon = GiGreekTemple;
                  break;
                case 'mansion':
                  MyIcon = GiFamilyHouse;
                  break;
                case 'nightclub':
                  MyIcon = MdStore;
                  break;
                case 'university':
                  MyIcon = GiBookshelf;
                  break;
                case 'other':
                default:
                  MyIcon = MdLocationOn;
                  break;
              }
            }

            const icon = Leaflet.divIcon({
              className: 'custom-icon',
              html: ReactDomServer.renderToString(
                <MapMaker
                  ownership={ownwership}
                  selected={
                    location.id === local ||
                    ownerId === location.responsible ||
                    ownwership === 'clan'
                  }
                >
                  <MyIcon />
                </MapMaker>,
              ),
              iconSize: [42, 42],
              iconAnchor: [21, 42],
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
              creature_type: location.creature_type,
              sect: location.sect,
              level:
                ownerId === location.responsible || ownwership === 'clan'
                  ? location.level
                  : '?',
              mystical_level:
                ownerId === location.responsible || ownwership === 'clan'
                  ? location.mystical_level
                  : '',
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

        if (message?.indexOf('token') > 0 && error.response.status === 401) {
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
  }, [addToast, char, local, selectedChar, signOut, user.storyteller]);

  const loadTerritories = useCallback(async () => {
    setBusy(true);

    try {
      await api.get('territories/list').then(response => {
        const res: ITerritoryRes[] = response.data;

        const territoriesList: ITerritory[] = res.map(
          (territory: ITerritoryRes) => {
            const territoryCoords = territories.find(
              terr => terr.name === territory.name,
            );

            const sect = territory.sect ? territory.sect.split(' (') : [''];

            let color;
            switch (sect[0]) {
              case 'Sabbat':
                color = 'red';
                break;
              case 'Camarilla':
                color = 'green';
                break;
              case 'Anarch':
                color = 'yellow';
                break;
              case 'Anarch-Sabbat':
                color = 'orangered';
                break;
              case 'Wyrm':
                color = 'indigo';
                break;
              case 'Followers of Set':
                color = 'chocolate';
                break;
              case 'Assamites':
                color = 'steelblue';
                break;
              case 'Garou':
                color = 'magenta';
                break;
              case 'Inquisition':
                color = 'white';
                break;
              default:
                color = 'black';
            }

            const parsedTerritory: ITerritory = {
              name: territory.name,
              population: new Intl.NumberFormat('pt-BR').format(
                territory.population,
              ),
              sect: territory.sect ? territory.sect : 'Não definido',
              coordinates: territoryCoords
                ? territoryCoords.coordinates.map(coord => {
                    const Lat = coord[1];
                    const Long = coord[0];
                    const resLatLong: [number, number] = [Lat, Long];

                    return resLatLong;
                  })
                : [],
              color,
            };

            return parsedTerritory;
          },
        );
        setBorders(territoriesList);
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (error.response.status !== 401) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar os territórios',
            description: `Erro: '${message}'`,
          });
        }
      }
    }

    setBusy(false);
  }, [addToast]);

  const handleShowBorderChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setShowBorders(e.target.checked);
    },
    [],
  );

  useEffect(() => {
    setCurrentPage('locals');
    if (user.storyteller) {
      loadCharacters();
      loadTerritories();
    }

    loadLocations();
  }, [
    loadLocations,
    loadCharacters,
    user.storyteller,
    loadTerritories,
    setCurrentPage,
  ]);

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
          clan: selChar.clan,
        };
      } else {
        selectedCharacter = {
          id: undefined,
          name: 'Narrador',
          situation: 'active',
          clan: 'None',
        };
      }

      setSelectedChar(selectedCharacter);
    },
    [charList],
  );

  return (
    <Container isMobile={isMobileVersion}>
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

          {user.storyteller && showBorders && borders.length > 0 && (
            <>
              {borders.map(border => (
                <Polyline
                  color={border.color}
                  fillColor={border.color}
                  fill
                  positions={border.coordinates}
                  opacity={0.5}
                >
                  <Popup>{`${border.name}, pop. ${border.population} hab., ${border.sect}`}</Popup>
                </Polyline>
              ))}
            </>
          )}

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
                      creature_type={location.creature_type}
                      sect={location.sect}
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
            <GiHaunting />- Local Assombrado
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

        {user.storyteller && (
          <CheckboxContainer>
            <Checkbox
              name="showBorder"
              id="showBorder"
              checked={showBorders}
              onChange={handleShowBorderChange}
            >
              Mostrar Territórios
            </Checkbox>
          </CheckboxContainer>
        )}

        {user.storyteller && (
          <FunctionsContainer isMobile={isMobileVersion}>
            <Link to="/territories" title="Lista de Territórios">
              <FiFlag />
            </Link>
            {!isMobileVersion && (
              <Link to="/updatelocal" title="Editar Localização">
                <FiEdit />
              </Link>
            )}
            <Link to="/localchars" title="Definir quem conhece a Localização">
              <FiUserPlus />
            </Link>
            {!isMobileVersion && (
              <Link to="/addlocal" title="Adicionar Localização">
                <FiPlus />
              </Link>
            )}
          </FunctionsContainer>
        )}
      </Content>
    </Container>
  );
};

export default Locals;
