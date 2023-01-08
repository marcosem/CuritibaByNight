/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback } from 'react';
// import { Link, useHistory } from 'react-router-dom';

import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaCheckCircle, FaMinusCircle } from 'react-icons/fa';

import Skeleton from '@material-ui/lab/Skeleton';

import api from '../../services/api';

// import Loading from '../../components/Loading';

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

interface IPowerSimple {
  id?: string;
  name: string;
  level: number | '-';
  type: string;
  included: boolean;
  show: boolean;
}

interface IPowerResponse {
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
}

interface ISort {
  title: 'power' | 'level' | 'type' | 'included';
  direction: 'asc' | 'desc';
  active: boolean;
}

// using https://v4.mui.com
const Powers: React.FC = () => {
  const [powersList, setPowersList] = useState<IPowerSimple[]>([]);
  const [rawPowerList, setRawPowerList] = useState<IPowerResponse[]>([]);
  const [selectedPower, setSelectedPower] = useState<IPowerResponse>(
    {} as IPowerResponse,
  );
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
  const [isBusy, setBusy] = useState(true);
  const { signOut } = useAuth();
  const { addToast } = useToast();

  const { isMobileVersion } = useMobile();
  const { setCurrentPage } = useHeader();

  const translateType = useCallback(type => {
    let traslatedType: string;

    switch (type) {
      case 'rituals':
        traslatedType = 'Ritual';
        break;
      case 'powers':
        traslatedType = 'Poder';
        break;
      case 'discipline':
        traslatedType = 'Disciplina';
        break;
      case 'combination':
        traslatedType = 'Combo';
        break;
      case 'gift':
        traslatedType = 'Dom';
        break;
      case 'arcanoi':
        traslatedType = 'Arcanoi';
        break;
      case 'spheres':
        traslatedType = 'Esfera';
        break;
      case 'routes':
        traslatedType = 'Rotina';
        break;
      case 'other':
      default:
        traslatedType = 'Outro';
        break;
    }

    return traslatedType;
  }, []);

  const loadPowers = useCallback(async () => {
    try {
      await api.get('/powers/list').then(response => {
        const res = response.data;
        const levelsMap = ['Básico', 'Intermediário', 'Avançado'];

        const newArray = res.map((power: IPowerResponse) => {
          let level;
          const powerLevel = Number(power.level);

          switch (power.type) {
            case 'rituals':
              level = powerLevel <= 3 ? levelsMap[powerLevel - 1] : powerLevel;
              break;
            default:
              if (powerLevel === 0) {
                level = '-';
              } else {
                level = powerLevel;
              }
              break;
          }

          const included = !!power.id;

          const newPower = {
            id: power.id,
            name: power.long_name,
            level,
            type: translateType(power.type),
            included,
            show: true,
          };

          return newPower;
        });

        setRawPowerList(res);
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
  }, [addToast, signOut, translateType]);

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
            newPowersList.sort((powerA: IPowerSimple, powerB: IPowerSimple) => {
              if (powerA.level > powerB.level) return -1;
              if (powerA.level < powerB.level) return 1;
              return 0;
            });
          } else {
            newPowersList.sort((powerA: IPowerSimple, powerB: IPowerSimple) => {
              if (powerA.level > powerB.level) return 1;
              if (powerA.level < powerB.level) return -1;
              return 0;
            });
          }
          break;

        case 'type':
          if (newSortItem.direction === 'desc') {
            newPowersList.sort((powerA: IPowerSimple, powerB: IPowerSimple) => {
              if (powerA.type > powerB.type) return -1;
              if (powerA.type < powerB.type) return 1;
              return 0;
            });
          } else {
            newPowersList.sort((powerA: IPowerSimple, powerB: IPowerSimple) => {
              if (powerA.type > powerB.type) return 1;
              if (powerA.type < powerB.type) return -1;
              return 0;
            });
          }
          break;

        case 'included':
          if (newSortItem.direction === 'asc') {
            newPowersList.sort((powerA: IPowerSimple, powerB: IPowerSimple) => {
              if (powerA.included > powerB.included) return -1;
              if (powerA.included < powerB.included) return 1;
              return 0;
            });
          } else {
            newPowersList.sort((powerA: IPowerSimple, powerB: IPowerSimple) => {
              if (powerA.included > powerB.included) return 1;
              if (powerA.included < powerB.included) return -1;
              return 0;
            });
          }
          break;

        case 'power':
        default:
          if (newSortItem.direction === 'desc') {
            newPowersList.sort((powerA: IPowerSimple, powerB: IPowerSimple) => {
              if (powerA.name > powerB.name) return -1;
              if (powerA.name < powerB.name) return 1;
              return 0;
            });
          } else {
            newPowersList.sort((powerA: IPowerSimple, powerB: IPowerSimple) => {
              if (powerA.name > powerB.name) return 1;
              if (powerA.name < powerB.name) return -1;
              return 0;
            });
          }
          break;
      }
      setPowersList(newPowersList);
    },
    [powersList, sortOrder],
  );

  const handleSearchChange = useCallback(
    event => {
      const inputText = event.target.value;
      let newPowersList: IPowerSimple[];

      if (inputText === '') {
        newPowersList = powersList.map(power => {
          const newPower = power;
          newPower.show = true;

          return newPower;
        });
      } else {
        newPowersList = powersList.map(power => {
          const newPower = power;

          if (
            power.name.toLowerCase().indexOf(inputText.toLowerCase()) >= 0 ||
            power.type.toLowerCase().indexOf(inputText.toLowerCase()) >= 0
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
    [powersList],
  );

  const handleClose = useCallback(() => {
    setAddPowerOn(!addPowerOn);
  }, [addPowerOn]);

  const handleUpdatePower = useCallback(
    (updatedPower: IPowerResponse) => {
      if (updatedPower) {
        const powerSimple: IPowerSimple = {
          id: updatedPower.id,
          name: updatedPower.long_name,
          level: updatedPower.level === 0 ? '-' : updatedPower.level,
          type: translateType(updatedPower.type),
          included: !!updatedPower.id,
          show: true,
        };

        const newPowersList = powersList.map(power =>
          power.name === powerSimple.name && power.level === powerSimple.level
            ? powerSimple
            : power,
        );

        const newRawPowersList = rawPowerList.map(power =>
          power.long_name === updatedPower.long_name &&
          power.level === updatedPower.level
            ? updatedPower
            : power,
        );

        setPowersList(newPowersList);
        setRawPowerList(newRawPowersList);
      }

      setAddPowerOn(!addPowerOn);
    },
    [addPowerOn, powersList, rawPowerList, translateType],
  );

  const handleEditPower = useCallback(
    (power: IPowerSimple) => {
      const powerToFind = {
        long_name: power.name,
        level: power.level === '-' ? 0 : power.level,
      };

      const powerToEdit = rawPowerList.find(
        myPower =>
          myPower.long_name === powerToFind.long_name &&
          Number(myPower.level) === Number(powerToFind.level),
      );

      if (powerToEdit) {
        setSelectedPower(powerToEdit);
        setAddPowerOn(true);
      }
    },
    [rawPowerList],
  );

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
                      <StyledTableRow key={`${power.name}-${power.level}`}>
                        <StyledTableCell align="left">
                          {power.name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {power.level}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {power.type}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          title={power.included ? 'Adicionado' : 'Pendente...'}
                        >
                          {power.included ? (
                            <FaCheckCircle color="green" />
                          ) : (
                            <FaMinusCircle color="red" />
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <ActionsContainer>
                            {!isMobileVersion && (
                              <ActionButton
                                id={`edit:${power.name}-${power.level}`}
                                title="Editar"
                                onClick={() => handleEditPower(power)}
                              >
                                <FiEdit />
                              </ActionButton>
                            )}

                            <ActionButton
                              id={`delete:${power.name}-${power.level}`}
                              title="Remover"
                              disabled={!power.included}
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
