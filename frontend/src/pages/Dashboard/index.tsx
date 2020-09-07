/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { isMobile } from 'react-device-detect';
import { Container, Content, Character } from './styles';

import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import CharacterCard from '../../components/CharacterCard';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

interface ICharacter {
  id: string;
  name: string;
  experience: string;
  updated_at: Date;
  formatedDate?: string;
  character_url: string;
}

const Dashboard: React.FC = () => {
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [isBusy, setBusy] = useState(true);
  const [mobileVer, setMobile] = useState(false);
  const { user, signOut } = useAuth();

  const { addToast } = useToast();

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
    setMobile(isMobile);
    loadCharacters();
  }, [loadCharacters]);

  return (
    <Container>
      {mobileVer ? <HeaderMobile /> : <Header />}

      {!isBusy && (
        <Content isMobile={mobileVer}>
          <div>
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
          </div>

          <Character isMobile={mobileVer}>
            {charList.map(char => (
              <CharacterCard
                key={char.id}
                name={char.name}
                experience={char.experience}
                sheetFile={char.character_url}
                updatedAt={char.formatedDate}
                isMobile={mobileVer}
              />
            ))}
            <div />
          </Character>
        </Content>
      )}
    </Container>
  );
};

export default Dashboard;
