/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback, useRef } from 'react';

import { isAfter } from 'date-fns';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import Skeleton from '@material-ui/lab/Skeleton';
import api from '../../services/api';
import AddAction from '../../components/AddAction';

import {
  Container,
  TitleBox,
  TableWrapper,
  ActionHeader,
  ActionsInfo,
  TableTitleRow,
  StyledTableContainer,
  StyledTable,
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
  // StyledTableSortLabel,
  StyledTableBody,
  AddActionBox,
  AddButton,
  SearchBox,
  ActionsContainer,
  ActionButton,
} from './styles';

import SearchField from '../../components/SearchField';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useSocket } from '../../hooks/socket';
import { useHeader } from '../../hooks/header';

import influencesAbilities from '../Influences/influencesAbilities.json';

interface ILevel {
  id: string;
  level: number;
  status: string;
  enabled: boolean;
}

interface ITrait {
  id: string;
  trait: string;
  level: number;
  levelTemp: number;
  levelArray: ILevel[];
  level_temp?: string;
  type: string;
  character_id: string;
  index: [number, number]; // [index, index in the row]
  updated_at?: string;
}

interface ITraitsList {
  masquerade: ITrait;
  morality: ITrait;
  attributes: ITrait[];
  abilities: ITrait[];
  backgrounds: ITrait[];
  influences: ITrait[];
}

interface IShortTrait {
  trait: string;
  realLevel: number;
  validLevel: number;
}

interface IAction {
  id?: string;
  title: string;
  action_period: string;
  backgrounds: string;
  influence: string;
  influence_level: number;
  ability: string;
  ability_level: number;
  endeavor: 'attack' | 'defend' | 'combine' | 'raise capital' | 'other';
  character_id: string;
  storyteller_id?: string;
  action: string;
  action_force?: number;
  status?: 'sent' | 'read' | 'replied';
  st_reply?: string;
  news?: string;
  result: 'success' | 'partial' | 'fail' | 'not evaluated';
  created_at?: Date;
  updated_at?: Date;
  characterId?: {
    id: string;
    name: string;
  };
  ownerId?: {
    id: string;
    name: string;
  };
  storytellerID?: {
    id: string;
    name: string;
  };
}

const InfluenceActions: React.FC = () => {
  const loadingTraits = useRef<boolean>(false);
  const [domainMasquerade, setDomainMasquerade] = useState<number>(0);
  const [actionMonth, setActionMonth] = useState<string>('');
  const [isBusy, setBusy] = useState(true);
  const [traitsList, setTraitsList] = useState<ITraitsList>({
    masquerade: {} as ITrait,
    morality: {} as ITrait,
    attributes: [],
    abilities: [],
    backgrounds: [],
    influences: [],
  } as ITraitsList);
  const [morality, setMorality] = useState<IShortTrait>({
    trait: '',
    realLevel: 0,
    validLevel: 0,
  });
  const [retainerTrait, setRetainerTrait] = useState<IShortTrait>({
    trait: '',
    realLevel: 0,
    validLevel: 0,
  });
  const [personalMasqueradeLevel, setPersonalMasqueradeLevel] =
    useState<number>(0);
  const [actionsList, setActionsList] = useState<IAction[]>([]);
  const [pastActionsList, setPastActionsList] = useState<IAction[]>([]);
  const [showPastActionsList, setShowPastActionsList] = useState<IAction[]>([]);
  const [actionsNumber, setActionsNumber] = useState<number>(0);
  const [totalMasquerade, setTotalMasquerade] = useState<number>(0);

  const [addActionOn, setAddActionOn] = useState(false);
  const [selectedAction, setSelectedAction] = useState<IAction>({} as IAction);
  const [readOnlyAction, setReadOnlyAction] = useState<boolean>(false);

  const { addToast } = useToast();
  const { char } = useAuth();
  const {
    // isConnected,
    // updatedTrait,
    // reloadCharTraits,
    // notifyTraitUpdate,
    clearUpdatedTrait,
    clearReloadTraits,
  } = useSocket();
  const { setCurrentPage } = useHeader();

  const getInfluencePT = useCallback((influence): string => {
    const infAbility = influencesAbilities.influences.find(
      infAbi => infAbi.influence === influence,
    );

    if (infAbility) {
      return infAbility.influence_PT;
    }

    return '';
  }, []);

  const getStatusPT = useCallback((status): string => {
    let statusPT: string;

    switch (status) {
      case 'sent':
        statusPT = 'Enviado';
        break;
      case 'read':
        statusPT = 'Lido';
        break;
      case 'replied':
        statusPT = 'Respondido';
        break;
      default:
        statusPT = '';
    }

    return statusPT;
  }, []);

  const getResultPT = useCallback(result => {
    let resultPT: string;

    switch (result) {
      case 'success':
        resultPT = 'Sucesso';
        break;
      case 'partial':
        resultPT = 'Parcial';
        break;
      case 'fail':
        resultPT = 'Falhou';
        break;
      case 'not evaluated':
        resultPT = 'Não avaliado';
        break;
      default:
        resultPT = '';
    }

    return resultPT;
  }, []);

  const getActionsNumberLabel = useCallback(() => {
    if (morality.validLevel === 0) return '';

    let label = `${morality.validLevel} [${morality.trait} x${morality.realLevel}]`;

    if (retainerTrait.realLevel > 0) {
      if (retainerTrait.realLevel !== retainerTrait.validLevel) {
        label = `${label} + ${retainerTrait.validLevel} [Lacaios x${retainerTrait.realLevel} - penalidade de Quebra de Máscara x${totalMasquerade}]`;
      } else {
        label = `${label} + ${retainerTrait.validLevel} [Lacaios x${retainerTrait.realLevel}]`;
      }
    }

    if (actionsList.length > 0) {
      label = `${label} - ${actionsList.length} [Ações Realizadas]`;
    }

    return label;
  }, [
    actionsList.length,
    morality.realLevel,
    morality.trait,
    morality.validLevel,
    retainerTrait.realLevel,
    retainerTrait.validLevel,
    totalMasquerade,
  ]);

  const parseMorality = useCallback((trait: ITrait) => {
    const moralityTrait = trait.trait.replace('Morality: ', '');
    let refMoralityLevel: number;

    const traitUpdatedDate = trait.updated_at
      ? new Date(trait.updated_at)
      : new Date();

    if (isAfter(traitUpdatedDate, new Date('2022-11-01T00:00:00.000Z'))) {
      const fullMoralityLevel = Number(trait.level);
      refMoralityLevel =
        fullMoralityLevel === 1
          ? fullMoralityLevel
          : Math.floor(fullMoralityLevel / 2);
    } else {
      refMoralityLevel = Number(trait.level);
    }

    const newMorality: IShortTrait = {
      trait: moralityTrait,
      realLevel: trait.level,
      validLevel: refMoralityLevel,
    };

    setMorality(newMorality);
  }, []);

  const loadDomainMasquerade = useCallback(async () => {
    if (char.id === '') {
      return;
    }

    try {
      await api.get('/domain/masqueradeLevel').then(response => {
        const res: number = response.data.masquerade_level;

        setDomainMasquerade(res);
      });
    } catch (error) {
      const parsedError: any = error;

      if (parsedError.response) {
        const { message } = parsedError.response.data;

        if (parsedError.response.status !== 401) {
          addToast({
            type: 'error',
            title:
              'Erro ao tentar recuperar o nível de Quebra de Máscara atual',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
  }, [addToast, char.id]);

  const loadCurrentActionMonth = useCallback(async () => {
    if (char.id === '') {
      return;
    }

    try {
      await api.get('/influenceactions/currentMonth').then(response => {
        const res: string = response.data.action_month;

        setActionMonth(res);
      });
    } catch (error) {
      const parsedError: any = error;

      if (parsedError.response) {
        const { message } = parsedError.response.data;

        if (parsedError.response.status !== 401) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar recuperar o período atual',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
  }, [addToast, char.id]);

  const loadTraits = useCallback(async () => {
    if (loadingTraits.current === true) return;
    loadingTraits.current = true;

    clearUpdatedTrait();
    clearReloadTraits();

    if (char.id === '') {
      return;
    }

    loadDomainMasquerade();

    try {
      await api.get(`/character/traits/${char.id}`).then(response => {
        const res: ITrait[] = response.data;

        const traitTypeList: string[] = [];

        const newTraitsList: ITraitsList = {
          masquerade: {} as ITrait,
          morality: {} as ITrait,
          attributes: [],
          abilities: [],
          backgrounds: [],
          influences: [],
        } as ITraitsList;

        let newRetainer: IShortTrait = {
          trait: '',
          realLevel: 0,
          validLevel: 0,
        };

        res.forEach(trait => {
          const traitType = trait.type;

          if (traitTypeList.indexOf(traitType) === -1) {
            traitTypeList.push(traitType);
          }
          let traitLevel = Number(trait.level);

          const tempLevels = trait.level_temp
            ? trait.level_temp.split('|')
            : [];
          const levelArray: ILevel[] = [];

          if (tempLevels.length === traitLevel && trait.level_temp !== null) {
            tempLevels.reverse();

            while (traitLevel > 0) {
              const status = tempLevels[traitLevel - 1];
              const level: ILevel = {
                id: `${trait.type}|${trait.trait}|${traitLevel}`,
                enabled: false,
                level: traitLevel,
                status,
              };

              levelArray.push(level);
              traitLevel -= 1;
            }
          } else {
            while (traitLevel > 0) {
              const level: ILevel = {
                id: `${trait.type}|${trait.trait}|${traitLevel}`,
                enabled: false,
                level: traitLevel,
                status: 'full',
              };

              levelArray.push(level);
              traitLevel -= 1;
            }
          }

          const newTrait = trait;
          newTrait.levelArray = levelArray;

          // Initial point for temporary level
          let tempLevelCount = 0;
          newTrait.levelArray.forEach(level => {
            if (level.status === 'full') tempLevelCount += 1;
          });

          newTrait.levelTemp = tempLevelCount;

          switch (traitType) {
            case 'creature':
              if (newTrait.trait === 'Personal Masquerade') {
                setPersonalMasqueradeLevel(newTrait.levelTemp);
                newTraitsList.masquerade = newTrait;
              }
              break;
            case 'virtues':
              if (newTrait.trait.indexOf('Morality') >= 0) {
                newTrait.index = [1, 1];

                parseMorality(newTrait);
                newTraitsList.morality = newTrait;
              }
              break;
            case 'attributes':
              switch (newTrait.trait) {
                case 'Physical':
                  newTrait.index = [0, 1];
                  break;
                case 'Social':
                  newTrait.index = [0, 2];
                  break;
                case 'Mental':
                  newTrait.index = [0, 3];
                  break;
                default:
                  newTrait.index = [-1, -1];
              }

              newTraitsList.attributes.push(newTrait);
              break;
            case 'abilities':
              newTrait.index = [-1, -1];
              newTraitsList.abilities.push(newTrait);
              break;
            case 'backgrounds':
              newTrait.index = [-1, -1];
              newTraitsList.backgrounds.push(newTrait);

              if (newTrait.trait === 'Retainers') {
                newRetainer = {
                  trait: newTrait.trait,
                  realLevel: newTrait.level,
                  validLevel: 0,
                };

                setRetainerTrait(newRetainer);
              }
              break;
            case 'influences':
              newTrait.index = [-1, -1];
              newTraitsList.influences.push(newTrait);
              break;
            default:
          }
        });

        if (traitTypeList.length > 0) {
          newTraitsList.attributes.sort((traitA: ITrait, traitB: ITrait) => {
            if (traitA.index < traitB.index) return -1;
            if (traitA.index > traitB.index) return 1;

            if (traitA.index[0] === traitB.index[0]) {
              if (traitA.index[1] < traitB.index[1]) return -1;
              if (traitA.index[1] > traitB.index[1]) return 1;
            }

            return 0;
          });

          newTraitsList.abilities.sort((traitA: ITrait, traitB: ITrait) => {
            if (traitA.trait < traitB.trait) return -1;
            if (traitA.trait > traitB.trait) return 1;

            return 0;
          });

          newTraitsList.backgrounds.sort((traitA: ITrait, traitB: ITrait) => {
            if (traitA.trait < traitB.trait) return -1;
            if (traitA.trait > traitB.trait) return 1;

            return 0;
          });

          newTraitsList.influences.sort((traitA: ITrait, traitB: ITrait) => {
            if (traitA.trait < traitB.trait) return -1;
            if (traitA.trait > traitB.trait) return 1;

            return 0;
          });

          setTraitsList(newTraitsList);
        }
      });
    } catch (error) {
      const parsedError: any = error;

      if (parsedError.response) {
        const { message } = parsedError.response.data;

        if (parsedError.response.status !== 401) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar traits do personagens',
            description: `Erro: '${message}'`,
          });
        }
      }
    }

    loadingTraits.current = false;
  }, [
    clearUpdatedTrait,
    clearReloadTraits,
    char.id,
    loadDomainMasquerade,
    parseMorality,
    addToast,
  ]);

  const loadActions = useCallback(async () => {
    if (char.id === '' || actionMonth === '') {
      return;
    }

    setBusy(true);

    try {
      await api.post('/influenceactions/list').then(response => {
        const res: IAction[] = response.data;

        const currentActions = res.filter(
          action => action.action_period === actionMonth,
        );

        const pastActions = res.filter(
          action => action.action_period !== actionMonth,
        );

        setActionsList(currentActions);
        setPastActionsList(pastActions);
        setShowPastActionsList(pastActions);
      });
    } catch (error) {
      const parsedError: any = error;

      if (parsedError.response) {
        const { message } = parsedError.response.data;

        if (parsedError.response.status !== 401) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar recuperar a lista de ações do personagem',
            description: `Erro: '${message}'`,
          });
        }
      }
    }

    setBusy(false);
  }, [actionMonth, addToast, char.id]);

  const handleSearchChange = useCallback(
    event => {
      const inputText = event.target.value;
      let newPastActionsList: IAction[];

      if (inputText === '') {
        newPastActionsList = [...pastActionsList];
      } else {
        newPastActionsList = pastActionsList.filter(action => {
          if (
            action.title.toLowerCase().indexOf(inputText.toLowerCase()) >= 0 ||
            action.action_period.indexOf(inputText) >= 0 ||
            getInfluencePT(action.influence)
              .toLowerCase()
              .indexOf(inputText.toLowerCase()) >= 0 ||
            getStatusPT(action.status)
              .toLowerCase()
              .indexOf(inputText.toLowerCase()) >= 0 ||
            getResultPT(action.result)
              .toLowerCase()
              .indexOf(inputText.toLowerCase()) >= 0
          )
            return true;

          return false;
        });
      }

      setShowPastActionsList(newPastActionsList);
    },
    [getInfluencePT, getResultPT, getStatusPT, pastActionsList],
  );

  const handleClose = useCallback(() => {
    setAddActionOn(false);
  }, []);

  const handleAddNewAction = useCallback(() => {
    const action: IAction = {
      title: '',
      action_period: actionMonth,
      backgrounds: '',
      influence: '',
      influence_level: -1,
      ability: '',
      ability_level: -1,
      endeavor: 'other',
      character_id: char.id,
      action: '',
      result: 'not evaluated',
    };

    setSelectedAction(action);
    setReadOnlyAction(false);
    setAddActionOn(true);
  }, [actionMonth, char.id]);

  const handleViewAction = useCallback((action: IAction) => {
    setSelectedAction(action);
    setReadOnlyAction(true);
    setAddActionOn(true);
  }, []);

  const handleEditAction = useCallback((action: IAction) => {
    setSelectedAction(action);
    setReadOnlyAction(false);
    setAddActionOn(true);
  }, []);

  const GetActionsList = useCallback(
    (list: IAction[], current: boolean) => {
      if (list.length === 0) {
        const message = current
          ? 'Nenhuma ação enviada até o momento'
          : 'Nenhuma ação encontrada';

        return (
          <StyledTableRow>
            <StyledTableCell align="left">{message}</StyledTableCell>
            <StyledTableCell align="center" />
            <StyledTableCell align="center" />
            <StyledTableCell align="center" />
            <StyledTableCell align="center" />
            <StyledTableCell align="center" />
          </StyledTableRow>
        );
      }

      return list.map(action => (
        <StyledTableRow key={action.id}>
          <StyledTableCell align="left">{action.title}</StyledTableCell>
          <StyledTableCell align="center">
            {getInfluencePT(action.influence)}
          </StyledTableCell>
          <StyledTableCell align="center">
            {action.action_period}
          </StyledTableCell>
          <StyledTableCell align="center">
            {getStatusPT(action.status)}
          </StyledTableCell>
          <StyledTableCell align="center">
            {getResultPT(action.result)}
          </StyledTableCell>
          <StyledTableCell align="center">
            <ActionsContainer>
              {action.status === 'replied' ? (
                <ActionButton
                  title="Visualizar"
                  onClick={() => handleViewAction(action)}
                >
                  <FiEye />
                </ActionButton>
              ) : (
                <>
                  <ActionButton
                    title="Editar"
                    onClick={() => handleEditAction(action)}
                  >
                    <FiEdit />
                  </ActionButton>
                  <ActionButton title="Remover">
                    <FiTrash2 />
                  </ActionButton>
                </>
              )}
            </ActionsContainer>
          </StyledTableCell>
        </StyledTableRow>
      ));
    },
    [
      getInfluencePT,
      getResultPT,
      getStatusPT,
      handleEditAction,
      handleViewAction,
    ],
  );

  useEffect(() => {
    if (retainerTrait.trait !== '') {
      const newTotalMasquerade =
        Number(domainMasquerade) + Number(personalMasqueradeLevel);

      setTotalMasquerade(newTotalMasquerade);
      if (newTotalMasquerade < 3) {
        return;
      }

      const newMasqueradePenalty = Math.floor(newTotalMasquerade / 3);
      const retainerValidLevel =
        retainerTrait.realLevel < newMasqueradePenalty
          ? 0
          : retainerTrait.realLevel - newMasqueradePenalty;

      setRetainerTrait({
        trait: retainerTrait.trait,
        realLevel: retainerTrait.realLevel,
        validLevel: retainerValidLevel,
      });
    }
  }, [
    domainMasquerade,
    personalMasqueradeLevel,
    retainerTrait.realLevel,
    retainerTrait.trait,
  ]);

  useEffect(() => {
    if (morality.validLevel > 0) {
      const newActionsNumber =
        Number(morality.validLevel) +
        Number(retainerTrait.validLevel) -
        Number(actionsList.length);

      setActionsNumber(newActionsNumber);
    }
  }, [actionsList.length, morality.validLevel, retainerTrait.validLevel]);

  useEffect(() => {
    if (actionMonth !== '') {
      loadActions();
    }
  }, [actionMonth, loadActions]);

  useEffect(() => {
    if (loadingTraits.current === false) {
      setCurrentPage('actions');
      loadCurrentActionMonth();
      loadTraits();
      // loadActions();
    }
  }, [loadActions, loadCurrentActionMonth, loadTraits, setCurrentPage]);

  return (
    <Container isMobile={false}>
      <TitleBox>
        <strong>Ações de Influências e Downtime</strong>
      </TitleBox>
      <ActionHeader>
        <h2>{char.name}</h2>
        <ActionsInfo>
          <h3>{`Ações Disponíveis: ${actionsNumber}`}</h3>
          {actionMonth !== '' && <h3>{`Período atual: ${actionMonth}`}</h3>}
        </ActionsInfo>
        <ActionsInfo>
          <span>{getActionsNumberLabel()}</span>
        </ActionsInfo>
      </ActionHeader>

      <TableWrapper>
        <TableTitleRow borderTop>
          <h2>
            {`Ações do período atual${
              actionMonth !== '' ? `: ${actionMonth}` : ''
            }`}
          </h2>
          <AddActionBox
            onClick={() => handleAddNewAction()}
            disabled={actionsNumber === 0}
          >
            <AddButton disabled={actionsNumber === 0}>
              <FiPlus />
            </AddButton>
            <span>Realizar nova ação</span>
          </AddActionBox>
        </TableTitleRow>
        <StyledTableContainer>
          <StyledTable stickyHeader>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableCell>Ação</StyledTableCell>
                <StyledTableCell>Influência</StyledTableCell>
                <StyledTableCell>Período</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Resultado</StyledTableCell>
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
                  <StyledTableCell align="center">
                    <Skeleton />
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                GetActionsList(actionsList, true)
              )}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>
      </TableWrapper>

      <TableWrapper>
        <TableTitleRow borderTop>
          <h2>Ações dos períodos anteriores</h2>
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
        </TableTitleRow>
        <StyledTableContainer>
          <StyledTable stickyHeader>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableCell>Ação</StyledTableCell>
                <StyledTableCell>Influência</StyledTableCell>
                <StyledTableCell>Período</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Resultado</StyledTableCell>
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
                  <StyledTableCell align="center">
                    <Skeleton />
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                GetActionsList(showPastActionsList, false)
              )}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>
      </TableWrapper>
      <AddAction
        open={addActionOn}
        handleClose={handleClose}
        handleSave={handleClose}
        selectedAction={selectedAction}
        charTraitsList={traitsList}
        readonly={readOnlyAction}
      />
    </Container>
  );
};

export default InfluenceActions;
