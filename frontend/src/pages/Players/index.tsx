/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import { FaCheckCircle, FaMinusCircle } from 'react-icons/fa';
import { isMobile } from 'react-device-detect';
import api from '../../services/api';

import Header from '../../components/Header';
import Loading from '../../components/Loading';

import { Container, TableWrapper, Table, TableCell } from './styles';
import { useToast } from '../../hooks/toast';

interface IPlayer {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
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
            active: user.active,
            storyteller: user.storyteller,
            avatar_url: user.avatar_url,
          };
          return newUser;
        });

        setPlayerList(newArray);
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        addToast({
          type: 'error',
          title: 'Erro ao tentar listar jogadores',
          description: `Erro: '${message}'`,
        });
      }
    }
    setBusy(false);
  }, [addToast]);

  useEffect(() => {
    setMobile(isMobile);
    loadPlayers();
  }, [loadPlayers]);

  const handleProfile = useCallback((profile: IPlayer) => {
    console.log(profile);
  }, []);

  return (
    <Container>
      <Header page="Painel de Jogadores" />
      {isBusy ? (
        <Loading />
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Jogador</th>
                {!mobileVer && (
                  <>
                    <th>E-mail</th>
                    <th>Telefone</th>
                  </>
                )}
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {playerList.map(player => (
                <tr key={player.id} onClick={() => handleProfile(player)}>
                  <td>
                    <img
                      src={
                        player.avatar_url ||
                        `https://api.adorable.io/avatars/56/${player.name}@adorable.png`
                      }
                      alt=""
                    />
                  </td>
                  <td>
                    <TableCell>{player.name}</TableCell>
                  </td>
                  {!mobileVer && (
                    <>
                      <td>
                        <TableCell>{player.email}</TableCell>
                      </td>
                      <td>{player.phone}</td>
                    </>
                  )}

                  <td>
                    {player.active ? (
                      <FaCheckCircle color="green" />
                    ) : (
                      <FaMinusCircle color="red" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
    </Container>
  );
};

export default Players;
