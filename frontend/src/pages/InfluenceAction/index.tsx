/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback, useRef } from 'react';

import { isAfter } from 'date-fns';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import {
  FaEnvelope,
  FaEnvelopeOpenText,
  FaFileSignature,
  FaCheckCircle,
  FaInfoCircle,
  FaTimesCircle,
  FaClock,
} from 'react-icons/fa';
import Skeleton from '@material-ui/lab/Skeleton';
import api from '../../services/api';
import Action from '../../components/Action';

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
  StyledTableBody,
  AddActionBox,
  AddButton,
  SearchBox,
  ActionsContainer,
  ActionButton,
  IconBox,
} from './styles';

import SearchField from '../../components/SearchField';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useSocket } from '../../hooks/socket';
import { useHeader } from '../../hooks/header';

import influencesAbilities from '../Influences/influencesAbilities.json';
import ICharacter from '../../components/CharacterList/ICharacter';

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
  populated: boolean;
}

interface IShortTrait {
  trait: string;
  realLevel: number;
  validLevel: number;
}

interface IUsedTrait {
  trait: string;
  usedLevel: number;
}

interface IAction {
  id?: string;
  title: string;
  action_period: string;
  backgrounds: string;
  influence: string;
  influence_level: number;
  influence_effective_level: number;
  ability: string;
  ability_level: number;
  action_owner_id: string;
  endeavor: 'attack' | 'defend' | 'combine' | 'raise capital' | 'other';
  character_id: string;
  storyteller_id?: string;
  action: string;
  action_force?: number;
  status?: 'sent' | 'read' | 'replied';
  st_reply?: string;
  news?: string;
  result?: 'success' | 'partial' | 'fail' | 'not evaluated';
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
  storytellerId?: {
    id: string;
    name: string;
  };
}

const InfluenceActions: React.FC = () => {
  const loadingTraits = useRef<boolean>(false);
  const [myChar, setMyChar] = useState<ICharacter>({} as ICharacter);
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
    populated: false,
  } as ITraitsList);
  const [parsedTaitsList, setParsedTraitsList] = useState<ITraitsList>({
    masquerade: {} as ITrait,
    morality: {} as ITrait,
    attributes: [],
    abilities: [],
    backgrounds: [],
    influences: [],
    populated: false,
  } as ITraitsList);
  const [retainerList, setRetainerList] = useState<ICharacter[]>([]);
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

  const [addActionOn, setActionOn] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<IAction>({} as IAction);
  const [readOnlyAction, setReadOnlyAction] = useState<boolean>(false);

  const { addToast } = useToast();
  const { char } = useAuth();
  const { clearUpdatedTrait, clearReloadTraits } = useSocket();
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
        statusPT = 'Enviada';
        break;
      case 'read':
        statusPT = 'Lida';
        break;
      case 'replied':
        statusPT = 'Respondida';
        break;
      default:
        statusPT = '';
    }

    return statusPT;
  }, []);

  const getStatusIcon = useCallback(status => {
    let MyIcon;

    switch (status) {
      case 'sent':
        MyIcon = <FaEnvelope />;
        break;
      case 'read':
        MyIcon = <FaEnvelopeOpenText />;
        break;
      case 'replied':
        MyIcon = <FaFileSignature />;
        break;
      default:
        MyIcon = null;
    }

    return MyIcon;
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
        resultPT = 'Não avaliada';
        break;
      default:
        resultPT = '';
    }

    return resultPT;
  }, []);

  const getResultIcon = useCallback(result => {
    let MyIcon;

    switch (result) {
      case 'success':
        MyIcon = <FaCheckCircle />;
        break;
      case 'partial':
        MyIcon = <FaInfoCircle />;
        break;
      case 'fail':
        MyIcon = <FaTimesCircle />;
        break;
      case 'not evaluated':
        MyIcon = <FaClock />;
        break;
      default:
        MyIcon = null;
    }

    return MyIcon;
  }, []);

  const getResultColor = useCallback(result => {
    let resultColor: string;

    switch (result) {
      case 'success':
        resultColor = 'positive';
        break;
      case 'partial':
        resultColor = 'partial';
        break;
      case 'fail':
        resultColor = 'negative';
        break;
      case 'not evaluated':
      default:
        resultColor = 'weak';
    }

    return resultColor;
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

    if (moralityTrait !== 'Humanity') {
      refMoralityLevel -= 2;
    }

    const newMorality: IShortTrait = {
      trait: moralityTrait,
      realLevel: trait.level,
      validLevel: refMoralityLevel,
    };

    setMorality(newMorality);
  }, []);

  const loadDomainMasquerade = useCallback(async () => {
    if (char.id !== '') {
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
          populated: true,
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

  const parseUsedTraits = useCallback(
    (oldTraits: ITrait[], usedTraits: IUsedTrait[]) => {
      const newTraits = oldTraits.map(myTrait => {
        const newTrait = { ...myTrait };
        const myUsedTraits = usedTraits.filter(
          myUsedTrait => myUsedTrait.trait === myTrait.trait,
        );
        if (myUsedTraits.length > 0) {
          const usedLevel = myUsedTraits.reduce(
            (acc, cur) => acc + cur.usedLevel,
            0,
          );

          const auxLevel = Number(myTrait.level) - usedLevel;
          const currentLevel = auxLevel < 0 ? 0 : auxLevel;
          newTrait.levelTemp = currentLevel;
        }

        return newTrait;
      });

      return newTraits;
    },
    [],
  );

  const parseTraitsList = useCallback(
    currentActions => {
      if (traitsList.populated) {
        if (currentActions.length === 0) {
          setParsedTraitsList(traitsList);
        } else {
          let usedInfluences: IUsedTrait[] = [];
          let usedBackgrounds: IUsedTrait[] = [];
          let usedAbilities: IUsedTrait[] = [];

          currentActions.forEach((myAction: IAction) => {
            const bgs = myAction.backgrounds;
            const splittedBgs = bgs.split('|');
            const newUsedBackgrounds = splittedBgs.map(myBg => {
              const bgWithLevel = myBg.split(' x');
              const newBg: IUsedTrait = {
                trait: bgWithLevel[0],
                usedLevel: Number(bgWithLevel[1]),
              };

              return newBg;
            });

            const newUsedInfluence: IUsedTrait = {
              trait: myAction.influence,
              usedLevel: Number(myAction.influence_level),
            };

            const newUsedAbility: IUsedTrait = {
              trait: myAction.ability,
              usedLevel: Number(myAction.ability_level),
            };

            usedInfluences = [...usedInfluences, newUsedInfluence];
            usedBackgrounds = [...usedBackgrounds, ...newUsedBackgrounds];
            usedAbilities = [...usedAbilities, newUsedAbility];
          });

          const oldAbilities = [...traitsList.abilities];
          const oldBackgrounds = [...traitsList.backgrounds];
          const oldInfluences = [...traitsList.influences];

          const newAbilities = parseUsedTraits(oldAbilities, usedAbilities);

          const newBackgrounds = parseUsedTraits(
            oldBackgrounds,
            usedBackgrounds,
          );
          const newInfluences = parseUsedTraits(oldInfluences, usedInfluences);

          const newParsedTraitsList = {
            ...traitsList,
            abilities: newAbilities,
            backgrounds: newBackgrounds,
            influences: newInfluences,
          };

          setParsedTraitsList(newParsedTraitsList);
        }
      }
    },
    [parseUsedTraits, traitsList],
  );

  const loadActions = useCallback(
    async (busy = true) => {
      if (char.id === '' || actionMonth === '') {
        return;
      }

      setBusy(busy);

      try {
        await api
          .post('/influenceactions/list', { char_id: char.id })
          .then(response => {
            const res: IAction[] = response.data;

            const currentActions = res.filter(
              action => action.action_period === actionMonth,
            );

            const pastActions = res.filter(
              action => action.action_period !== actionMonth,
            );

            setActionsList(currentActions);
            parseTraitsList(currentActions);
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
    },
    [actionMonth, addToast, char.id, parseTraitsList],
  );

  const loadRetainers = useCallback(async () => {
    if (char.id === '') {
      return;
    }

    try {
      await api
        .post('/character/retainerslist', {
          character_id: char.id,
          situation: 'active',
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
  }, [addToast, char.id]);

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

  const handleUpdateAction = useCallback(() => {
    loadActions(false);
    setActionOn(false);

    const action: IAction = {
      title: '',
      action_period: actionMonth,
      backgrounds: '',
      influence: '',
      influence_level: 0,
      influence_effective_level: 0,
      ability: '',
      ability_level: 0,
      endeavor: 'other',
      character_id: myChar.id,
      characterId: myChar,
      action_owner_id: myChar.id,
      ownerId: myChar,
      action: '',
      result: 'not evaluated',
    };

    setSelectedAction(action);
  }, [actionMonth, loadActions, myChar]);

  const handleClose = useCallback(() => {
    setActionOn(false);

    const action: IAction = {
      title: '',
      action_period: actionMonth,
      backgrounds: '',
      influence: '',
      influence_level: 0,
      influence_effective_level: 0,
      ability: '',
      ability_level: 0,
      endeavor: 'other',
      character_id: myChar.id,
      characterId: myChar,
      action_owner_id: myChar.id,
      ownerId: myChar,
      action: '',
      result: 'not evaluated',
    };

    setSelectedAction(action);
  }, [actionMonth, myChar]);

  const handleAddNewAction = useCallback(() => {
    if (actionsNumber === 0 || actionMonth === '') return;

    const action: IAction = {
      title: '',
      action_period: actionMonth,
      backgrounds: '',
      influence: '',
      influence_level: 0,
      influence_effective_level: 0,
      ability: '',
      ability_level: 0,
      endeavor: 'other',
      character_id: myChar.id,
      characterId: myChar,
      action_owner_id: myChar.id,
      ownerId: myChar,
      action: '',
      result: 'not evaluated',
    };

    setSelectedAction(action);
    setReadOnlyAction(false);
    setActionOn(true);
  }, [actionMonth, actionsNumber, myChar]);

  const handleViewAction = useCallback((action: IAction) => {
    setSelectedAction(action);
    setReadOnlyAction(true);
    setActionOn(true);
  }, []);

  const handleEditAction = useCallback((action: IAction) => {
    setSelectedAction(action);
    setReadOnlyAction(false);
    setActionOn(true);
  }, []);

  const handleRemoveAction = useCallback(
    async (action: IAction) => {
      if (action.id === undefined) return;

      try {
        await api.delete('/influenceactions/delete', {
          data: { id: action.id },
        });

        addToast({
          type: 'success',
          title: 'Ação removida!',
          description: 'Ação removida com sucesso!',
        });

        await loadActions();
      } catch (error) {
        const parsedError: any = error;

        if (parsedError.response) {
          const { message } = parsedError.response.data;

          if (parsedError.response.status !== 401) {
            addToast({
              type: 'error',
              title: 'Erro ao deletar ação',
              description: `Erro: '${message}'`,
            });
          }
        }
      }
    },
    [addToast, loadActions],
  );

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
            <IconBox
              colorInterface={
                action.status === 'replied' ? 'positive' : 'neutral'
              }
              title={
                action.status === 'replied' && action.storytellerId?.name
                  ? `${getStatusPT(action.status)} por ${
                      action.storytellerId?.name
                    }`
                  : getStatusPT(action.status)
              }
            >
              {getStatusIcon(action.status)}
            </IconBox>
          </StyledTableCell>
          <StyledTableCell align="center">
            <IconBox
              colorInterface={getResultColor(action.result)}
              title={getResultPT(action.result)}
            >
              {getResultIcon(action.result)}
            </IconBox>
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
                  <ActionButton
                    title="Remover"
                    onClick={() => handleRemoveAction(action)}
                  >
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
      getResultColor,
      getResultIcon,
      getResultPT,
      getStatusIcon,
      getStatusPT,
      handleEditAction,
      handleRemoveAction,
      handleViewAction,
    ],
  );

  useEffect(() => {
    if (retainerTrait.trait !== '') {
      const newTotalMasquerade =
        Number(domainMasquerade) + Number(personalMasqueradeLevel);

      setTotalMasquerade(newTotalMasquerade);
      if (newTotalMasquerade < 3) {
        setRetainerTrait({
          trait: retainerTrait.trait,
          realLevel: retainerTrait.realLevel,
          validLevel: retainerTrait.realLevel,
        });

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
    if (actionMonth !== '' && traitsList.populated) {
      loadActions();
    }
  }, [actionMonth, loadActions, traitsList]);

  useEffect(() => {
    if (char.id !== '') {
      setMyChar(char as ICharacter);
    }
  }, [char]);

  useEffect(() => {
    if (loadingTraits.current === false) {
      setCurrentPage('actions');
      loadCurrentActionMonth();
      loadRetainers();
      loadTraits();
    }
  }, [loadCurrentActionMonth, loadRetainers, loadTraits, setCurrentPage]);

  return (
    <Container isMobile={false}>
      <TitleBox>
        <strong>Ações de Influências e Downtime</strong>
      </TitleBox>
      <ActionHeader>
        <h2>{myChar.name}</h2>
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
            disabled={actionsNumber === 0 || actionMonth === ''}
          >
            <AddButton disabled={actionsNumber === 0 || actionMonth === ''}>
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
      <Action
        open={addActionOn}
        handleClose={handleClose}
        handleSave={handleUpdateAction}
        selectedAction={selectedAction}
        charTraitsList={parsedTaitsList} // traitsList}
        retainerList={retainerList}
        readonly={readOnlyAction}
      />
    </Container>
  );
};

export default InfluenceActions;
