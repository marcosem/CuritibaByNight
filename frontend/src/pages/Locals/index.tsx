/* eslint-disable camelcase */
import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { Map, TileLayer } from 'react-leaflet';
import { Container, Content } from './styles';
import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import 'leaflet/dist/leaflet.css';

// import Loading from '../../components/Loading';
// import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
// import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';

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
