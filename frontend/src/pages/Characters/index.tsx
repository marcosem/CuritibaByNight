/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import api from '../../services/api';

import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import Loading from '../../components/Loading';

import { Container, TitleBox, Content } from './styles';
import CharacterList from '../../components/CharacterList';
import ICharacter from '../../components/CharacterList/ICharacter';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';

const Characters: React.FC = () => {
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [isBusy, setBusy] = useState(true);
  const { signOut } = useAuth();
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();

  const loadCharacters = useCallback(async () => {
    setBusy(true);

    try {
      await api.get('characters/list').then(response => {
        const res = response.data;
        setCharList(res);
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message.indexOf('token') > 0 && error.response.status === 401) {
          addToast({
            type: 'error',
            title: 'Sessão Expirada',
            description: 'Sessão de usuário expirada, faça o login novamente!',
          });

          signOut();
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar personagens',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, signOut]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  return (
    <Container>
      {isMobileVersion ? (
        <HeaderMobile page="characters" />
      ) : (
        <Header page="characters" />
      )}
      {isBusy ? (
        <Loading />
      ) : (
        <Content isMobile={isMobileVersion}>
          <TitleBox>
            {charList.length > 0 ? (
              <strong>
                Clique no nome do personagem para visualizar a ficha:
              </strong>
            ) : (
              <strong>
                Não foi encontrado nenhum personagem na base de dados.
              </strong>
            )}
          </TitleBox>
          <CharacterList chars={charList} locked />
        </Content>
      )}
    </Container>
  );
};

export default Characters;
