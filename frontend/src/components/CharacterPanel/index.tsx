/* eslint-disable camelcase */
import React, {
  useState,
  useCallback,
  useEffect,
  MouseEvent,
  HTMLAttributes,
} from 'react';
import { useHistory, Link } from 'react-router-dom';
import {
  FiTrash2,
  FiChevronRight,
  FiChevronDown,
  FiRotateCcw,
  FiUpload,
} from 'react-icons/fi';
import { GiLoad, GiRollingDices } from 'react-icons/gi';
import api from '../../services/api';

import {
  TitleBox,
  Content,
  CharCardContainer,
  CharacterContainer,
  TextContainter,
  CharacterSheet,
  DataContainer,
  TableWrapper,
  Table,
  TableCell,
  ButtonBox,
  FunctionsContainer,
  FunctionLink,
  FunctionButton,
} from './styles';

import Loading from '../Loading';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';
import { useModalBox } from '../../hooks/modalBox';
import { useSelection } from '../../hooks/selection';
import { useSocket } from '../../hooks/socket';

import CharacterCard from '../CharacterCard';
import ICharacter from '../CharacterList/ICharacter';
import TraitsPanel from '../TraitsPanel';
import Button from '../Button';

interface ILocation {
  id: string;
  name: string;
  description: string;
  elysium: string;
  property: string;
  responsible: string;
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
  const [isBusy, setBusy] = useState(true);
  const [lastChar, setLastChar] = useState<ICharacter>();
  const [showTraits, setShowTraits] = useState<boolean>(false);
  const [showRetainers, setShowRetainers] = useState<boolean>(true);
  const [showLocals, setShowLocals] = useState<boolean>(true);
  const { addToast } = useToast();
  const { showModal } = useModalBox();
  const { setChar } = useSelection();
  const { resetTraits } = useSocket();
  const { user, char, signOut } = useAuth();
  const { isMobileVersion } = useMobile();
  const history = useHistory();

  const loadRetainers = useCallback(async () => {
    if (myChar === undefined) {
      return;
    }

    if (myChar.creature_type !== 'Vampire') {
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

        if (error.response.status !== 401) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar lacaios do personagens',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, myChar]);

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
              responsible: location.responsible,
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

        if (message?.indexOf('token') > 0 && error.response.status === 401) {
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

  const handleShowTraits = useCallback(() => {
    setShowTraits(!showTraits);
  }, [showTraits]);

  const handleShowRetainers = useCallback(() => {
    setShowRetainers(!showRetainers);
  }, [showRetainers]);

  const handleShowLocals = useCallback(() => {
    setShowLocals(!showLocals);
  }, [showLocals]);

  const handleResetTraits = useCallback(async () => {
    try {
      const requestData = {
        character_id: myChar.id,
        keep_masquerade: true,
      };

      const reqData = { data: requestData };

      await api.delete('/character/traits/reset', reqData);

      addToast({
        type: 'success',
        title: 'Traits Resetados',
        description: 'Os Traits do personagem foram resetados com sucesso!',
      });

      resetTraits(myChar.id);
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
          addToast({
            type: 'error',
            title: 'Erro ao tentar resetar os traits do perssonagem',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
  }, [addToast, myChar.id, resetTraits, signOut]);

  const handleConfirmResetTraits = useCallback(() => {
    if (myChar === undefined) {
      return;
    }
    showModal({
      type: 'warning',
      title: 'Confirmar reset dos traits',
      description: `Você está prestes a resetar os traits do personagem [${myChar.name}], você confirma?`,
      btn1Title: 'Sim',
      btn1Function: () => handleResetTraits(),
      btn2Title: 'Não',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      btn2Function: () => {},
    });
  }, [handleResetTraits, myChar, showModal]);

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

        if (message?.indexOf('token') > 0 && error.response.status === 401) {
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

    showModal({
      type: 'warning',
      title: 'Confirmar exclusão',
      description: `Você está prestes a excluir o personagem [${myChar.name}], você confirma?`,
      btn1Title: 'Sim',
      btn1Function: () => handleRemove(),
      btn2Title: 'Não',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      btn2Function: () => {},
    });
  }, [handleRemove, myChar, showModal]);

  const handleRetainerSelection = useCallback(
    async (e: MouseEvent<HTMLTableRowElement>) => {
      const retainerId = e.currentTarget.id;
      setRetainerList([]);

      const retainerChar = retainerList.find(ch => ch.id === retainerId);

      if (retainerChar) {
        if (!dashboard) {
          setLastChar(myChar);
        }

        setChar(retainerChar);
        setRetainerList([]);
        // history.push('/character');
        history.push(`/character/${retainerId}`);
      }
    },
    [dashboard, history, myChar, retainerList, setChar],
  );

  const handleLocationJump = useCallback(
    async (e: MouseEvent<HTMLTableRowElement>) => {
      const locationId = e.currentTarget.id;

      history.push(`/locals/${locationId}`);
    },
    [history],
  );

  const handleChallenges = useCallback(() => {
    history.push('/challenges');
  }, [history]);

  useEffect(() => {
    loadLocations();
    loadRetainers();
    // loadTraits();
  }, [loadLocations, loadRetainers, myChar]);

  const handleGoBack = useCallback(() => {
    if (lastChar !== undefined) {
      setLastChar(undefined);
      setRetainerList([]);
    }

    history.goBack();
  }, [history, lastChar]);

  return (
    <>
      <TitleBox>
        {myChar ? (
          <strong>
            {dashboard ? 'Painel do Jogador' : 'Painel do Personagem'}
          </strong>
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
                    creature_type={myChar.creature_type}
                    sect={myChar.sect}
                    title={myChar.title}
                    coterie={myChar.coterie}
                    avatar={myChar.avatar_url}
                    updatedAt={myChar.formatedDate ? myChar.formatedDate : ''}
                    npc={myChar.npc}
                    regnant={
                      myChar.regnant_char ? myChar.regnant_char.name : ''
                    }
                    situation={myChar.situation}
                    locked={
                      !(user.storyteller && myChar.npc) && char.id !== myChar.id
                    }
                  />
                  <CharacterSheet>
                    <div>
                      <a
                        href={myChar.character_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Baixar Ficha"
                      >
                        <GiLoad />
                        <span>Baixar Ficha</span>
                      </a>
                    </div>
                  </CharacterSheet>
                </CharCardContainer>
                <CharacterContainer isMobile={isMobileVersion}>
                  {isMobileVersion ? (
                    <>
                      <TextContainter isMobile={isMobileVersion}>
                        <h1>{myChar.name}</h1>
                      </TextContainter>
                      <TextContainter isMobile={isMobileVersion}>
                        <h1>{myChar.clan}</h1>
                      </TextContainter>
                      <TextContainter isMobile={isMobileVersion}>
                        <span>
                          <br />
                        </span>
                      </TextContainter>
                    </>
                  ) : (
                    <>
                      <TextContainter isMobile={isMobileVersion}>
                        <h1>{myChar.name}</h1>
                        <h1>{myChar.clan}</h1>
                      </TextContainter>
                    </>
                  )}

                  {myChar.npc && !myChar.regnant ? (
                    <TextContainter isMobile={isMobileVersion}>
                      <strong>NPC</strong>
                    </TextContainter>
                  ) : (
                    <>
                      {isMobileVersion ? (
                        <>
                          <TextContainter isMobile={isMobileVersion}>
                            <strong>Experiêcia Disponível:</strong>
                            <span>{myChar.experience}</span>
                          </TextContainter>
                          <TextContainter isMobile={isMobileVersion}>
                            <strong>Experiêcia Total:</strong>
                            <span>{myChar.experience_total}</span>
                          </TextContainter>
                        </>
                      ) : (
                        <TextContainter isMobile={isMobileVersion}>
                          <strong>Experiêcia Disponível:</strong>
                          <span>{myChar.experience}</span>
                          <strong>Experiêcia Total:</strong>
                          <span>{myChar.experience_total}</span>
                        </TextContainter>
                      )}

                      {!myChar.npc && (
                        <TextContainter isMobile={isMobileVersion}>
                          <strong>Jogador:</strong>
                          {dashboard ? (
                            <span>{user.name}</span>
                          ) : (
                            <span>{myChar.user && myChar.user.name}</span>
                          )}
                        </TextContainter>
                      )}
                    </>
                  )}
                  <DataContainer>
                    <button type="button" onClick={handleShowTraits}>
                      {showTraits ? <FiChevronDown /> : <FiChevronRight />}
                      <strong>Traits:</strong>
                    </button>
                    {showTraits && <TraitsPanel myChar={myChar} />}
                  </DataContainer>

                  {retainerList.length > 0 && (
                    <DataContainer>
                      <button type="button" onClick={handleShowRetainers}>
                        {showRetainers ? <FiChevronDown /> : <FiChevronRight />}
                        <strong>Meus Lacaios:</strong>
                      </button>
                      <TableWrapper
                        isMobile={isMobileVersion}
                        isVisible={showRetainers}
                      >
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
                                  <TableCell isMobile={isMobileVersion}>
                                    <span>{retainer.name}</span>
                                  </TableCell>
                                </td>
                                <td>
                                  <TableCell
                                    centered
                                    isMobile={isMobileVersion}
                                  >
                                    {retainer.creature_type === 'Mortal' ? (
                                      <span>{retainer.clan}</span>
                                    ) : (
                                      <>
                                        {retainer.clan ? (
                                          <span>{`${retainer.creature_type}: ${retainer.clan}`}</span>
                                        ) : (
                                          <span>{retainer.creature_type}</span>
                                        )}
                                      </>
                                    )}
                                  </TableCell>
                                </td>
                                <td>
                                  <TableCell
                                    centered
                                    isMobile={isMobileVersion}
                                  >
                                    <span>{retainer.retainer_level}</span>
                                  </TableCell>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </TableWrapper>
                    </DataContainer>
                  )}

                  {locationsList.length > 0 && (
                    <DataContainer>
                      <button type="button" onClick={handleShowLocals}>
                        {showLocals ? <FiChevronDown /> : <FiChevronRight />}
                        <strong>Locais Conhecidos por mim:</strong>
                      </button>
                      <TableWrapper
                        isMobile={isMobileVersion}
                        isVisible={showLocals}
                      >
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
                                {local.responsible === myChar.id ? (
                                  <>
                                    <td>
                                      <TableCell isMobile={isMobileVersion}>
                                        <strong>{local.name}</strong>
                                      </TableCell>
                                    </td>
                                    <td>
                                      <TableCell isMobile={isMobileVersion}>
                                        <strong>{local.description}</strong>
                                      </TableCell>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td>
                                      <TableCell isMobile={isMobileVersion}>
                                        <span>{local.name}</span>
                                      </TableCell>
                                    </td>
                                    <td>
                                      <TableCell isMobile={isMobileVersion}>
                                        <span>{local.description}</span>
                                      </TableCell>
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </TableWrapper>
                    </DataContainer>
                  )}

                  {!dashboard && (
                    <ButtonBox isMobile={isMobileVersion}>
                      <Button type="button" onClick={handleGoBack}>
                        Retornar
                      </Button>
                    </ButtonBox>
                  )}

                  <FunctionsContainer>
                    {dashboard && (
                      <FunctionButton
                        type="button"
                        onClick={handleChallenges}
                        title="Rolar Jan-Ken-Po"
                        isGreen
                      >
                        <GiRollingDices />
                      </FunctionButton>
                    )}

                    {user.storyteller && showTraits && (
                      <FunctionButton
                        type="button"
                        onClick={handleConfirmResetTraits}
                        title="Resetar Traits"
                      >
                        <FiRotateCcw />
                      </FunctionButton>
                    )}

                    {user.storyteller && !dashboard && (
                      <>
                        {!isMobileVersion && (
                          <FunctionLink middle={showTraits}>
                            <Link
                              to={`/updatechar/${myChar.npc ? 'npc' : 'pc'}/${
                                myChar.id
                              }`}
                              title="Atualizar Personagem"
                            >
                              <FiUpload />
                            </Link>
                          </FunctionLink>
                        )}
                        <FunctionButton
                          type="button"
                          onClick={handleConfirmRemove}
                          title="Excluir Personagem"
                        >
                          <FiTrash2 />
                        </FunctionButton>
                      </>
                    )}
                  </FunctionsContainer>
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
