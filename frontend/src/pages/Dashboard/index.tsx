/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';

import 'react-confirm-alert/src/react-confirm-alert.css';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  Content,
  CharCardContainer,
  CharacterContainer,
} from './styles';
import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';

import Loading from '../../components/Loading';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';
import CharacterCard from '../../components/CharacterCard';
import ICharacter from '../../components/CharacterList/ICharacter';

const CharacterUpdate: React.FC = () => {
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

      <TitleBox>
        {myChar ? (
          <strong>Clique no nome do personagem para visualizar a ficha:</strong>
        ) : (
          <strong>
            Você não tem nenhum personagem ativo cadastrado, caso tenha um
            personagem, peça ao narrador para incluí-lo no sistema.
          </strong>
        )}
      </TitleBox>
      <Content>
        {isBusy ? (
          <Loading />
        ) : (
          <>
            {myChar && (
              <>
                <CharCardContainer>
                  <CharacterCard
                    charId={myChar.id}
                    name={myChar.name}
                    experience={myChar.experience}
                    sheetFile={myChar.character_url}
                    clan={myChar.clan}
                    title={myChar.title}
                    coterie={myChar.coterie}
                    avatar={myChar.avatar_url}
                    updatedAt={myChar.formatedDate ? myChar.formatedDate : ''}
                    npc={myChar.npc}
                    locked={false}
                  />
                </CharCardContainer>
                {!isMobileVersion && (
                  <CharacterContainer>
                    <div>
                      <h1>{myChar.name}</h1>
                      <h1>{myChar.clan}</h1>
                    </div>

                    <div>
                      <strong>Experiêcia disponível:</strong>
                      <span>{myChar.experience}</span>
                    </div>
                    <div>
                      <strong>Jogador:</strong>
                      <span>{user.name}</span>
                    </div>
                  </CharacterContainer>
                )}
              </>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default CharacterUpdate;
