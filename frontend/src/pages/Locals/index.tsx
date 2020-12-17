/* eslint-disable camelcase */
import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { Map, TileLayer, Marker, Tooltip } from 'react-leaflet';
import Leaflet from 'leaflet';

import { Container, Content } from './styles';
import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import 'leaflet/dist/leaflet.css';

// import Loading from '../../components/Loading';
// import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
// import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';

import mapMakerIcon from '../../assets/mapMakerIconSmall.svg';
import pacoDaLiberdade from '../../assets/paco-da-liberdade.png';
import elysiumToreador from '../../assets/elysium-toreador.png';

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

const Locals: React.FC = () => {
  // const [isBusy, setBusy] = useState(true);
  // const { user, signOut } = useAuth();
  const { user } = useAuth();
  // const { addToast } = useToast();
  const { isMobileVersion } = useMobile();

  return (
    <Container>
      {isMobileVersion ? (
        <HeaderMobile page="locals" />
      ) : (
        <Header page="locals" />
      )}

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

          <Marker icon={mapPaco} position={[-25.4296733, -49.2699905]}>
            <Tooltip>
              <img
                width="200"
                src="https://www.ufpr.br/portalufpr/wp-content/uploads/2015/05/PA%C3%87OLIBERDADE.jpg"
                alt=""
              />
              <br />
              Paço da Liberdade <br /> Elysium Tremere
            </Tooltip>
          </Marker>

          <Marker icon={mapToreador} position={[-25.4384281, -49.293875]}>
            <Tooltip>
              <img width="200" src={elysiumToreador} alt="" />
              <br />
              Ateliê Victor Augusto Gentil
              <br />
              Elysium Toreador
              <br />
              Al. Dr. Carlos de Carvalho, 2020
              <br />
              Bigorrilho
              <br />
            </Tooltip>
          </Marker>
        </Map>

        {user.storyteller && (
          <Link to="/dashboard">
            <FiPlus />
          </Link>
        )}
      </Content>
    </Container>
  );
};

export default Locals;
