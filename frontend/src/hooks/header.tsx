import React, { createContext, useContext, useState, useCallback } from 'react';
import Header from '../components/Header';

import { useAuth } from './auth';

interface IHeaderContextData {
  setCurrentPage(myPage: string, hidden?: boolean): void;
}

const HeaderContext = createContext<IHeaderContextData>(
  {} as IHeaderContextData,
);

const HeaderProvider: React.FC = ({ children }) => {
  const [page, setPage] = useState<string>('dashboard');
  const [disabled, setDisabled] = useState<boolean>(false);
  const { user } = useAuth();

  const setCurrentPage = useCallback((myPage: string, hidden = false) => {
    setPage(myPage);
    setDisabled(hidden);
  }, []);

  return (
    <HeaderContext.Provider value={{ setCurrentPage }}>
      {user !== undefined && !disabled && <Header page={page} />}
      {children}
    </HeaderContext.Provider>
  );
};

function useHeader(): IHeaderContextData {
  const context = useContext(HeaderContext);

  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }

  return context;
}

export { HeaderProvider, useHeader };
