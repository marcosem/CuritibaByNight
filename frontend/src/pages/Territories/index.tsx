/* eslint-disable camelcase */
import React, {
  useCallback,
  useEffect,
  useState,
  MouseEvent,
  useRef,
} from 'react';
import { FiEdit, FiSave, FiX, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  DomainMasqueradeBox,
  TablesContainer,
  TableWrapper,
  Table,
  TableHeaderCell,
  TableCell,
  TableEditCell,
  ActionsContainer,
  ActionButton,
} from './styles';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useModalBox } from '../../hooks/modalBox';
import { useSocket } from '../../hooks/socket';
import { useMobile } from '../../hooks/mobile';
import { useHeader } from '../../hooks/header';

import Loading from '../../components/Loading';

interface ITerritory {
  id: string;
  name: string;
  population: number;
  formattedPopulation?: string;
  sect?: string;
  editMode?: boolean;
}

const Influences: React.FC = () => {
  const [isBusy, setBusy] = useState(false);
  const [domainMasquerade, setDomainMasquerade] = useState<number>(0);
  const [loadingMasquerade, setLoadingMasquerade] = useState<boolean>(true);
  const [territoryList, setTerritoryList] = useState<ITerritory[]>([]);
  const [selTerritoryList, setSelTerritoryList] = useState<ITerritory[]>([]);
  const [selectedSect, setSelectedSect] = useState<string>('');
  const [sectList, setSectList] = useState<ITerritory[]>([]);
  const [isScrollOn, setIsScrollOn] = useState<boolean>(true);
  const { signOut } = useAuth();
  const { addToast } = useToast();
  const { showModal } = useModalBox();
  const { notifyMasquerade } = useSocket();
  const { isMobileVersion } = useMobile();
  const { setCurrentPage } = useHeader();
  const terrRowRef = useRef<HTMLTableRowElement>(null);
  const terrBodyRef = useRef<HTMLTableSectionElement>(null);

  const loadDomainMasquerade = useCallback(async () => {
    setLoadingMasquerade(true);

    try {
      await api.get('/domain/masqueradeLevel').then(response => {
        const res: number = response.data.masquerade_level;

        setDomainMasquerade(res);
      });
    } catch (error: any) {
      if (error.response) {
        const { message } = error.response.data;

        if (error.response.status !== 401) {
          addToast({
            type: 'error',
            title:
              'Erro ao tentar recuperar o nível de Quebra de Máscara atual',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setLoadingMasquerade(false);
  }, [addToast]);

  const loadTerritories = useCallback(
    async (setAsBusy = true) => {
      setAsBusy && setBusy(true);

      try {
        await api.get('territories/list').then(response => {
          const res: ITerritory[] = response.data;
          let newSectList: ITerritory[] = [];

          const formattedTerritories: ITerritory[] = res.map(
            (territory: ITerritory) => {
              const terr: ITerritory = {
                id: territory.id,
                name: territory.name,
                population: territory.population,
                formattedPopulation: new Intl.NumberFormat('pt-BR').format(
                  territory.population,
                ),
                sect: territory.sect ? territory.sect : '',
                editMode: false,
              };

              if (terr.sect) {
                const currSect: ITerritory[] = newSectList.filter(
                  sect => sect.sect === territory.sect,
                );

                if (currSect.length === 0) {
                  const newSect = {
                    id: terr.sect,
                    name: terr.sect,
                    population: Number(terr.population),
                    formattedPopulation: terr.formattedPopulation,
                    sect: terr.sect,
                    editMode: false,
                  };

                  if (newSectList.length > 0) {
                    newSectList = [...newSectList, newSect].sort(
                      (a: ITerritory, b: ITerritory) => {
                        if (a.name < b.name) {
                          return -1;
                        }

                        if (a.name > b.name) {
                          return 1;
                        }

                        return 0;
                      },
                    );
                  } else {
                    newSectList = [newSect];
                  }
                } else {
                  const newPop =
                    Number(currSect[0].population) + Number(terr.population);
                  const newSect: ITerritory = {
                    id: currSect[0].id,
                    name: currSect[0].name,
                    population: newPop,
                    formattedPopulation: new Intl.NumberFormat('pt-BR').format(
                      newPop,
                    ),
                    sect: currSect[0].sect,
                    editMode: false,
                  };

                  newSectList = newSectList.map(sect =>
                    sect.id === newSect.id ? newSect : sect,
                  );
                }
              }

              return terr;
            },
          );

          setSectList(newSectList);
          setSelTerritoryList(formattedTerritories);
          setTerritoryList(formattedTerritories);
        });
      } catch (error: any) {
        if (error.response) {
          const { message } = error.response.data;

          if (error.response.status !== 401) {
            addToast({
              type: 'error',
              title: 'Erro ao tentar listar os territórios',
              description: `Erro: '${message}'`,
            });
          }
        }
      }

      setAsBusy && setBusy(false);
    },
    [addToast],
  );

  const handleEditTerritory = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      const terrId = e.currentTarget.id.replace('edit:', '');

      const newTerritoryList = territoryList.map(terr => {
        const newTerr = terr;
        if (newTerr.id === terrId) {
          newTerr.editMode = true;
        } else {
          newTerr.editMode = false;
        }
        return newTerr;
      });

      setTerritoryList(newTerritoryList);
    },
    [territoryList],
  );

  const handleCancel = useCallback(
    (currTerritory: ITerritory) => {
      const newTerritory = currTerritory;

      let newTerritoryList: ITerritory[];
      if (newTerritory.id === 'new') {
        newTerritoryList = territoryList.filter(terr => terr.id !== 'new');
        setSelTerritoryList(newTerritoryList);
      } else {
        newTerritory.editMode = false;

        newTerritoryList = territoryList.map(terr =>
          terr.id === newTerritory.id ? newTerritory : terr,
        );
      }

      setTerritoryList(newTerritoryList);
    },
    [territoryList],
  );

  const handleCancelEditTerritory = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      const terrId = e.currentTarget.id.replace('cancel:', '');

      const currTerritory = territoryList.find(terr => terr.id === terrId);

      if (currTerritory) {
        handleCancel(currTerritory);
      }
    },
    [handleCancel, territoryList],
  );

  const handleSaveNew = useCallback(
    async (newTerritory: ITerritory) => {
      try {
        const formData = {
          name: newTerritory.name,
          population: newTerritory.population,
          sect: newTerritory.sect,
        };

        await api.post('/territories/add', formData);
        await loadTerritories(false);
        setSelectedSect('');

        addToast({
          type: 'success',
          title: 'Território adicionado!',
          description: 'Território adicionado com sucesso!',
        });
      } catch (error: any) {
        if (error.response) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar adicionar o território',
            description:
              'Não foi possível adicionar o território, verifique os campos.',
          });
        }
      }
    },
    [addToast, loadTerritories],
  );

  const handleConfirmSaveNew = useCallback(
    (newTerritory: ITerritory) => {
      let hasError = false;
      if (
        newTerritory.name === '' ||
        newTerritory.population === 0 ||
        newTerritory.sect === ''
      ) {
        hasError = true;
      }

      if (hasError) {
        addToast({
          type: 'error',
          title: 'Dados incompletos do novo território',
          description:
            'Verifique os campos do novo território: Município, População e Secto!',
        });
      } else {
        showModal({
          type: 'warning',
          title: 'Confirmar inclusão',
          description: `Você está prestes incluir um novo Território [${newTerritory.name}], você confirma?`,
          btn1Title: 'Sim',
          btn1Function: () => handleSaveNew(newTerritory),
          btn2Title: 'Não',
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          btn2Function: () => handleCancel(newTerritory),
        });
      }
    },
    [addToast, handleCancel, handleSaveNew, showModal],
  );

  const handleSaveTerritory = useCallback(
    async (newTerritory: ITerritory) => {
      try {
        const formData = {
          territory_id: newTerritory.id,
          name: newTerritory.name,
          population: newTerritory.population,
          sect: newTerritory.sect,
        };

        await api.patch('/territories/update', formData);
        await loadTerritories(false);
        setSelectedSect('');

        addToast({
          type: 'success',
          title: 'Território atualizado!',
          description: 'Território atualizado com sucesso!',
        });
      } catch (error: any) {
        if (error.response) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar atualizar o território',
            description:
              'Não foi possível atualizar o território, verique os campos.',
          });
        }
      }
    },
    [addToast, loadTerritories],
  );

  const handleConfirmSaveTerritory = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      const terrId = e.currentTarget.id.replace('save:', '');
      const currTerritory = territoryList.find(terr => terr.id === terrId);

      const newTerritory: ITerritory = {
        id: currTerritory?.id || '',
        name: currTerritory?.name || '',
        population: currTerritory?.population || 0,
        formattedPopulation: currTerritory?.formattedPopulation || '',
        sect: currTerritory?.sect || '',
      };

      if (terrId && currTerritory) {
        const newName = document.getElementById(
          `name:${terrId}`,
        ) as HTMLInputElement;

        const newPop = document.getElementById(
          `pop:${terrId}`,
        ) as HTMLInputElement;

        const newSect = document.getElementById(
          `sect:${terrId}`,
        ) as HTMLInputElement;

        let hasChanges = false;
        if (
          newName &&
          newName.value !== '' &&
          newName.value !== currTerritory.name
        ) {
          newTerritory.name = newName.value;
          hasChanges = true;
        }

        if (
          newPop &&
          newPop.value !== '' &&
          Number(newPop.value) !== Number(currTerritory.population)
        ) {
          newTerritory.population = Number(newPop.value);
          newTerritory.formattedPopulation = new Intl.NumberFormat(
            'pt-BR',
          ).format(newTerritory.population);

          hasChanges = true;
        }

        if (
          newSect &&
          newSect.value !== '' &&
          newSect.value !== currTerritory.sect
        ) {
          newTerritory.sect = newSect.value;
          hasChanges = true;
        }

        if (terrId === 'new') {
          handleConfirmSaveNew(newTerritory);
        } else if (hasChanges) {
          showModal({
            type: 'warning',
            title: 'Confirmar alteração',
            description: `Você está alterando o Território [${currTerritory.name}], você confirma?`,
            btn1Title: 'Sim',
            btn1Function: () => handleSaveTerritory(newTerritory),
            btn2Title: 'Não',
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            btn2Function: () => handleCancel(currTerritory),
          });
        } else {
          handleCancel(currTerritory);
        }
      }
    },
    [
      handleCancel,
      handleConfirmSaveNew,
      handleSaveTerritory,
      showModal,
      territoryList,
    ],
  );

  const handleRemoveTerritory = useCallback(
    async (terrId: string) => {
      try {
        const requestData = {
          territory_id: terrId,
        };

        const reqData = { data: requestData };

        await api.delete('/territories/remove', reqData);

        const newTerritoryList = territoryList.filter(
          terr => terr.id !== terrId,
        );

        setTerritoryList(newTerritoryList);

        if (selTerritoryList.length > 0) {
          const newSelTerritoryList = selTerritoryList.filter(
            terr => terr.id !== terrId,
          );
          setSelTerritoryList(newSelTerritoryList);
        }

        addToast({
          type: 'success',
          title: 'Território excluído',
          description: 'Território excluído com sucesso!',
        });
      } catch (error: any) {
        if (error.response) {
          const { message } = error.response.data;

          if (message?.indexOf('token') > 0 && error.response.status === 401) {
            addToast({
              type: 'error',
              title: 'Sessão Expirada',
              description:
                'Sessão de usuário expirada, faça o login novamente!',
            });

            signOut();
          } else {
            addToast({
              type: 'error',
              title: 'Erro ao tentar exluir o território',
              description: `Erro: '${message}'`,
            });
          }
        }
      }
    },
    [addToast, selTerritoryList, signOut, territoryList],
  );

  const handleConfirmRemoveTerritory = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      const terrId = e.currentTarget.id.replace('delete:', '');

      const currTerritory = territoryList.find(terr => terr.id === terrId);

      if (currTerritory) {
        showModal({
          type: 'warning',
          title: 'Confirmar exclusão',
          description: `Você está prestes a excluir o Território [${currTerritory.name}], você confirma?`,
          btn1Title: 'Sim',
          btn1Function: () => handleRemoveTerritory(terrId),
          btn2Title: 'Não',
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          btn2Function: () => {},
        });
      }
    },
    [handleRemoveTerritory, showModal, territoryList],
  );

  const handleAddTerritory = useCallback(() => {
    const newExist = territoryList.find(terr => terr.id === 'new');

    if (!newExist) {
      const newTerritory: ITerritory = {
        id: 'new',
        name: '',
        population: 0,
        formattedPopulation: '0',
        sect: '',
        editMode: true,
      };

      setTerritoryList([newTerritory, ...territoryList]);
      setSelectedSect('');
      setSelTerritoryList([newTerritory, ...territoryList]);
    }
  }, [territoryList]);

  const handleSelectSectTerritories = useCallback(
    async (e: MouseEvent<HTMLTableRowElement>) => {
      const currentSelection = e.currentTarget.id;

      if (selectedSect === currentSelection) {
        setSelectedSect('');
        setSelTerritoryList(territoryList);
      } else {
        setSelectedSect(currentSelection);
        const newSelTerrList = territoryList.filter(
          terr => terr.sect === currentSelection,
        );
        setSelTerritoryList(newSelTerrList);
      }
    },
    [selectedSect, territoryList],
  );

  const setDomainMasqueradeLevel = useCallback(
    async (newLevel: number) => {
      try {
        await api
          .patch('/domain/setMasqueradeLevel', { masquerade_level: newLevel })
          .then(() => {
            setDomainMasquerade(newLevel);
          });
      } catch (error: any) {
        if (error.response) {
          const { message } = error.response.data;

          if (error.response.status !== 401) {
            addToast({
              type: 'error',
              title:
                'Erro ao tentar definir no novo nível de Quebra de Máscara',
              description: `Erro: '${message}'`,
            });
          }
        }
      }
    },
    [addToast],
  );

  const handleIncreaseMasqueradeLevel = useCallback(
    async (currentLevel: number) => {
      const newLevel = currentLevel + 1;
      await setDomainMasqueradeLevel(newLevel);
      notifyMasquerade(newLevel, true);
    },
    [notifyMasquerade, setDomainMasqueradeLevel],
  );

  const handleDecreaseMasqueradeLevel = useCallback(
    async (currentLevel: number) => {
      const newLevel = currentLevel - 1;
      await setDomainMasqueradeLevel(newLevel);
      notifyMasquerade(newLevel, false);
    },
    [notifyMasquerade, setDomainMasqueradeLevel],
  );

  useEffect(() => {
    if (selectedSect === '') {
      setIsScrollOn(true);
    } else if (terrRowRef.current && terrBodyRef.current) {
      if (terrRowRef.current.offsetWidth === terrBodyRef.current.offsetWidth) {
        setIsScrollOn(false);
      }
    }
  }, [selectedSect, territoryList, selTerritoryList]);

  useEffect(() => {
    setCurrentPage('territories');
    loadDomainMasquerade();
    loadTerritories();
  }, [loadDomainMasquerade, loadTerritories, setCurrentPage]);

  return (
    <Container isMobile={isMobileVersion}>
      <TitleBox>
        <strong>
          {`Lista de Territórios${
            selectedSect !== '' ? ` (${selectedSect})` : ''
          }`}
        </strong>
        <DomainMasqueradeBox>
          {isMobileVersion ? (
            <strong>Máscara Atual</strong>
          ) : (
            <strong>Quebra de Máscara Atual</strong>
          )}

          <ActionButton
            id="addNew"
            title="Diminuir Quebra de Máscara"
            editMode
            disabled={domainMasquerade === 0 || loadingMasquerade}
            onClick={() => handleDecreaseMasqueradeLevel(domainMasquerade)}
          >
            {domainMasquerade > 0 ? <FiMinus /> : ''}
          </ActionButton>
          <strong>{loadingMasquerade ? '..' : domainMasquerade}</strong>
          <ActionButton
            id="addNew"
            title="Aumentar Quebra de Máscara"
            editMode={false}
            disabled={domainMasquerade === 10 || loadingMasquerade}
            onClick={() => handleIncreaseMasqueradeLevel(domainMasquerade)}
          >
            {domainMasquerade < 10 ? <FiPlus /> : ''}
          </ActionButton>
        </DomainMasqueradeBox>
      </TitleBox>
      {isBusy ? (
        <Loading />
      ) : (
        <TablesContainer isMobile={isMobileVersion}>
          <TableWrapper isMobile={isMobileVersion}>
            <Table isScrollOn={isScrollOn} isMobile={isMobileVersion}>
              <thead>
                <tr>
                  <th>
                    <TableHeaderCell>
                      <ActionButton
                        id="addNew"
                        title="Adicionar Novo"
                        editMode
                        onClick={handleAddTerritory}
                      >
                        <FiPlus />
                      </ActionButton>
                      <span>Município</span>
                    </TableHeaderCell>
                  </th>
                  {!isMobileVersion && <th>População</th>}
                  <th>Secto</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody ref={terrBodyRef}>
                {selTerritoryList.map((terr, index) => (
                  <tr key={terr.id} ref={index === 0 ? terrRowRef : undefined}>
                    <td>
                      {terr.editMode ? (
                        <TableEditCell alignment="left">
                          <input
                            name={`name:${terr.name}`}
                            id={`name:${terr.id}`}
                            placeholder={terr.name}
                          />
                        </TableEditCell>
                      ) : (
                        <TableCell alignment="left">
                          <strong>{terr.name}</strong>
                        </TableCell>
                      )}
                    </td>
                    {!isMobileVersion && (
                      <td>
                        {terr.editMode ? (
                          <TableEditCell alignment="right">
                            <input
                              name={`pop:${terr.name}`}
                              id={`pop:${terr.id}`}
                              placeholder={terr.formattedPopulation}
                            />
                          </TableEditCell>
                        ) : (
                          <TableCell alignment="right">
                            {terr.formattedPopulation}
                          </TableCell>
                        )}
                      </td>
                    )}

                    <td>
                      {terr.editMode ? (
                        <TableEditCell
                          alignment={isMobileVersion ? 'left' : 'center'}
                        >
                          <input
                            name={`sect:${terr.name}`}
                            id={`sect:${terr.id}`}
                            placeholder={terr.sect}
                          />
                        </TableEditCell>
                      ) : (
                        <TableCell
                          alignment={isMobileVersion ? 'left' : 'center'}
                        >
                          {terr.sect}
                        </TableCell>
                      )}
                    </td>
                    <td>
                      <ActionsContainer>
                        {terr.editMode ? (
                          <>
                            <ActionButton
                              id={`save:${terr.id}`}
                              title="Salvar"
                              editMode
                              onClick={handleConfirmSaveTerritory}
                            >
                              <FiSave />
                            </ActionButton>
                            <ActionButton
                              id={`cancel:${terr.id}`}
                              title="Cancelar"
                              onClick={handleCancelEditTerritory}
                            >
                              <FiX />
                            </ActionButton>
                          </>
                        ) : (
                          <>
                            <ActionButton
                              id={`edit:${terr.id}`}
                              title="Editar"
                              onClick={handleEditTerritory}
                            >
                              <FiEdit />
                            </ActionButton>
                            <ActionButton
                              id={`delete:${terr.id}`}
                              title="Remover"
                              onClick={handleConfirmRemoveTerritory}
                            >
                              <FiTrash2 />
                            </ActionButton>
                          </>
                        )}
                      </ActionsContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>

          <TableWrapper isSectTable>
            <Table isSectTable>
              <thead>
                <tr>
                  <th>Secto</th>
                  <th>População</th>
                </tr>
              </thead>
              <tbody>
                {sectList.map(sect => (
                  <tr
                    key={sect.id}
                    id={sect.id}
                    onClick={handleSelectSectTerritories}
                  >
                    <td>
                      <TableCell
                        alignment="left"
                        selected={sect.id === selectedSect}
                      >
                        <strong>{sect.name}</strong>
                      </TableCell>
                    </td>
                    <td>
                      <TableCell
                        alignment="right"
                        selected={sect.id === selectedSect}
                      >
                        {sect.formattedPopulation}
                      </TableCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </TablesContainer>
      )}
    </Container>
  );
};

export default Influences;
