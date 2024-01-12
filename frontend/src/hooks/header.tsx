import React, { createContext, useContext, useState, useCallback } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { useAuth } from './auth';

interface IHeaderContextData {
  setCurrentPage(myPage: string, hidden?: boolean): void;
  getCurrentPage(): string;
}

const HeaderContext = createContext<IHeaderContextData>(
  {} as IHeaderContextData,
);

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    'header'
    'main'
    'footer';
`;

const HeaderProvider: React.FC = ({ children }) => {
  const [page, setPage] = useState<string>('dashboard');
  const [disabled, setDisabled] = useState<boolean>(false);
  const { user } = useAuth();

  const setCurrentPage = useCallback((myPage: string, hidden = false) => {
    setPage(myPage);
    setDisabled(hidden);
  }, []);

  const getCurrentPage = useCallback(() => {
    return page;
  }, [page]);

  return (
    <HeaderContext.Provider value={{ setCurrentPage, getCurrentPage }}>
      <Container>
        {user !== undefined && !disabled && <Header />}
        {children}
        {user !== undefined && !disabled && <Footer />}
      </Container>
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
