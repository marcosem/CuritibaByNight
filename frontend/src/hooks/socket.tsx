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

/*
interface ISocketClientMessage {
  type: string;
  user_id?: string;
  token?: string;
  char_id?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  char?: any;
}

interface ISocketServerMessage {
  message: string;
  id?: string;
  error?: string;
  character?: string;
  connected?: boolean;
}
*/

import { useAuth } from './auth';

interface IOnLineUser {
  user_id: string;
  char_id: string;
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

interface ISocketMessage {
  type: string;
  user_id?: string;
  token?: string;
  char_id?: string;
  char?: ICharacter;
  trait?: ITrait;
  /*
  play?: string;
  char1_id?: string;
  char2_id?: string;
  */
}

interface ISocketContextData {
  isConnected: boolean;
  updatedTrait: ITrait;
  onLineUsers: IOnLineUser[];
  reloadCharTraits: string;
  clearUpdatedTrait(): void;
  clearReloadTraits(): void;
  notifyTraitUpdate(trait: ITrait): void;
  resetTraits(char_id: string): void;
}

const SocketContext = createContext<ISocketContextData>(
  {} as ISocketContextData,
);

const SocketProvider: React.FC = ({ children }) => {
  const { user, char } = useAuth();
  const [connected, setConnected] = useState<boolean>(false);
  const [onLineUsers, setOnLineUsers] = useState<IOnLineUser[]>([]);
  const [updatedTrait, setUpdatedTrait] = useState<ITrait>({} as ITrait);
  const [reloadCharTraits, setReloadCharTraits] = useState<string>('');

  const socket = useRef<WebSocket>();
  const serverPing = useRef<number>(0);
  const serverGetUsers = useRef<number>(0);
  const token = useRef<string>('');
  // const tryReconnect = useRef<boolean>(false);

  const sendSocketMessage = useCallback(
    (msg: ISocketMessage) => {
      /*
      console.log(
        socket.current?.readyState === socket.current?.OPEN ? 'Open' : 'Closed',
      );
      */

      if (socket.current?.readyState === socket.current?.OPEN) {
        socket.current?.send(JSON.stringify(msg));
      }
    },
    [socket],
  );

  const startPing = useCallback(() => {
    if (serverPing.current !== 0) return;

    serverPing.current = setTimeout(() => {
      sendSocketMessage({ type: 'ping' });
      serverPing.current = 0;
      startPing();
    }, 10000);
  }, [sendSocketMessage]);

  const updateOnLineUsersList = useCallback(() => {
    if (serverGetUsers.current !== 0) return;

    serverGetUsers.current = setTimeout(() => {
      sendSocketMessage({ type: 'connection:connectedusers' });
      serverGetUsers.current = 0;
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

  const connect = useCallback(() => {
    if (user === undefined) return;

    socket.current = getSocket();
    if (socket.current) {
      socket.current.onopen = () => {
        sendSocketMessage({
          type: 'connection:auth',
          user_id: user.id,
          char_id: char ? char.id : '',
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
          switch (myMsg.message) {
            case 'connection:connectedusers':
              if (myMsg.users) {
                const connUsers: IOnLineUser[] = myMsg.users.filter(
                  (connUser: IOnLineUser) => connUser.user_id !== '',
                );

                setOnLineUsers(connUsers);
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
            default:
          }
        }
      };
    }
  }, [char, sendSocketMessage, startPing, updateOnLineUsersList, user]);

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
        notifyTraitUpdate,
        clearUpdatedTrait,
        clearReloadTraits,
        resetTraits,
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
