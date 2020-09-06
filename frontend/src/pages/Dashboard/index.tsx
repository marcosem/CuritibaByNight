/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';

import { Container, Content, Character, CharTitle, CharSheet } from './styles';

import Header from '../../components/Header';
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
  showCharSheet?: boolean;
}

const Dashboard: React.FC = () => {
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [isBusy, setBusy] = useState(true);
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
              showCharSheet: false,
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
    loadCharacters();
  }, [loadCharacters]);

  const handleShowCharSheet = useCallback(
    (char: ICharacter) => {
      const newCharList = charList.map((character: ICharacter) => {
        const newChar = character;

        if (char.showCharSheet === false && newChar.id === char.id) {
          newChar.showCharSheet = true;
        } else {
          newChar.showCharSheet = false;
        }

        return newChar;
      });

      setCharList(newCharList);
    },
    [charList],
  );

  return (
    <Container>
      <Header />
      {!isBusy && (
        <Content>
          <div>
            <strong>Clique no personagem para visualizar sua ficha:</strong>
          </div>

          {charList.map(char => (
            <Character key={char.id} onClick={() => handleShowCharSheet(char)}>
              <CharTitle>
                <div>
                  <strong>Personagem:</strong>
                  <span>{char.name}</span>
                </div>
                <div>
                  <strong>XP Disponível:</strong>
                  <span>{char.experience}</span>
                </div>
                <div>
                  <strong>Última Atualização:</strong>
                  <span>{char.formatedDate}</span>
                </div>
              </CharTitle>
              <CharSheet>
                {char.showCharSheet && (
                  <iframe
                    title={char.name}
                    src={char.character_url}
                    width="100%"
                    height="660px"
                  />
                )}
              </CharSheet>
            </Character>
          ))}
        </Content>
      )}
    </Container>
  );
};

export default Dashboard;
