/* eslint-disable camelcase */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import ICharacter from '../components/CharacterList/ICharacter';
import api from '../services/api';
import getSocket from '../utils/getSocket';

import { useAuth } from './auth';
import { useToast } from './toast';

interface IOnLineUser {
  user_id: string;
  char_id: string;
}

interface IUserConn {
  user_id: string;
  timer: NodeJS.Timeout | null;
}

interface ILevel {
  id: string;
  level: number;
  status: string;
  enabled: boolean;
}

interface ITrait {
  id: string;
  trait: string;
  level: number;
  levelTemp: number;
  levelArray: ILevel[];
  level_temp?: string;
  type: string;
  character_id: string;
  index: [number, number];
}

interface IChallengeResult {
  result: string;
  char1_jkp: string;
  char2_jkp: string;
}

interface ISocketMessage {
  type: string;
  user_id?: string;
  token?: string;
  char_id?: string;
  char?: ICharacter;
  trait?: ITrait;
  masquerade_level?: number;
  char1?: ICharacter;
  char2?: ICharacter;
  play?: string;
}

interface ISocketContextData {
  isConnected: boolean;
  updatedTrait: ITrait;
  onLineUsers: IOnLineUser[];
  reloadCharTraits: string;
  challengeOpponent: ICharacter;
  challengeReady: string;
  challengeResult: IChallengeResult;
  challengeDoRetest: boolean;
  clearUpdatedTrait(): void;
  clearReloadTraits(): void;
  clearChallengeOpponent(): void;
  clearChallengeReady(): void;
  clearChallengeResult(): void;
  clearChallengeDoRetest(): void;
  notifyTraitUpdate(trait: ITrait): void;
  resetTraits(char_id: string): void;
  notifyMasquerade(newLevel: number, increased: boolean): void;
  challengeSelect(char1: ICharacter, char2: ICharacter): void;
  challengeCancel(char1?: ICharacter, char2?: ICharacter): void;
  challengePlay(char_id: string, play: string): void;
  challengeRetest(char1: ICharacter, char2: ICharacter): void;
  enterChallengeMode(mode: boolean): void;
}

const SocketContext = createContext<ISocketContextData>(
  {} as ISocketContextData,
);

const SocketProvider: React.FC = ({ children }) => {
  const { user, char } = useAuth();
  const { addToast } = useToast();
  const [connected, setConnected] = useState<boolean>(false);
  const [onLineUsers, setOnLineUsers] = useState<IOnLineUser[]>([]);
  const [updatedTrait, setUpdatedTrait] = useState<ITrait>({} as ITrait);
  const [reloadCharTraits, setReloadCharTraits] = useState<string>('');
  const [challengeOpponent, setChallengeOpponent] = useState<ICharacter>(
    {} as ICharacter,
  );
  const [challengeReady, setChallengeReady] = useState<string>('');
  const [challengeResult, setChallengeResult] = useState<IChallengeResult>(
    {} as IChallengeResult,
  );
  const [challengeDoRetest, setChallengeDoRetest] = useState<boolean>(false);
  // const [challengeMode, setChallengeMode] = useState<boolean>(false);
  const challengeMode = useRef<boolean>(false);

  const userConnList = useRef<IUserConn[]>([]);
  const socket = useRef<WebSocket>();
  const serverPing = useRef<NodeJS.Timeout | null>(null);
  const serverGetUsers = useRef<NodeJS.Timeout | null>(null);
  const token = useRef<string>('');
  const blockDuplicatedMessage = useRef<string[]>([]);

  const sendSocketMessage = useCallback(
    (msg: ISocketMessage) => {
      if (socket.current?.readyState === socket.current?.OPEN) {
        socket.current?.send(JSON.stringify(msg));
      }
    },
    [socket],
  );

  const startPing = useCallback(() => {
    if (serverPing.current !== null) return;

    serverPing.current = setTimeout(() => {
      sendSocketMessage({ type: 'ping' });
      serverPing.current = null;
      startPing();
    }, 10000);
  }, [sendSocketMessage]);

  const updateOnLineUsersList = useCallback(() => {
    if (serverGetUsers.current !== null) return;

    serverGetUsers.current = setTimeout(() => {
      sendSocketMessage({ type: 'connection:connectedusers' });
      serverGetUsers.current = null;
      updateOnLineUsersList();
    }, 10000);
  }, [sendSocketMessage]);

  const notifyTraitUpdate = useCallback(
    (trait: ITrait) => {
      sendSocketMessage({
        type: 'trait:notify',
        char_id: trait.character_id,
        trait,
      });
    },
    [sendSocketMessage],
  );

  const clearUpdatedTrait = useCallback(() => {
    setUpdatedTrait({} as ITrait);
  }, []);

  const resetTraits = useCallback(
    (char_id: string) => {
      sendSocketMessage({
        type: 'trait:reset',
        char_id,
      });
    },
    [sendSocketMessage],
  );

  const clearReloadTraits = useCallback(() => {
    setReloadCharTraits('');
  }, []);

  const clearChallengeOpponent = useCallback(() => {
    setChallengeOpponent({} as ICharacter);
  }, []);

  const clearChallengeReady = useCallback(() => {
    setChallengeReady('');
  }, []);

  const clearChallengeResult = useCallback(() => {
    setChallengeResult({} as IChallengeResult);
  }, []);

  const clearChallengeDoRetest = useCallback(() => {
    setChallengeDoRetest(false);
  }, []);

  const enterChallengeMode = useCallback((mode: boolean) => {
    challengeMode.current = mode;
  }, []);

  const setUserConnectionTimer = useCallback((user_id: string) => {
    const userTimer = setTimeout(() => {
      const removeConnUser = userConnList.current.filter(
        connUser => connUser.user_id !== user_id,
      );

      userConnList.current = removeConnUser;
    }, 300000);

    const newUserConnList = userConnList.current.filter(
      myUser => myUser.user_id !== user_id,
    );
    newUserConnList.push({ user_id, timer: userTimer });
    userConnList.current = newUserConnList;
  }, []);

  const notifyUserConnection = useCallback(
    (user_id: string, userName: string, charName: string) => {
      const userConn = userConnList.current.find(
        myUserConn => myUserConn.user_id === user_id,
      );

      // If user is already in the connection list, reset its timeout
      if (userConn) {
        userConn.timer !== null && clearTimeout(userConn.timer);
        setUserConnectionTimer(user_id);
        return;
      }

      setUserConnectionTimer(user_id);
      addToast({
        type: 'success',
        title: 'Jogador Conectado',
        description: `${userName}${
          charName !== '' ? ` - ${charName},` : ''
        } está Online!`,
      });
    },
    [addToast, setUserConnectionTimer],
  );

  const notifyMasquerade = useCallback(
    (newLevel: number, increased: boolean) => {
      sendSocketMessage({
        type: increased ? 'masquerade:notify:up' : 'masquerade:notify:down',
        masquerade_level: newLevel,
      });
    },
    [sendSocketMessage],
  );

  const challengeSelect = useCallback(
    (char1: ICharacter, char2: ICharacter) => {
      sendSocketMessage({
        type: 'challenge:select',
        char1,
        char2,
      });
    },
    [sendSocketMessage],
  );

  const challengeCancel = useCallback(
    (char1: ICharacter, char2: ICharacter) => {
      if (char1 && char2) {
        sendSocketMessage({
          type: 'challenge:cancel',
          char1,
          char2,
        });
      } else {
        sendSocketMessage({
          type: 'challenge:cancel',
        });
      }
    },
    [sendSocketMessage],
  );

  const challengePlay = useCallback(
    (char_id: string, play: string) => {
      sendSocketMessage({
        type: 'challenge:play',
        char_id,
        play,
      });
    },
    [sendSocketMessage],
  );

  const challengeRetest = useCallback(
    (char1: ICharacter, char2: ICharacter) => {
      sendSocketMessage({
        type: 'challenge:retest',
        char1,
        char2,
      });
    },
    [sendSocketMessage],
  );

  const connect = useCallback(() => {
    if (user === undefined) return;

    socket.current = getSocket();
    if (socket.current) {
      socket.current.onopen = () => {
        sendSocketMessage({
          type: 'connection:auth',
          user_id: user.id,
          char_id: char ? char.id : '',
          char: char as ICharacter,
          token: token.current,
        });

        startPing();
        updateOnLineUsersList();
        setConnected(true);
      };

      socket.current.onclose = () => {
        setConnected(false);
        setTimeout(() => connect(), 5000);
      };

      socket.current.onmessage = msg => {
        const myMsg = JSON.parse(msg.data);

        if (myMsg.message) {
          // Block duplicated messages
          if (blockDuplicatedMessage.current.indexOf(myMsg.message) >= 0)
            return;
          blockDuplicatedMessage.current.push(myMsg.message);
          setTimeout(() => {
            blockDuplicatedMessage.current = blockDuplicatedMessage.current.filter(
              msgFilter => msgFilter !== myMsg.message,
            );
          }, 500);

          switch (myMsg.message) {
            case 'connection:connectedusers':
              if (myMsg.users) {
                const connUsers: IOnLineUser[] = myMsg.users.filter(
                  (connUser: IOnLineUser) => connUser.user_id !== '',
                );

                setOnLineUsers(connUsers);
              }
              break;

            case 'connection:user':
              if (myMsg.user_name !== '' && myMsg.user_id) {
                notifyUserConnection(
                  myMsg.user_id,
                  myMsg.user_name,
                  myMsg.char_name || '',
                );
              }
              break;

            case 'trait:update':
              if (myMsg.trait) {
                setUpdatedTrait(myMsg.trait);
              }
              break;

            case 'trait:reload':
              if (myMsg.char_id) {
                setReloadCharTraits(myMsg.char_id);
              }
              break;

            case 'masquerade:increased':
              if (myMsg.masquerade_level) {
                addToast({
                  type: 'error',
                  title: 'QUEBRA DE MÁSCARA',
                  description: `Quebra de Máscara subiu para ${myMsg.masquerade_level}.`,
                });
              }
              break;

            case 'masquerade:decreased':
              if (myMsg.masquerade_level) {
                addToast({
                  type: 'success',
                  title: 'QUEBRA DE MÁSCARA',
                  description: `Quebra de Máscara desceu para ${myMsg.masquerade_level}.`,
                });
              }
              break;

            case 'challenge:opponentSelected':
              if (myMsg.opponentChar) {
                const { opponentChar } = myMsg;
                const opponentName = opponentChar.name;
                const isST = opponentChar.id.indexOf('Storyteller') >= 0;

                setChallengeOpponent(opponentChar);

                if (challengeMode.current) {
                  if (isST) {
                    addToast({
                      type: 'success',
                      title: 'Desafio!',
                      description: `O Narrador ${opponentName} chamou um desafio!`,
                    });
                  } else {
                    addToast({
                      type: 'success',
                      title: 'Desafio!',
                      description: `Seu personagem foi desafiado por [${opponentName}]`,
                    });
                  }
                }
              }
              break;

            case 'challenge:restart':
              setChallengeOpponent({
                id: 'restart',
              } as ICharacter);

              addToast({
                type: 'info',
                title: 'Desafio encerrado',
                description: 'Desafio encerrado pelo narrador.',
              });
              break;

            case 'challenge:ready:1':
            case 'challenge:ready:2':
              if (myMsg.character) {
                if (myMsg.character === 1) {
                  setChallengeReady('1');
                } else {
                  setChallengeReady('2');
                }
              }
              break;

            case 'challenge:result':
              if (myMsg.result && myMsg.char1_jkp && myMsg.char2_jkp) {
                const result: IChallengeResult = {
                  result: myMsg.result,
                  char1_jkp: myMsg.char1_jkp,
                  char2_jkp: myMsg.char2_jkp,
                };

                setChallengeResult(result);
              }
              break;

            case 'challenge:retest':
              setChallengeDoRetest(true);
              break;

            case 'error':
              if (myMsg.error) {
                addToast({
                  type: 'error',
                  title: 'Erro de comunicação com servidor',
                  description: `Erro: ${myMsg.error}`,
                });
              }

              break;

            default:
          }
        }
      };
    }
  }, [
    addToast,
    challengeMode,
    char,
    notifyUserConnection,
    sendSocketMessage,
    startPing,
    updateOnLineUsersList,
    user,
  ]);

  useEffect(() => {
    if (user) {
      token.current = api.defaults.headers.Authorization.replace('Bearer ', '');
      connect();
    }

    return () => {
      socket.current?.close();
    };
  }, [connect, user]);

  return (
    <SocketContext.Provider
      value={{
        isConnected: connected,
        onLineUsers,
        updatedTrait,
        reloadCharTraits,
        challengeOpponent,
        challengeReady,
        challengeResult,
        challengeDoRetest,
        notifyTraitUpdate,
        clearUpdatedTrait,
        clearReloadTraits,
        clearChallengeOpponent,
        clearChallengeReady,
        clearChallengeResult,
        clearChallengeDoRetest,
        resetTraits,
        notifyMasquerade,
        challengeSelect,
        challengeCancel,
        challengePlay,
        challengeRetest,
        enterChallengeMode,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

function useSocket(): ISocketContextData {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return context;
}

export { SocketProvider, useSocket };
