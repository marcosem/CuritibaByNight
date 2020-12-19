/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import { Container, TitleBox, Content } from './styles';

import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import CharacterList from '../../components/CharacterList';
import ICharacter from '../../components/CharacterList/ICharacter';

import Loading from '../../components/Loading';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';

const Dashboard: React.FC = () => {
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [isBusy, setBusy] = useState(true);
  const { user, signOut, setChar } = useAuth();
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();

  const loadCharacters = useCallback(async () => {
    setBusy(true);

    try {
      await api
        .post('character/list', {
          player_id: user.id,
        })
        .then(response => {
          const res = response.data;
          setCharList(res);
          setChar(res[0]);
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
        }
      }
    }
    setBusy(false);
  }, [addToast, signOut, user.id, setChar]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  return (
    <Container>
      {isMobileVersion ? (
        <HeaderMobile page="dashboard" />
      ) : (
        <Header page="dashboard" />
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
                Você não tem nenhum personagem ativo cadastrado, caso tenha um
                personagem, peça ao narrador para incluí-lo no sistema.
              </strong>
            )}
          </TitleBox>
          {charList.length > 0 && <CharacterList chars={charList} />}
        </Content>
      )}
    </Container>
  );
};

export default Dashboard;
