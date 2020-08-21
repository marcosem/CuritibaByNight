import React, { createContext, useCallback, useState } from 'react';
import api from '../services/api';

interface AuthState {
  token: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  user: object;
}

interface SingInCreadentials {
  email: string;
  password: string;
}

interface AuthContextState {
  // eslint-disable-next-line @typescript-eslint/ban-types
  user: object;
  signIn(credentials: SingInCreadentials): Promise<void>;
}

export const AuthContext = createContext<AuthContextState>(
  {} as AuthContextState,
);

export const AuthProvider: React.FC = ({ children }) => {
  // Initilizing token if it is in the local storage
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@CuritibaByNight:token');
    const user = localStorage.getItem('@CuritibaByNight:user');

    if (token && user) {
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

    setData({ token, user });
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};
