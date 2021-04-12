/* eslint-disable camelcase */
import React, { useEffect, useCallback, useState } from 'react';
import { format } from 'date-fns';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import { Container } from './styles';
import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';

import { useAuth } from '../../hooks/auth';
import { useMobile } from '../../hooks/mobile';
import { useToast } from '../../hooks/toast';
import { useSelection } from '../../hooks/selection';
import Loading from '../../components/Loading';
import ICharacter from '../../components/CharacterList/ICharacter';
import CharacterPanel from '../../components/CharacterPanel';

interface IRouteParams {
  charId: string;
}

const CharacterDetails: React.FC = () => {
  const { charId } = useParams<IRouteParams>();
  const { addToast } = useToast();
  const [myChar, setMyChar] = useState<ICharacter>();
  const { signOut } = useAuth();
  const { char } = useSelection();
  const [isBusy, setBusy] = useState(false);
  const { isMobileVersion } = useMobile();
  const history = useHistory();

  const loadCharacter = useCallback(async () => {
    try {
      setBusy(true);
      await api.get(`character/${charId}`).then(response => {
        const resChar: ICharacter = response.data;

        resChar.formatedDate = format(
          new Date(resChar.updated_at),
          'dd/MM/yyyy',
        );

        let filteredClan: string[];
        if (resChar.clan) {
          filteredClan = resChar.clan.split(' (');
          filteredClan = filteredClan[0].split(':');
        } else {
          filteredClan = [''];
        }

        const clanIndex = 0;
        resChar.clan = filteredClan[clanIndex];

        setMyChar(resChar);
      });
      setBusy(false);
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message?.indexOf('token') > 0 && error.response.status === 401) {
          addToast({
            type: 'error',
            title: 'Sessão Expirada',
            description: 'Sessão de usuário expirada, faça o login novamente!',
          });

          signOut();
        } else {
          if (error.response.status === 401) {
            addToast({
              type: 'error',
              title: 'Usuário Não Autorizado',
              description:
                'Somente Narrador tem permissão para ver este personagem!',
            });
          } else {
            addToast({
              type: 'error',
              title: 'Personagem Inválido',
              description: 'Personagem não encontrado ou inválido!',
            });
          }

          history.push('/');
        }
      }
    }
  }, [addToast, charId, history, signOut]);

  useEffect(() => {
    if (char?.id === charId) {
      setMyChar(char);
    } else if (charId) {
      loadCharacter();
    } else {
      history.push('/');
    }
  }, [char, charId, history, loadCharacter]);

  return (
    <Container>
      {isMobileVersion ? (
        <HeaderMobile page="character" />
      ) : (
        <Header page="character" />
      )}

      {isBusy ? <Loading /> : myChar && <CharacterPanel myChar={myChar} />}
    </Container>
  );
};

export default CharacterDetails;
