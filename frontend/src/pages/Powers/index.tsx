/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback } from 'react';

import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaCheckCircle, FaMinusCircle } from 'react-icons/fa';
import Skeleton from '@material-ui/lab/Skeleton';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  TableWrapper,
  SearchBox,
  StyledTableContainer,
  StyledTable,
  StyledTableHead,
  StyledTableBody,
  StyledTableRow,
  StyledTableCell,
  StyledTableSortLabel,
  ActionsContainer,
  ActionButton,
} from './styles';

import SearchField from '../../components/SearchField';
import AddPower from '../../components/AddPower';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';
import { useHeader } from '../../hooks/header';
import { useModalBox } from '../../hooks/modalBox';

interface IPower {
  id?: string;
  long_name: string;
  short_name: string;
  level: number;
  type: string;
  origin?: string;
  requirements?: string;
  description?: string;
  system?: string;
  cost?: number;
  source?: string;
  show?: boolean;
}

interface ISort {
  title: 'power' | 'level' | 'type' | 'included';
  direction: 'asc' | 'desc';
  active: boolean;
}

const Powers: React.FC = () => {
  const [powersList, setPowersList] = useState<IPower[]>([]);
  const [isBusy, setBusy] = useState(true);
  const [selectedPower, setSelectedPower] = useState<IPower>({} as IPower);
  const [addPowerOn, setAddPowerOn] = useState(false);

  const [sortOrder, setSortOrder] = useState<ISort[]>([
    {
      title: 'power',
      direction: 'asc',
      active: true,
    },
    {
      title: 'level',
      direction: 'desc',
      active: false,
    },
    {
      title: 'type',
      direction: 'desc',
      active: false,
    },
    {
      title: 'included',
      direction: 'desc',
      active: false,
    },
  ]);

  const { signOut } = useAuth();
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();
  const { setCurrentPage } = useHeader();
  const { showModal } = useModalBox();

  const loadPowers = useCallback(async () => {
    try {
      await api.get('/powers/list').then(response => {
        const res = response.data;

        const newArray = res.map((power: IPower) => {
          const newPower = {
            id: power.id,
            long_name: power.long_name,
            short_name: power.short_name,
            level: Number(power.level),
            type: power.type,
            origin: power.origin || '',
            requirements: power.requirements || '',
            description: power.description || '',
            system: power.system || '',
            cost: power.cost || 0,
            source: power.source || '',
            show: true,
          };

          return newPower;
        });

        setPowersList(newArray);
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
            title: 'Erro ao tentar listar os poderes',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, signOut]);

  const getLevelLabel = useCallback((power: IPower) => {
    const typeWithLabel = ['ritual', 'rituals', 'gift', 'routes'];
    const labels = [
      '-',
      'Básico',
      'Intermediário',
      'Avançado',
      'Ancião',
      'Mestre',
      'Ancestral',
      'Matusalém',
    ];

    let label;
    if (power.level === 0 || typeWithLabel.includes(power.type)) {
      label = labels[power.level];
    } else {
      label = power.level;
    }

    return label;
  }, []);

  const getTypeLabel = useCallback((type: string) => {
    let typeLabel;

    switch (type) {
      case 'rituals':
      case 'ritual':
        typeLabel = 'Ritual';
        break;
      case 'discipline':
        typeLabel = 'Disciplina';
        break;
      case 'combination':
        typeLabel = 'Combo';
        break;
      case 'gift':
        typeLabel = 'Dom';
        break;
      case 'arcanoi':
        typeLabel = 'Arcanoi';
        break;
      case 'spheres':
        typeLabel = 'Esfera';
        break;
      case 'routes':
        typeLabel = 'Rotina';
        break;

      case 'other':
      default:
        typeLabel = 'Outro';
        break;
    }

    return typeLabel;
  }, []);

  const handleSearchChange = useCallback(
    event => {
      const inputText = event.target.value;
      let newPowersList: IPower[];

      if (inputText === '') {
        newPowersList = powersList.map(power => {
          const newPower = power;
          newPower.show = true;

          return newPower;
        });
      } else if (inputText.toLowerCase() === 'incluso') {
        newPowersList = powersList.map(power => {
          const newPower = power;
          newPower.show = !!power.id;

          return newPower;
        });
      } else {
        newPowersList = powersList.map(power => {
          const newPower = power;

          const powerType = getTypeLabel(power.type);

          if (
            power.long_name.toLowerCase().indexOf(inputText.toLowerCase()) >=
              0 ||
            powerType.toLowerCase().indexOf(inputText.toLowerCase()) >= 0
          ) {
            newPower.show = true;
          } else {
            newPower.show = false;
          }

          return newPower;
        });
      }

      setPowersList(newPowersList);
    },
    [getTypeLabel, powersList],
  );

  const handleSort = useCallback(
    title => {
      let newSortItem: ISort = {
        title,
        direction: 'asc',
        active: true,
      };

      const newSortOrder = sortOrder.map(sortElem => {
        let newSortElem: ISort;

        if (sortElem.title === title) {
          newSortItem = {
            title: sortElem.title,
            direction: sortElem.direction === 'asc' ? 'desc' : 'asc',
            active: true,
          };
          newSortElem = newSortItem;
        } else {
          newSortElem = {
            title: sortElem.title,
            direction: sortElem.direction,
            active: false,
          };
        }

        return newSortElem;
      });

      setSortOrder(newSortOrder);

      // Sorting
      const newPowersList = powersList;
      switch (newSortItem.title) {
        case 'level':
          if (newSortItem.direction === 'desc') {
            newPowersList.sort((powerA: IPower, powerB: IPower) => {
              const levelA = getLevelLabel(powerA);
              const levelB = getLevelLabel(powerB);

              if (levelA > levelB) return -1;
              if (levelA < levelB) return 1;
              return 0;
            });
          } else {
            newPowersList.sort((powerA: IPower, powerB: IPower) => {
              const levelA = getLevelLabel(powerA);
              const levelB = getLevelLabel(powerB);

              if (levelA > levelB) return 1;
              if (levelA < levelB) return -1;
              return 0;
            });
          }
          break;

        case 'type':
          if (newSortItem.direction === 'desc') {
            newPowersList.sort((powerA: IPower, powerB: IPower) => {
              const typeA = getTypeLabel(powerA.type);
              const typeB = getTypeLabel(powerB.type);

              if (typeA > typeB) return -1;
              if (typeA < typeB) return 1;
              return 0;
            });
          } else {
            newPowersList.sort((powerA: IPower, powerB: IPower) => {
              const typeA = getTypeLabel(powerA.type);
              const typeB = getTypeLabel(powerB.type);

              if (typeA > typeB) return 1;
              if (typeA < typeB) return -1;
              return 0;
            });
          }
          break;

        case 'included':
          if (newSortItem.direction === 'asc') {
            newPowersList.sort((powerA: IPower, powerB: IPower) => {
              const includedA = powerA.id ? 0 : 1;
              const includedB = powerB.id ? 0 : 1;

              if (includedA > includedB) return -1;
              if (includedA < includedB) return 1;
              return 0;
            });
          } else {
            newPowersList.sort((powerA: IPower, powerB: IPower) => {
              const includedA = powerA.id ? 0 : 1;
              const includedB = powerB.id ? 0 : 1;

              if (includedA > includedB) return 1;
              if (includedA < includedB) return -1;
              return 0;
            });
          }
          break;

        case 'power':
        default:
          if (newSortItem.direction === 'desc') {
            newPowersList.sort((powerA: IPower, powerB: IPower) => {
              if (powerA.long_name > powerB.long_name) return -1;
              if (powerA.long_name < powerB.long_name) return 1;
              return 0;
            });
          } else {
            newPowersList.sort((powerA: IPower, powerB: IPower) => {
              if (powerA.long_name > powerB.long_name) return 1;
              if (powerA.long_name < powerB.long_name) return -1;
              return 0;
            });
          }
          break;
      }
      setPowersList(newPowersList);
    },
    [getLevelLabel, getTypeLabel, powersList, sortOrder],
  );

  const handleRemove = useCallback(
    async (power: IPower) => {
      try {
        const requestData = {
          power_id: power.id,
        };

        const reqData = { data: requestData };
        await api.delete('/powers/delete', reqData);

        addToast({
          type: 'success',
          title: 'Poder excluído',
          description: 'Descrição do poder excluído com sucesso!',
        });

        const newPowersList = powersList.map((myPower: IPower) => {
          const newPower = myPower;

          if (newPower.id === power.id) {
            newPower.id = undefined;
            newPower.short_name = power.long_name;
            newPower.type =
              power.type === 'Ritual' || power.type === 'Rotina'
                ? 'rituals'
                : 'power';
            newPower.origin = '';
            newPower.requirements = '';
            newPower.description = '';
            newPower.system = '';
            newPower.cost = 0;
            newPower.source = '';
          }

          return newPower;
        });

        setPowersList(newPowersList);
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
              description:
                'Sessão de usuário expirada, faça o login novamente!',
            });

            signOut();
          } else {
            addToast({
              type: 'error',
              title: 'Erro ao tentar exluir o poder',
              description: `Erro: '${message}'`,
            });
          }
        }
      }
    },
    [addToast, powersList, signOut],
  );

  const handleConfirmRemove = useCallback(
    (power: IPower) => {
      const powerName = `${power.long_name}${
        power.level > 0 ? ` - ${getLevelLabel(power)}` : ''
      }`;

      showModal({
        type: 'warning',
        title: 'Confirmar exclusão',
        description: `Você está prestes a remover a descrição do poder [${powerName}], você confirma?`,
        btn1Title: 'Sim',
        btn1Function: () => handleRemove(power),
        btn2Title: 'Não',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        btn2Function: () => {},
      });
    },
    [getLevelLabel, handleRemove, showModal],
  );

  const handleClose = useCallback(() => {
    setAddPowerOn(false);
  }, []);

  const handleUpdatePower = useCallback(
    (updatedPower: IPower) => {
      const newPowersList = powersList.map(power => {
        let newPower: IPower = power;
        if (
          newPower.long_name === updatedPower.long_name &&
          Number(newPower.level) === Number(updatedPower.level)
        ) {
          newPower = {
            id: updatedPower.id,
            long_name: updatedPower.long_name,
            short_name: updatedPower.short_name,
            level: Number(updatedPower.level),
            type: updatedPower.type,
            origin: updatedPower.origin || '',
            requirements: updatedPower.requirements || '',
            description: updatedPower.description || '',
            system: updatedPower.system || '',
            cost: updatedPower.cost || 0,
            source: updatedPower.source || '',
            show: power.show,
          };
        }
        return newPower;
      });

      setAddPowerOn(false);
      setPowersList(newPowersList);
    },
    [powersList],
  );

  const handleEditPower = useCallback((power: IPower) => {
    setSelectedPower(power);
    setAddPowerOn(true);
  }, []);

  useEffect(() => {
    setCurrentPage('powers');
    loadPowers();
  }, [loadPowers, setCurrentPage]);

  useEffect(() => {
    setCurrentPage('powers');
    loadPowers();
  }, [loadPowers, setCurrentPage]);

  return (
    <Container isMobile={isMobileVersion}>
      <TitleBox>
        <strong>Lista de Poderes</strong>
      </TitleBox>
      <TableWrapper>
        <SearchBox>
          {isBusy ? (
            <Skeleton variant="rect" width={340} height={51} />
          ) : (
            <SearchField
              id="searching"
              label="Procurar..."
              placeholder="Procurar..."
              onChange={e => handleSearchChange(e)}
            />
          )}
        </SearchBox>
        <StyledTableContainer>
          <StyledTable stickyHeader>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableCell onClick={() => handleSort(sortOrder[0].title)}>
                  Poder
                  <StyledTableSortLabel
                    active={sortOrder[0].active}
                    direction={sortOrder[0].direction}
                  />
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort(sortOrder[1].title)}>
                  Nível
                  <StyledTableSortLabel
                    active={sortOrder[1].active}
                    direction={sortOrder[1].direction}
                  />
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort(sortOrder[2].title)}>
                  Tipo
                  <StyledTableSortLabel
                    active={sortOrder[2].active}
                    direction={sortOrder[2].direction}
                  />
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort(sortOrder[3].title)}>
                  Incluso?
                  <StyledTableSortLabel
                    active={sortOrder[3].active}
                    direction={sortOrder[3].direction}
                  />
                </StyledTableCell>
                <StyledTableCell>Ações</StyledTableCell>
              </StyledTableRow>
            </StyledTableHead>
            <StyledTableBody>
              {isBusy ? (
                <StyledTableRow>
                  <StyledTableCell align="left">
                    <Skeleton />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Skeleton />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Skeleton />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Skeleton />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Skeleton />
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                powersList.map(
                  power =>
                    power.show && (
                      <StyledTableRow key={`${power.long_name}-${power.level}`}>
                        <StyledTableCell align="left">
                          {power.long_name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {getLevelLabel(power)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {getTypeLabel(power.type)}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          title={power.id ? 'Adicionado' : 'Pendente...'}
                        >
                          {power.id ? (
                            <FaCheckCircle color="green" />
                          ) : (
                            <FaMinusCircle color="red" />
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <ActionsContainer>
                            {!isMobileVersion && (
                              <ActionButton
                                id={`edit:${power.long_name}-${power.level}`}
                                title="Editar"
                                onClick={() => handleEditPower(power)}
                              >
                                <FiEdit />
                              </ActionButton>
                            )}

                            <ActionButton
                              id={`delete:${power.long_name}-${power.level}`}
                              title="Remover"
                              onClick={() => handleConfirmRemove(power)}
                              disabled={!power.id}
                            >
                              <FiTrash2 />
                            </ActionButton>
                          </ActionsContainer>
                        </StyledTableCell>
                      </StyledTableRow>
                    ),
                )
              )}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>
      </TableWrapper>
      <AddPower
        open={addPowerOn}
        handleClose={handleClose}
        handleSave={handleUpdatePower}
        selectedPower={selectedPower}
      />
    </Container>
  );
};

export default Powers;
