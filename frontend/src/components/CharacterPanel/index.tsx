/* eslint-disable camelcase */
import React, {
  useState,
  useCallback,
  useEffect,
  MouseEvent,
  HTMLAttributes,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
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
  RemoveButton,
} from './styles';

import Loading from '../Loading';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';
import { useSelection } from '../../hooks/selection';
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
  const [retainerList, setRetainerList] = useState<ICharacter[]>([]);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, char, signOut } = useAuth();
  const { setChar } = useSelection();
  const [isBusy, setBusy] = useState(true);
  const { isMobileVersion } = useMobile();
  // const isMobileVersion = true;

  const loadRetainers = useCallback(async () => {
    if (myChar === undefined) {
      return;
    }

    if (
      myChar.clan.indexOf('Ghoul') >= 0 ||
      myChar.clan.indexOf('Retainer') >= 0 ||
      myChar.clan.indexOf('Wraith') >= 0
    ) {
      return;
    }

    setBusy(true);

    try {
      await api
        .post('/character/retainerslist', { character_id: myChar.id })
        .then(response => {
          const res: ICharacter[] = response.data;

          const retList = res.map(ch => {
            const newChar = ch;

            let filteredClan: string[];
            if (newChar.clan) {
              filteredClan = newChar.clan.split(' (');
              filteredClan = filteredClan[0].split(':');
            } else {
              filteredClan = [''];
            }

            const clanIndex = 0;
            newChar.clan = filteredClan[clanIndex];

            const retainerLevel = parseInt(newChar.retainer_level, 10);
            let newRetainerLevel: number;

            if (retainerLevel >= 10) {
              newRetainerLevel = retainerLevel / 10;
            } else {
              newRetainerLevel = retainerLevel;
            }

            newChar.retainer_level = `${newRetainerLevel}`;

            return newChar;
          });

          setRetainerList(retList);
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
            title: 'Erro ao tentar listar lacaios do personagens',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, myChar, signOut]);

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

  const handleRemove = useCallback(async () => {
    try {
      const requestData = {
        character_id: myChar.id,
      };

      const reqData = { data: requestData };

      await api.delete('/character/remove', reqData);

      addToast({
        type: 'success',
        title: 'Personagem excluído',
        description: 'Personagem excluído com sucesso!',
      });

      history.goBack();
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
            title: 'Erro ao tentar exluir o perssonagem',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
  }, [addToast, history, myChar.id, signOut]);

  const handleConfirmRemove = useCallback(() => {
    if (myChar === undefined) {
      return;
    }

    confirmAlert({
      title: 'Confirmar exclusão',
      message: `Você está prestes a excluir o personagem [${myChar.name}], você confirma?`,
      buttons: [
        {
          label: 'Sim',
          onClick: () => handleRemove(),
        },
        {
          label: 'Não',
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onClick: () => {},
        },
      ],
    });
  }, [handleRemove, myChar]);

  const handleRetainerSelection = useCallback(
    async (e: MouseEvent<HTMLTableRowElement>) => {
      const retainerId = e.currentTarget.id;
      const retainerChar = retainerList.find(ch => ch.id === retainerId);

      if (retainerChar) {
        setChar(retainerChar);
        setRetainerList([]);
        history.push('/character');
      }
    },
    [history, retainerList, setChar],
  );

  const handleLocationJump = useCallback(
    async (e: MouseEvent<HTMLTableRowElement>) => {
      const locationId = e.currentTarget.id;

      history.push(`/locals/${locationId}`);
    },
    [history],
  );

  useEffect(() => {
    loadLocations();
    loadRetainers();
  }, [loadLocations, loadRetainers, myChar]);

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
                    regnant={
                      myChar.regnant_char ? myChar.regnant_char.name : ''
                    }
                    locked={
                      !(user.storyteller && myChar.npc) && char.id !== myChar.id
                    }
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

                  {myChar.npc && !myChar.regnant ? (
                    <div>
                      <strong>NPC</strong>
                    </div>
                  ) : (
                    <>
                      {isMobileVersion ? (
                        <>
                          <div>
                            <strong>Experiêcia Disponível:</strong>
                            <span>{myChar.experience}</span>
                          </div>
                          <div>
                            <strong>Experiêcia Total:</strong>
                            <span>{myChar.experience_total}</span>
                          </div>
                        </>
                      ) : (
                        <div>
                          <strong>Experiêcia Disponível:</strong>
                          <span>{myChar.experience}</span>
                          <strong>Experiêcia Total:</strong>
                          <span>{myChar.experience_total}</span>
                        </div>
                      )}

                      {!myChar.npc && (
                        <div>
                          <strong>Jogador:</strong>
                          {dashboard ? (
                            <span>{user.name}</span>
                          ) : (
                            <span>{myChar.user && myChar.user.name}</span>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {retainerList.length > 0 && (
                    <>
                      <div>
                        <strong>Meus Lacaios:</strong>
                      </div>
                      <TableWrapper isMobile={isMobileVersion}>
                        <Table isMobile={isMobileVersion}>
                          <thead>
                            <tr>
                              <th>Lacaio</th>
                              <th>Tipo</th>
                              <th>Pontos</th>
                            </tr>
                          </thead>
                          <tbody>
                            {retainerList.map(retainer => (
                              <tr
                                key={retainer.id}
                                id={retainer.id}
                                onClick={handleRetainerSelection}
                              >
                                <td>
                                  <TableCell>{retainer.name}</TableCell>
                                </td>
                                <td>
                                  <TableCell centered>
                                    {retainer.clan}
                                  </TableCell>
                                </td>
                                <td>
                                  <TableCell centered>
                                    {retainer.retainer_level}
                                  </TableCell>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </TableWrapper>
                    </>
                  )}

                  {locationsList.length > 0 && (
                    <>
                      <div>
                        <strong>Locais Conhecidos por mim:</strong>
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
                    <ButtonBox isMobile={isMobileVersion}>
                      <Button type="button" onClick={handleGoBack}>
                        Retornar
                      </Button>
                    </ButtonBox>
                  )}

                  {user.storyteller && !dashboard && (
                    <RemoveButton type="button" onClick={handleConfirmRemove}>
                      <FiTrash2 />
                    </RemoveButton>
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
