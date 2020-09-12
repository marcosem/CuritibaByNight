/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import api from '../../services/api';

import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import Loading from '../../components/Loading';

import { Container } from './styles';
import { useToast } from '../../hooks/toast';

interface IPlayer {
  id: string;
  name: string;
  email: string;
  phone: string;
  storyteller: boolean;
  avatar_url: string;
}

const Players: React.FC = () => {
  const [playerList, setPlayerList] = useState<IPlayer[]>([]);
  const [mobileVer, setMobile] = useState(false);
  const [isBusy, setBusy] = useState(true);

  const { addToast } = useToast();

  const loadPlayers = useCallback(async () => {
    setBusy(true);

    try {
      await api.get('users/list').then(response => {
        const res = response.data;
        const newArray = res.map((user: IPlayer) => {
          const newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar_url: user.avatar_url,
          };
          return newUser;
        });

        console.log(newArray);

        setPlayerList(newArray);
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        addToast({
          type: 'error',
          title: 'Erro ao tentar listar jogadores',
          description: `Erro: '${message}`,
        });
      }
    }
    setBusy(false);
  }, [addToast]);

  useEffect(() => {
    setMobile(isMobile);
    loadPlayers();
  }, [loadPlayers]);

  return (
    <Container>
      {mobileVer ? <HeaderMobile /> : <Header page="Painel de Jogadores" />}
      {isBusy ? (
        <Loading />
      ) : (
        <ul>
          {playerList.map(player => (
            <li>
              <div>
                <span>{player.name}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default Players;
