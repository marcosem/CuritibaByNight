/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';

import 'react-confirm-alert/src/react-confirm-alert.css';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  Content,
  CharCardContainer,
  CharacterContainer,
  TableWrapper,
  Table,
  TableCell,
} from './styles';
import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';

import Loading from '../../components/Loading';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';
import CharacterCard from '../../components/CharacterCard';
import ICharacter from '../../components/CharacterList/ICharacter';

interface ILocation {
  id: string;
  name: string;
  description: string;
  elysium: string;
  property: string;
}

const CharacterUpdate: React.FC = () => {
  const [myChar, setMyChar] = useState<ICharacter>();
  const [locationsList, setLocationsList] = useState<ILocation[]>([]);
  const { addToast } = useToast();
  const history = useHistory();
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

  const loadLocations = useCallback(async () => {
    if (myChar === undefined) {
      return;
    }

    setBusy(true);

    try {
      await api
        .post('locations/list', {
          char_id: myChar.id,
        })
        .then(response => {
          const res = response.data;

          const newArray = res.map((location: ILocation) => {
            const newLocation: ILocation = {
              id: location.id,
              name: location.name,
              description: location.description,
              elysium: location.elysium,
              property: location.property,
            };

            return newLocation;
          });

          newArray.sort((a: ILocation, b: ILocation) => {
            const nameA = a
              ? a.name
                  .toUpperCase()
                  .replace(/[ÁÀÃÂ]/gi, 'A')
                  .replace(/[ÉÊ]/gi, 'E')
                  .replace(/[Í]/gi, 'I')
                  .replace(/[ÓÔÕ]/gi, 'O')
                  .replace(/[Ú]/gi, 'U')
              : '';
            const nameB = b
              ? b.name
                  .toUpperCase()
                  .replace(/[ÁÀÃÂ]/gi, 'A')
                  .replace(/[ÉÊ]/gi, 'E')
                  .replace(/[Í]/gi, 'I')
                  .replace(/[ÓÔÕ]/gi, 'O')
                  .replace(/[Ú]/gi, 'U')
              : '';

            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            return 0;
          });

          setLocationsList(newArray);
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
            title: 'Erro ao tentar listar os locais',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, myChar, signOut]);

  const handleLocationJump = useCallback(
    async (e: MouseEvent<HTMLTableRowElement>) => {
      const locationId = e.currentTarget.id;

      history.push(`/locals/${locationId}`);
    },
    [history],
  );

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  useEffect(() => {
    if (myChar !== undefined) {
      loadLocations();
    }
  }, [loadLocations, myChar]);

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
                    {locationsList.length > 0 && (
                      <>
                        <div>
                          <strong>
                            <br />
                            Locais conhecidos pelo personagem:
                          </strong>
                        </div>
                        <TableWrapper>
                          <Table>
                            <thead>
                              <tr>
                                <th>Local</th>
                                <th>Descrição</th>
                              </tr>
                            </thead>
                            <tbody>
                              {locationsList.map(local => (
                                <tr
                                  key={local.id}
                                  id={local.id}
                                  onClick={handleLocationJump}
                                >
                                  <td>
                                    <TableCell>{local.name}</TableCell>
                                  </td>
                                  <td>
                                    <TableCell>{local.description}</TableCell>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </TableWrapper>
                      </>
                    )}
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
