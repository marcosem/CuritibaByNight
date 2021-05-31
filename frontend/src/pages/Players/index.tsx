/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  FaCheckCircle,
  FaMinusCircle,
  FaExclamationCircle,
} from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { format } from 'date-fns';
import api from '../../services/api';

import Loading from '../../components/Loading';

import {
  Container,
  TableWrapper,
  Table,
  TableColumn,
  TableColumnHeader,
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
import { useHeader } from '../../hooks/header';
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
  lgpd_acceptance_date: Date;
  lgpd_denial_date: Date;
  lastLoginFormated: string;
  lgpd: string;
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
  const { setCurrentPage } = useHeader();
  const history = useHistory();

  const loadPlayers = useCallback(async () => {
    try {
      await api.get('users/list').then(response => {
        const res = response.data;
        const newArray = res.map((user: IPlayer) => {
          let lgpd: string;
          if (user.lgpd_acceptance_date !== null) {
            lgpd = 'Aceito';
          } else if (user.lgpd_denial_date !== null) {
            lgpd = 'Negado';
          } else {
            lgpd = 'Pendente';
          }

          const newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            active: !!(user.active && user.lastLogin_at),
            storyteller: user.storyteller,
            avatar_url: user.avatar_url,
            lastLogin_at: user.lastLogin_at,
            lastLoginFormated:
              user.lastLogin_at !== null
                ? format(new Date(user.lastLogin_at), 'dd/MM/yyyy HH:mm:ss')
                : '',
            lgpd,
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
    setCurrentPage('players');
    loadPlayers();
  }, [loadPlayers, setCurrentPage]);

  const handleProfile = useCallback(
    (profile: IPlayer) => {
      if (profile.id) {
        history.push(`/updateplayer/${profile.id}`);
      }
    },
    [history],
  );

  return (
    <Container isMobile={isMobileVersion}>
      {isBusy ? (
        <Loading />
      ) : (
        <>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <TableColumnHeader>Avatar</TableColumnHeader>
                  <TableColumnHeader>Jogador</TableColumnHeader>
                  {!isMobileVersion && (
                    <>
                      <TableColumnHeader>E-mail</TableColumnHeader>
                      <TableColumnHeader minWidth={130}>
                        Telefone
                      </TableColumnHeader>
                      <TableColumnHeader minWidth={130}>
                        Último Acesso
                      </TableColumnHeader>
                      <TableColumnHeader minWidth={70}>LGPD</TableColumnHeader>
                    </>
                  )}
                  <TableColumnHeader>Situação</TableColumnHeader>
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
                        <TableColumn>
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
                        </TableColumn>
                        <TableColumn>
                          <TableCell>{playerOn.name}</TableCell>
                        </TableColumn>
                        {!isMobileVersion && (
                          <>
                            <TableColumn>
                              <TableCell>{playerOn.email}</TableCell>
                            </TableColumn>
                            <TableColumn minWidth={130}>
                              {playerOn.phone}
                            </TableColumn>
                            <TableColumn minWidth={130}>
                              {playerOn.lastLoginFormated}
                            </TableColumn>
                            <TableColumn minWidth={70}>
                              {playerOn.lgpd}
                            </TableColumn>
                          </>
                        )}

                        <TableColumn>
                          {playerOn.active ? (
                            <>
                              {playerOn.lgpd === 'Negado' ? (
                                <FaExclamationCircle color="red" />
                              ) : (
                                <FaCheckCircle color="green" />
                              )}
                            </>
                          ) : (
                            <FaMinusCircle color="red" />
                          )}
                        </TableColumn>
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
                        <TableColumn>
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
                        </TableColumn>
                        <TableColumn>
                          <TableCell>{playerOff.name}</TableCell>
                        </TableColumn>
                        {!isMobileVersion && (
                          <>
                            <TableColumn>
                              <TableCell>{playerOff.email}</TableCell>
                            </TableColumn>
                            <TableColumn minWidth={130}>
                              {playerOff.phone}
                            </TableColumn>
                            <TableColumn minWidth={130}>
                              {playerOff.lastLoginFormated}
                            </TableColumn>
                            <TableColumn minWidth={70}>
                              {playerOff.lgpd}
                            </TableColumn>
                          </>
                        )}

                        <TableColumn>
                          {playerOff.active ? (
                            <>
                              {playerOff.lgpd === 'Negado' ? (
                                <FaExclamationCircle color="red" />
                              ) : (
                                <FaCheckCircle color="green" />
                              )}
                            </>
                          ) : (
                            <FaMinusCircle color="red" />
                          )}
                        </TableColumn>
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
