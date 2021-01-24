/* eslint-disable camelcase */
import React, {
  useState,
  useCallback,
  useEffect,
  MouseEvent,
  HTMLAttributes,
} from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

import {
  TitleBox,
  Content,
  CharCardContainer,
  CharacterContainer,
  TableWrapper,
  Table,
  TableCell,
  ButtonBox,
} from './styles';

import Loading from '../Loading';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';
import CharacterCard from '../CharacterCard';
import ICharacter from '../CharacterList/ICharacter';
import Button from '../Button';

interface ILocation {
  id: string;
  name: string;
  description: string;
  elysium: string;
  property: string;
}

type IPanelProps = HTMLAttributes<HTMLDivElement> & {
  myChar: ICharacter;
  dashboard?: boolean;
};

const CharacterPanel: React.FC<IPanelProps> = ({
  myChar,
  dashboard = false,
}) => {
  const [locationsList, setLocationsList] = useState<ILocation[]>([]);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, signOut } = useAuth();
  const [isBusy, setBusy] = useState(true);
  const { isMobileVersion } = useMobile();
  // const isMobileVersion = true;

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
    loadLocations();
  }, [loadLocations, myChar]);

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <>
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
      <Content isMobile={isMobileVersion}>
        {isBusy ? (
          <Loading />
        ) : (
          <>
            {myChar && (
              <>
                <CharCardContainer isMobile={isMobileVersion}>
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
                    regnant={myChar.regnant ? myChar.regnant : ''}
                    locked={false}
                  />
                </CharCardContainer>
                <CharacterContainer isMobile={isMobileVersion}>
                  {isMobileVersion ? (
                    <>
                      <div>
                        <h1>{myChar.name}</h1>
                      </div>
                      <div>
                        <h1>{myChar.clan}</h1>
                      </div>
                      <div>
                        <span>
                          <br />
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h1>{myChar.name}</h1>
                        <h1>{myChar.clan}</h1>
                      </div>
                    </>
                  )}

                  {myChar.npc ? (
                    <div>
                      <strong>NPC</strong>
                    </div>
                  ) : (
                    <>
                      <div>
                        <strong>Experiêcia disponível:</strong>
                        <span>{myChar.experience}</span>
                      </div>
                      <div>
                        <strong>Jogador:</strong>
                        {dashboard ? (
                          <span>{user.name}</span>
                        ) : (
                          <span>{myChar.user && myChar.user.name}</span>
                        )}
                      </div>
                    </>
                  )}

                  {locationsList.length > 0 && (
                    <>
                      <div>
                        <strong>Locais conhecidos pelo personagem:</strong>
                      </div>
                      <TableWrapper isMobile={isMobileVersion}>
                        <Table isMobile={isMobileVersion}>
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

                  {!dashboard && (
                    <ButtonBox>
                      <Button type="button" onClick={handleGoBack}>
                        Retornar
                      </Button>
                    </ButtonBox>
                  )}
                </CharacterContainer>
              </>
            )}
          </>
        )}
      </Content>
    </>
  );
};

export default CharacterPanel;
