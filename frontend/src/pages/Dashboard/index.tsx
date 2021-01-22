/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../../services/api';

import { Container } from './styles';
import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';
import Loading from '../../components/Loading';
import ICharacter from '../../components/CharacterList/ICharacter';
import CharacterPanel from '../../components/CharacterPanel';

const Dashboard: React.FC = () => {
  const [myChar, setMyChar] = useState<ICharacter>();
  const { addToast } = useToast();
  const { user, signOut, setChar } = useAuth();
  const [isBusy, setBusy] = useState(true);
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
          const char: ICharacter = res[0];

          char.formatedDate = format(new Date(char.updated_at), 'dd/MM/yyyy');

          let filteredClan: string[];
          if (char.clan) {
            filteredClan = char.clan.split(' (');
          } else {
            filteredClan = [''];
          }

          const clanIndex = 0;
          char.clan = filteredClan[clanIndex];

          setMyChar(char);
          setChar(char);
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
  }, [addToast, setChar, signOut, user.id]);

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
        myChar && <CharacterPanel myChar={myChar} dashboard />
      )}
    </Container>
  );
};

export default Dashboard;
