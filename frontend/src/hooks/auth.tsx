/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable camelcase */

import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  storyteller: boolean;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: IUser;
}

interface SingInCreadentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: IUser;
  signIn(credentials: SingInCreadentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  // Initilizing token if it is in the local storage
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@CuritibaByNight:token');
    const user = localStorage.getItem('@CuritibaByNight:user');

    if (token && user) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@CuritibaByNight:token', token);
    localStorage.setItem('@CuritibaByNight:user', JSON.stringify(user));

    api.defaults.headers.Authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@CuritibaByNight:token');
    localStorage.removeItem('@CuritibaByNight:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
