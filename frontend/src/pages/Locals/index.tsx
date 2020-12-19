/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { Map, TileLayer, Marker, Tooltip } from 'react-leaflet';
import Leaflet from 'leaflet';
import api from '../../services/api';

import { Container, Content, MapToolTip } from './styles';
import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import Loading from '../../components/Loading';
import 'leaflet/dist/leaflet.css';

// import Loading from '../../components/Loading';
// import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';

import mapMakerIcon from '../../assets/mapMakerIcon.svg';

interface ILocation {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  picture_url: string;
  icon: Leaflet.Icon<Leaflet.IconOptions>;
}

/*
const mapPaco = Leaflet.icon({
  iconUrl: pacoDaLiberdade,
  iconSize: [48, 48],
  shadowUrl: mapMakerIcon,
  // shadowSize: [32, 32],
  shadowAnchor: [28, 65],
  iconAnchor: [24, 61],
  tooltipAnchor: [24, -32],
});



const mapToreador = Leaflet.icon({
  iconUrl: elysiumToreador,
  iconSize: [48, 48],
  shadowUrl: mapMakerIcon,
  // shadowSize: [32, 32],
  shadowAnchor: [28, 65],
  iconAnchor: [24, 61],
  tooltipAnchor: [24, -32],
});
*/

const Locals: React.FC = () => {
  const [locationsList, setLocationsList] = useState<ILocation[]>([]);
  const [isBusy, setBusy] = useState(true);
  const { addToast } = useToast();
  const { user, char, signOut } = useAuth();
  const { isMobileVersion } = useMobile();

  const loadLocations = useCallback(async () => {
    setBusy(true);

    try {
      await api
        .post('locations/list', {
          char_id: user.storyteller ? undefined : char.id,
        })
        .then(response => {
          const res = response.data;
          const newArray = res.map((location: ILocation) => {
            const icon = Leaflet.icon({
              iconUrl: location.picture_url,
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
              picture_url: location.picture_url,
              icon,
            };
            return newLocation;
          });

          setLocationsList(newArray);
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
  }, [addToast, char.id, signOut, user.storyteller]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  return (
    <Container>
      {isMobileVersion ? (
        <HeaderMobile page="locals" />
      ) : (
        <Header page="locals" />
      )}

      {isBusy ? (
        <Loading />
      ) : (
        <Content isMobile={isMobileVersion}>
          <Map
            center={[-25.442152, -49.2742434]}
            zoom={12}
            style={{
              border: 'solid #888 1px',
              width: '100%',
              height: '100%',
            }}
          >
            {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
            <TileLayer
              url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
            />

            <>
              {locationsList.map(location => (
                <Marker
                  icon={location.icon}
                  position={[location.latitude, location.longitude]}
                >
                  <Tooltip>
                    <MapToolTip>
                      <img width="200" src={location.picture_url} alt="" />
                      <strong>{location.name}</strong>
                      <span>{location.description}</span>
                      <span>{location.address}</span>
                    </MapToolTip>
                  </Tooltip>
                </Marker>
              ))}
            </>
          </Map>

          {user.storyteller && (
            <Link to="/dashboard">
              <FiPlus />
            </Link>
          )}
        </Content>
      )}
    </Container>
  );
};

export default Locals;
