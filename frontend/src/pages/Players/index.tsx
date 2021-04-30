/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaCheckCircle, FaMinusCircle } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import api from '../../services/api';

import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import Loading from '../../components/Loading';

import {
  Container,
  TableWrapper,
  Table,
  AvatarCell,
  Avatar,
  ConnectionStatus,
  TableCell,
  AddLink,
} from './styles';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';
import { useSocket } from '../../hooks/socket';
import imgProfile from '../../assets/profile.jpg';

interface IPlayer {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  storyteller: boolean;
  avatar_url: string;
  lastLogin_at: string;
  isOnLine: boolean;
}

interface IOnLineUser {
  user_id: string;
  char_id: string;
}

const Players: React.FC = () => {
  const [playerList, setPlayerList] = useState<IPlayer[]>([]);
  const [isBusy, setBusy] = useState(true);
  const { signOut } = useAuth();
  const { addToast } = useToast();
  const { onLineUsers } = useSocket();
  const { isMobileVersion } = useMobile();
  const history = useHistory();

  const loadPlayers = useCallback(async () => {
    try {
      await api.get('users/list').then(response => {
        const res = response.data;
        const newArray = res.map((user: IPlayer) => {
          const newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            active: !!(user.active && user.lastLogin_at),
            storyteller: user.storyteller,
            avatar_url: user.avatar_url,
            lastLogin_at: user.lastLogin_at,
            isOnLine: false,
          };
          return newUser;
        });

        setPlayerList(newArray);
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

  const handleProfile = useCallback(
    (profile: IPlayer) => {
      if (profile.id) {
        history.push(`/updateplayer/${profile.id}`);
      }
    },
    [history],
  );

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
        <>
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
                <>
                  {playerList
                    .filter(
                      player =>
                        onLineUsers
                          .map((connUser: IOnLineUser) => connUser.user_id)
                          .indexOf(player.id) >= 0,
                    )
                    .map(playerOn => (
                      <tr
                        key={playerOn.id}
                        onClick={() => handleProfile(playerOn)}
                      >
                        <td>
                          <AvatarCell>
                            <Avatar
                              src={
                                playerOn.avatar_url || imgProfile
                                // `https://api.adorable.io/avatars/56/${playerOn.name}@adorable.png`
                              }
                              alt=""
                              isSt={playerOn.storyteller}
                            />
                            <ConnectionStatus
                              isConnected={
                                onLineUsers
                                  .map(
                                    (connUser: IOnLineUser) => connUser.user_id,
                                  )
                                  .indexOf(playerOn.id) >= 0
                              }
                            />
                          </AvatarCell>
                        </td>
                        <td>
                          <TableCell>{playerOn.name}</TableCell>
                        </td>
                        {!isMobileVersion && (
                          <>
                            <td>
                              <TableCell>{playerOn.email}</TableCell>
                            </td>
                            <td>{playerOn.phone}</td>
                          </>
                        )}

                        <td>
                          {playerOn.active ? (
                            <FaCheckCircle color="green" />
                          ) : (
                            <FaMinusCircle color="red" />
                          )}
                        </td>
                      </tr>
                    ))}

                  {playerList
                    .filter(
                      player =>
                        onLineUsers
                          .map((connUser: IOnLineUser) => connUser.user_id)
                          .indexOf(player.id) === -1,
                    )
                    .map(playerOff => (
                      <tr
                        key={playerOff.id}
                        onClick={() => handleProfile(playerOff)}
                      >
                        <td>
                          <AvatarCell>
                            <Avatar
                              src={
                                playerOff.avatar_url || imgProfile
                                // `https://api.adorable.io/avatars/56/${playerOff.name}@adorable.png`
                              }
                              alt=""
                              isSt={playerOff.storyteller}
                            />
                            <ConnectionStatus
                              isConnected={
                                onLineUsers
                                  .map(
                                    (connUser: IOnLineUser) => connUser.user_id,
                                  )
                                  .indexOf(playerOff.id) >= 0
                              }
                            />
                          </AvatarCell>
                        </td>
                        <td>
                          <TableCell>{playerOff.name}</TableCell>
                        </td>
                        {!isMobileVersion && (
                          <>
                            <td>
                              <TableCell>{playerOff.email}</TableCell>
                            </td>
                            <td>{playerOff.phone}</td>
                          </>
                        )}

                        <td>
                          {playerOff.active ? (
                            <FaCheckCircle color="green" />
                          ) : (
                            <FaMinusCircle color="red" />
                          )}
                        </td>
                      </tr>
                    ))}
                </>
              </tbody>
            </Table>
          </TableWrapper>
          {!isMobileVersion && (
            <AddLink>
              <Link to="/addplayer" title="Adicionar Jogador">
                <FiPlus />
              </Link>
            </AddLink>
          )}
        </>
      )}
    </Container>
  );
};

export default Players;
