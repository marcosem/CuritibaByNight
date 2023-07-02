/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable camelcase */

import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import Cookies from 'js-cookie';
import api from '../services/api';

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  storyteller: boolean;
  avatar_url: string;
  lgpd_acceptance_date: Date | null;
}

interface ICharacter {
  id: string;
  name: string;
  clan: string;
}

interface IAuthState {
  token: string;
  user: IUser;
}

interface ISingInCreadentials {
  email: string;
  password: string;
}

interface IAuthContextData {
  user: IUser;
  char: ICharacter;
  signIn(credentials: ISingInCreadentials): Promise<void>;
  signOut(): void;
  updateUser(user: IUser): void;
  setChar(char: ICharacter): void;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  // Initilizing token if it is in the local storage
  const [data, setData] = useState<IAuthState>(() => {
    const token = localStorage.getItem('@CuritibaByNight:token');
    const user = localStorage.getItem('@CuritibaByNight:user');

    if (token && user) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as IAuthState;
  });

  const [character, setCharacter] = useState<ICharacter>(() => {
    const char = localStorage.getItem('@CuritibaByNight:character');

    if (char) {
      return JSON.parse(char);
    }

    return {} as ICharacter;
  });
  const [isTokenValidated, setIsTokenValidated] = useState<boolean>(false);

  const resetData = useCallback(() => {
    setData({
      token: '',
      user: {
        name: '',
        email: '',
        avatar_url: '',
        id: '',
        lgpd_acceptance_date: null,
        phone: '',
        storyteller: false,
      },
    });
    setCharacter({
      clan: '',
      name: '',
      id: '',
    });
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user, refresh_token } = response.data;

    const rawUser: IUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      storyteller: user.storyteller,
      avatar_url: user.avatar_url,
      lgpd_acceptance_date: user.lgpd_acceptance_date,
    };

    localStorage.setItem('@CuritibaByNight:token', token);
    localStorage.setItem('@CuritibaByNight:user', JSON.stringify(rawUser));
    Cookies.set('@CuritibaByNight:refreshToken', refresh_token, {
      expires: 60,
      secure: true,
    });

    api.defaults.headers.Authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@CuritibaByNight:token');
    localStorage.removeItem('@CuritibaByNight:user');
    localStorage.removeItem('@CuritibaByNight:character');
    Cookies.remove('@CuritibaByNight:refreshToken', { secure: true });

    resetData();
  }, [resetData]);

  const updateUser = useCallback(
    (user: IUser) => {
      setData({
        token: data.token,
        user,
      });

      const rawUser: IUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        storyteller: user.storyteller,
        avatar_url: user.avatar_url,
        lgpd_acceptance_date: user.lgpd_acceptance_date,
      };

      localStorage.setItem('@CuritibaByNight:user', JSON.stringify(rawUser));
    },
    [data.token],
  );

  const setChar = useCallback((char: ICharacter) => {
    setCharacter(char);

    localStorage.setItem('@CuritibaByNight:character', JSON.stringify(char));
  }, []);

  const refreshMyToken = useCallback(async () => {
    const oldToken = localStorage.getItem('@CuritibaByNight:token');
    const refreshToken = Cookies.get('@CuritibaByNight:refreshToken');

    if (refreshToken && oldToken) {
      const response = await api.post('sessions/refresh', {
        token: oldToken,
        refresh_token: refreshToken,
      });

      const { token, refresh_token } = response.data;

      localStorage.setItem('@CuritibaByNight:token', token);
      Cookies.set('@CuritibaByNight:refreshToken', refresh_token, {
        expires: 60,
        secure: true,
      });

      api.defaults.headers.Authorization = `Bearer ${token}`;

      const newData = data;
      newData.token = token;

      setData(newData);
    }

    setIsTokenValidated(true);
  }, [data]);

  useEffect(() => {
    refreshMyToken();
  }, [refreshMyToken]);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        char: character,
        signIn,
        signOut,
        updateUser,
        setChar,
      }}
    >
      {isTokenValidated && children}
    </AuthContext.Provider>
  );
};

function useAuth(): IAuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
