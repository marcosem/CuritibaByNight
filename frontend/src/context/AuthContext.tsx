import React, { createContext, useCallback } from 'react';
import api from '../services/api';

interface SingInCreadentials {
  email: string;
  password: string;
}

interface AuthContextState {
  name: string;
  signIn(credentials: SingInCreadentials): Promise<void>;
}

export const AuthContext = createContext<AuthContextState>(
  {} as AuthContextState,
);

export const AuthProvider: React.FC = ({ children }) => {
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    console.log(response.data);
  }, []);

  return (
    <AuthContext.Provider value={{ name: 'Marcos', signIn }}>
      {children}
    </AuthContext.Provider>
  );
};
