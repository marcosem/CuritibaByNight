/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { isMobile } from 'react-device-detect';
// import { FaCheckCircle, FaMinusCircle } from 'react-icons/fa';
import api from '../../services/api';

import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import Loading from '../../components/Loading';
import CharacterCard from '../../components/CharacterCard';

import { Container, TitleBox, Scroll, Content, Character } from './styles';
import { useToast } from '../../hooks/toast';

interface ICharacter {
  id: string;
  name: string;
  clan: string;
  avatar_url: string;
  experience: string;
  updated_at: Date;
  formatedDate: string;
  character_url: string;
  user: {
    id: string;
    name: string;
  };
}

const Players: React.FC = () => {
  const [charList, setCharList] = useState<[ICharacter[]]>([[]]);
  const [mobileVer, setMobile] = useState(false);
  const [isBusy, setBusy] = useState(true);

  const { addToast } = useToast();

  const loadCharacters = useCallback(async () => {
    setBusy(true);

    try {
      await api.get('characters/list').then(response => {
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
            formatedDate: format(new Date(char.updated_at), 'dd/MM/yyyy'),
            user: {
              id: char.user.id,
              name: char.user.name,
            },
          };
          return newChar;
        });

        const splitNum = mobileVer ? 1 : 4;

        const rowArray: [ICharacter[]] = [newArray.splice(0, splitNum)];
        while (newArray.length > 0) {
          rowArray.push(newArray.splice(0, splitNum));
        }

        setCharList(rowArray);
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        addToast({
          type: 'error',
          title: 'Erro ao tentar listar personagens',
          description: `Erro: '${message}'`,
        });
      }
    }
    setBusy(false);
  }, [addToast, mobileVer]);

  useEffect(() => {
    setMobile(isMobile);
    loadCharacters();
  }, [loadCharacters]);

  return (
    <Container>
      {mobileVer ? <HeaderMobile /> : <Header page="Painel de Personagens" />}
      {isBusy ? (
        <Loading />
      ) : (
        <Content isMobile={mobileVer}>
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
          <Scroll>
            <Character isMobile={mobileVer}>
              <table>
                <tbody>
                  {charList.map(row => (
                    <tr key={`row:${row[0].id}`}>
                      {row.map(char => (
                        <td key={char.id}>
                          <CharacterCard
                            charId={char.id}
                            name={char.name}
                            experience={char.experience}
                            sheetFile={char.character_url}
                            clan={char.clan}
                            avatar={char.avatar_url}
                            updatedAt={char.formatedDate}
                            isMobile={mobileVer}
                            locked
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Character>
          </Scroll>
        </Content>
      )}
    </Container>
  );
};

export default Players;
