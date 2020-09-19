/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { Container, TitleBox, Scroll, Content, Character } from './styles';

import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import CharacterCard from '../../components/CharacterCard';
import Loading from '../../components/Loading';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';

interface ICharacter {
  id: string;
  name: string;
  clan: string;
  avatar_url: string;
  experience: string;
  updated_at: Date;
  situation: string;
  formatedDate: string;
  character_url: string;
}

const Dashboard: React.FC = () => {
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [isBusy, setBusy] = useState(true);
  const { user, signOut } = useAuth();
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
          const newArray = res.map((char: ICharacter) => {
            const newChar = {
              id: char.id,
              name: char.name,
              experience: char.experience,
              updated_at: new Date(char.updated_at),
              character_url: char.character_url,
              clan: char.clan,
              avatar_url: char.avatar_url,
              situation: char.situation,
              formatedDate: format(new Date(char.updated_at), 'dd/MM/yyyy'),
            };
            return newChar;
          });

          setCharList(newArray);
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
  }, [addToast, signOut, user.id]);

  useEffect(() => {
    // setMobile(true);
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
                Você não tem nenhum personagem cadastrado, caso tenha um
                personagem, peça ao narrador para incluí-lo no sistema.
              </strong>
            )}
          </TitleBox>
          <Scroll>
            <Character isMobile={isMobileVersion}>
              {charList.map(char => (
                <CharacterCard
                  key={char.id}
                  charId={char.id}
                  name={char.name}
                  experience={char.experience}
                  sheetFile={char.character_url}
                  clan={char.clan}
                  avatar={char.avatar_url}
                  updatedAt={char.formatedDate}
                  situation={char.situation}
                />
              ))}
            </Character>
          </Scroll>
        </Content>
      )}
    </Container>
  );
};

export default Dashboard;
