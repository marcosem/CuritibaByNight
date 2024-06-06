/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect, HTMLAttributes } from 'react';
import { useHistory, Link } from 'react-router-dom';
import {
  FiTrash2,
  FiChevronRight,
  FiChevronDown,
  FiUpload,
  FiEye,
} from 'react-icons/fi';
import { GiLoad, GiPositionMarker /* ,GiRollingDices */ } from 'react-icons/gi';

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
import CbNTable, { ICbNTable, ICbNRow, ICbNAction } from '../CbNTable';

interface ILocation {
  id: string;
  name: string;
  description: string;
  elysium: string;
  property: string;
  responsible: string;
  shared: boolean;
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
        .post('/character/retainerslist', {
          character_id: myChar.id,
          situation: myChar.situation === 'active' ? myChar.situation : 'all',
        })
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
      const parsedError: any = error;

      if (parsedError.response) {
        const { message } = parsedError.response.data;

        if (parsedError.response.status !== 401) {
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
              shared: location.shared,
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
      const parsedError: any = error;

      if (parsedError.response) {
        const { message } = parsedError.response.data;

        if (
          message?.indexOf('token') > 0 &&
          parsedError.response.status === 401
        ) {
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
      const parsedError: any = error;

      if (parsedError.response) {
        const { message } = parsedError.response.data;

        if (
          message?.indexOf('token') > 0 &&
          parsedError.response.status === 401
        ) {
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
      const parsedError: any = error;

      if (parsedError.response) {
        const { message } = parsedError.response.data;

        if (
          message?.indexOf('token') > 0 &&
          parsedError.response.status === 401
        ) {
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
    async rtId => {
      const retainerId = rtId;
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

  const handleLocationPosition = useCallback(
    (e: string) => {
      const locationId = e;

      history.push(`/locals/${locationId}`);
    },
    [history],
  );

  const handleLocationDetails = useCallback(
    (e: string) => {
      const locationId = e;

      history.push(`/localdetails/${locationId}`);
    },
    [history],
  );

  /*
  const handleChallenges = useCallback(() => {
    history.push('/challenges');
  }, [history]);
  */

  const drawRetainerTable = useCallback(
    (rtList: ICharacter[]) => {
      const tableData: ICbNTable = {
        header: [
          {
            title: 'Lacaios',
            align: 'left',
          },
          {
            title: 'Tipo',
            align: 'center',
          },
          {
            title: 'Pontos',
            align: 'center',
          },
        ],
        rows: rtList.map(rt => {
          let rtType;

          if (rt.creature_type === 'Mortal') {
            rtType = rt.clan;
          } else if (rt.clan) {
            rtType = `${rt.creature_type}: ${rt.clan}`;
          } else {
            rtType = rt.creature_type;
          }

          const newRow: ICbNRow = {
            id: rt.id,
            columns: [rt.name, rtType, rt.retainer_level],
            onClick: () => handleRetainerSelection(rt.id),
          };

          return newRow;
        }),
        haveActions: false,
        isBusy,
      };

      return (
        <CbNTable
          header={tableData.header}
          rows={tableData.rows}
          haveActions={tableData.haveActions}
          isBusy={tableData.isBusy}
        />
      );
    },
    [handleRetainerSelection, isBusy],
  );

  const drawLocationTable = useCallback(
    (locList: ILocation[]) => {
      const tableData: ICbNTable = {
        header: [
          {
            title: 'Local',
            align: 'left',
          },
          {
            title: 'Descrição',
            align: 'left',
          },
          {
            title: 'Ações',
            align: 'center',
          },
        ],
        rows: locList.map(loc => {
          let rowTitle;
          let bold;
          if (loc.responsible === myChar.id) {
            rowTitle = 'Proprietário';
          } else if (loc.shared) {
            rowTitle = 'Co-Proprietário';
          } else {
            rowTitle = 'Conhece o Local';
          }

          let actions: ICbNAction[];
          if (loc.responsible === myChar.id || loc.shared) {
            bold = true;
            actions = [
              {
                title: 'Ver no mapa',
                Icon: GiPositionMarker,
                onClick: () => handleLocationPosition(loc.id),
              },
              {
                title: 'Detalhes',
                Icon: FiEye,
                onClick: () => handleLocationDetails(loc.id),
              },
            ];
          } else {
            bold = false;
            actions = [
              {
                title: 'Ver no mapa',
                Icon: GiPositionMarker,
                onClick: () => handleLocationPosition(loc.id),
              },
            ];
          }

          const newLoc: ICbNRow = {
            id: loc.id,
            title: rowTitle,
            bold,
            columns: [loc.name, loc.description],
            actions,
          };

          return newLoc;
        }),
        haveActions: true,
        isBusy,
      };

      return (
        <CbNTable
          header={tableData.header}
          rows={tableData.rows}
          haveActions={tableData.haveActions}
          isBusy={tableData.isBusy}
        />
      );
    },
    [handleLocationDetails, handleLocationPosition, isBusy, myChar.id],
  );

  useEffect(() => {
    loadLocations();
    loadRetainers();
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

                  <ButtonBox isMobile={isMobileVersion} small>
                    <Button onClick={handleShowTraits} disabled={showTraits}>
                      Mostrar Traits
                    </Button>
                  </ButtonBox>

                  <TraitsPanel
                    myChar={myChar}
                    open={showTraits}
                    handleClose={handleShowTraits}
                    handleReset={handleConfirmResetTraits}
                  />

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
                        {drawRetainerTable(retainerList)}
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
                        {drawLocationTable(locationsList)}
                      </TableWrapper>
                    </DataContainer>
                  )}

                  {!dashboard && (
                    <ButtonBox isMobile={isMobileVersion}>
                      <Button onClick={handleGoBack}>Retornar</Button>
                    </ButtonBox>
                  )}

                  <FunctionsContainer>
                    {dashboard && (
                      <>
                        {/* <FunctionButton
                      onClick={handleChallenges}
                      title="Rolar Jan-Ken-Po"
                      isGreen
                    >
                      <GiRollingDices />
                    </FunctionButton> */}
                      </>
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
