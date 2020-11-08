/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import { FaCheckCircle, FaMinusCircle } from 'react-icons/fa';
import api from '../../services/api';

import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import Loading from '../../components/Loading';

import { Container, TableWrapper, Table, TableCell, Scroll } from './styles';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';
import imgProfile from '../../assets/profile.jpg';

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
  const [isBusy, setBusy] = useState(true);
  const { signOut } = useAuth();
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();

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
            title: 'Erro ao tentar listar jogadores',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, signOut]);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  const handleProfile = useCallback((profile: IPlayer) => {
    console.log(profile);
  }, []);

  return (
    <Container>
      {isMobileVersion ? (
        <HeaderMobile page="players" />
      ) : (
        <Header page="players" />
      )}
      {isBusy ? (
        <Loading />
      ) : (
        <Scroll>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Jogador</th>
                  {!isMobileVersion && (
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
                          player.avatar_url || imgProfile
                          // `https://api.adorable.io/avatars/56/${player.name}@adorable.png`
                        }
                        alt=""
                      />
                    </td>
                    <td>
                      <TableCell>{player.name}</TableCell>
                    </td>
                    {!isMobileVersion && (
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
        </Scroll>
      )}
    </Container>
  );
};

export default Players;
