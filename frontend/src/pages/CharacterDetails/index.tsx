/* eslint-disable camelcase */
import React, { useEffect, useCallback, useState } from 'react';
import { format } from 'date-fns';
import { useHistory, useParams } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';
import { Container, NavigateButton } from './styles';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useSelection } from '../../hooks/selection';
import { useHeader } from '../../hooks/header';
import { useMobile } from '../../hooks/mobile';
import Loading from '../../components/Loading';
import ICharacter from '../../components/CharacterList/ICharacter';
import CharacterPanel from '../../components/CharacterPanel';

interface IRouteParams {
  charId: string;
}

const CharacterDetails: React.FC = () => {
  const { charId } = useParams<IRouteParams>();
  const { addToast } = useToast();
  const { signOut, user } = useAuth();
  const {
    char,
    charInfoList,
    getNextCharInfo,
    getPreviewsCharInfo,
    initializeCharInfoList,
  } = useSelection();
  const { setCurrentPage } = useHeader();
  const { isMobileVersion } = useMobile();
  const history = useHistory();
  const [myChar, setMyChar] = useState<ICharacter>();
  const [nextCharId, setNextCharId] = useState<string>('');
  const [previewsCharId, setPreviewsCharId] = useState<string>('');

  const [isBusy, setBusy] = useState(false);

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

  const handleMoveToPreviewsCharacter = useCallback(() => {
    history.push(`/character/${previewsCharId}`);
  }, [history, previewsCharId]);

  const handleMoveToNextCharacter = useCallback(() => {
    history.push(`/character/${nextCharId}`);
  }, [history, nextCharId]);

  useEffect(() => {
    if (user.storyteller) {
      initializeCharInfoList();
      setNextCharId(getNextCharInfo(charId));
      setPreviewsCharId(getPreviewsCharInfo(charId));
    }
  }, [
    charId,
    getNextCharInfo,
    getPreviewsCharInfo,
    initializeCharInfoList,
    user,
  ]);

  useEffect(() => {
    setCurrentPage('character');

    if (char?.id === charId) {
      setMyChar(char);
    } else if (charId) {
      loadCharacter();
    } else {
      history.push('/');
    }
  }, [char, charId, history, loadCharacter, setCurrentPage]);

  return (
    <Container isMobile={isMobileVersion}>
      {isBusy ? (
        <Loading />
      ) : (
        myChar && (
          <>
            {user.storyteller &&
              charInfoList.length > 0 &&
              previewsCharId !== charId && (
                <NavigateButton
                  onClick={handleMoveToPreviewsCharacter}
                  title="Personagem Anterior"
                  position="left"
                >
                  <FiChevronLeft />
                </NavigateButton>
              )}

            <CharacterPanel myChar={myChar} />

            {user.storyteller &&
              charInfoList.length > 0 &&
              nextCharId !== charId && (
                <NavigateButton
                  onClick={handleMoveToNextCharacter}
                  title="Próximo Personagem"
                  position="right"
                >
                  <FiChevronRight />
                </NavigateButton>
              )}
          </>
        )
      )}
    </Container>
  );
};

export default CharacterDetails;
