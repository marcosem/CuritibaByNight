/* eslint-disable camelcase */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
} from 'react';

import {
  Dialog,
  DialogProps,
  Slide,
  DialogTitle,
  MenuItem,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
// import * as Yup from 'yup';

// import api from '../../services/api';
// import { useToast } from '../../hooks/toast';
// import getValidationErrors from '../../utils/getValidationErrors';
import { FiPlus, FiX } from 'react-icons/fi';

import influencesAbilities from '../../pages/Influences/influencesAbilities.json';

import {
  AddActionContainer,
  FieldBox,
  FieldBoxChild,
  InputField,
  ActionButton,
  ButtonsContainer,
  ButtonBox,
} from './styles';

import Button from '../Button';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

export interface ITraitsList {
  masquerade: ITrait;
  morality: ITrait;
  attributes: ITrait[];
  abilities: ITrait[];
  backgrounds: ITrait[];
  influences: ITrait[];
}

export interface IAction {
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

interface IError {
  title?: string;
  backgrounds?: string;
  influence?: string;
  ability?: string;
  action?: string;
  st_reply?: string;
  news?: string;
  result?: 'success' | 'partial' | 'fail' | 'not evaluated';
}

interface IInfluence {
  influence: string;
  influence_PT: string;
  ability: string;
}

interface IBackground {
  background: string;
  level: number;
  validLevel: number;
  force?: number;
}

interface IDefendEndeavor {
  title: string;
  influence_level: number;
  ability: string;
  ability_level: number;
  action: string;
}

const endeadorList = [
  {
    title: 'attack',
    titlePT: 'Ataque',
  },
  {
    title: 'defend',
    titlePT: 'Defesa',
  },
  {
    title: 'combine',
    titlePT: 'Combinar',
  },
  {
    title: 'raise capital',
    titlePT: 'Levantar Capital',
  },
  {
    title: 'other',
    titlePT: 'Outro',
  },
];

interface DialogPropsEx extends DialogProps {
  selectedAction: IAction;
  charTraitsList: ITraitsList;
  readonly?: boolean;
  storyteller?: boolean;
  handleSave: (savedAction: IAction) => void;
  handleClose: () => void;
}

const AddAction: React.FC<DialogPropsEx> = ({
  selectedAction,
  charTraitsList,
  readonly,
  storyteller,
  handleSave,
  handleClose,
  ...rest
}) => {
  const formRef = useRef<FormHandles>(null);
  const [action, setAction] = useState<IAction>({} as IAction);
  const traitsList = useRef<ITraitsList>({
    masquerade: {} as ITrait,
    morality: {} as ITrait,
    attributes: [],
    abilities: [],
    backgrounds: [],
    influences: [],
  } as ITraitsList);
  const influenceList = useRef<IInfluence[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<IError>(
    {} as IError,
  );

  const [title, setTitle] = useState<string>('');
  const [influence, setInfluence] = useState<string>('');

  const [influenceLevel, setInfluenceLevel] = useState<number>(0);
  const [backgrounds, setBackgrounds] = useState<string>('');
  const [backgroundList, setBackgroundList] = useState<IBackground[]>([]);
  const [influenceLevelArray, setInfluenceLevelArray] = useState<number[]>([]);
  const [endeavor, setEndeavor] = useState<string>('other');
  const [ability, setAbility] = useState<string>('');
  const [abilityLevel, setAbilityLevel] = useState<number>(0);
  const [abilityLevelArray, setAbilityLevelArray] = useState<number[]>([0]);
  const [actionForce, setActionForce] = useState<number>(0);
  const [backgroundToAdd, setBackgroundToAdd] = useState<string>('');
  const [backgroundToAddLevel, setBackgroundToAddLevel] = useState<number>(0);
  const [backgroundLevelArray, setBackgroundLevelArray] = useState<number[]>([
    0,
  ]);
  const [actionDescription, setActionDescription] = useState<string>('');
  const [stReply, setStReply] = useState<string>('');
  const [news, setNews] = useState<string>('');
  const [defendEndeavor, setDefendEndeavor] = useState<IDefendEndeavor>(
    {} as IDefendEndeavor,
  );

  const getInfluencePT = useCallback((influenceEn): string => {
    const infItem = influenceList.current.find(
      inf => inf.influence === influenceEn,
    );

    if (infItem) {
      return infItem.influence_PT;
    }

    return '';
  }, []);

  const getInfluenceByLabel = useCallback(label => {
    const influenceFound = influenceList.current.find(
      inf => inf.influence_PT === label,
    );

    if (influenceFound) return influenceFound.influence;

    return '';
  }, []);

  const getEndeavorPT = useCallback((endeavorEn): string => {
    const endeavorItem = endeadorList.find(endea => endea.title === endeavorEn);

    if (endeavorItem) {
      return endeavorItem.titlePT;
    }

    return '';
  }, []);

  const getEndeavorByLabel = useCallback((label): string => {
    const endeavorItem = endeadorList.find(endea => endea.titlePT === label);

    if (endeavorItem) {
      return endeavorItem.title;
    }

    return 'other';
  }, []);

  const buildInfluenceList = useCallback(() => {
    const newInfluenceList = [...influencesAbilities.influences].sort(
      (infA: IInfluence, infB: IInfluence) => {
        if (infA.influence_PT < infB.influence_PT) return -1;
        if (infA.influence_PT > infB.influence_PT) return 1;
        return 0;
      },
    );

    influenceList.current = newInfluenceList;
  }, []);

  const getTitle = useCallback(() => {
    let pageTitle: string;
    if (readonly) {
      pageTitle = 'Visualizar Ação';
    } else if (action.id) {
      pageTitle = 'Editar Ação';
    } else {
      pageTitle = 'Nova Ação';
    }

    return pageTitle;
  }, [action.id, readonly]);

  const getCharInfluenceLevel = useCallback(charInfluence => {
    const influenceTrait: ITrait | undefined =
      traitsList.current.influences.find(inf => inf.trait === charInfluence);

    let level = 0;
    if (influenceTrait) {
      level = influenceTrait.levelTemp;
    }

    return level;
  }, []);

  const handleChangeTitle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const changedValue = event.target.value;

      setTitle(changedValue);
      setHasChanges(true);
    },
    [],
  );

  const updateInfluenceLevelArray = useCallback((infLevel: number) => {
    const levelArray = [0];
    for (let i = 1; i <= infLevel; i += 1) {
      levelArray.push(i);
    }

    setInfluenceLevelArray(levelArray);
  }, []);

  const updateAbilityLevelArray = useCallback(newAbility => {
    if (newAbility === '') return;

    const abilityTrait = traitsList.current.abilities.find(
      trait => trait.trait === newAbility,
    );

    if (abilityTrait === undefined) return;

    const maxLevel = abilityTrait.level;

    const levelArray = [0];
    for (let i = 1; i <= maxLevel; i += 1) {
      levelArray.push(i);
    }

    setAbilityLevelArray(levelArray);
  }, []);

  const updateBackgroundToAddLevelArray = useCallback(newBg => {
    if (newBg === '') return;

    const bgTrait = traitsList.current.backgrounds.find(
      trait => trait.trait === newBg,
    );

    if (bgTrait === undefined) return;

    const maxLevel = bgTrait.level;

    const levelArray = [0];
    for (let i = 1; i <= maxLevel; i += 1) {
      levelArray.push(i);
    }

    setBackgroundLevelArray(levelArray);
  }, []);

  const handleDefendEndeavor = useCallback(
    (newInfluence = '') => {
      let newTitle = 'Defender a influência';
      let influence_level = 0;
      let newAbility = '';
      let ability_level = 0;
      // const influenceToHandle = newInfluence;

      if (newInfluence !== '') {
        newTitle = `${newTitle} em ${getInfluencePT(newInfluence)}`;
        const charInfluence = traitsList.current.influences.find(
          trait => trait.trait === newInfluence,
        );

        if (charInfluence) influence_level = charInfluence.level;

        const infAbil = influenceList.current.find(
          inf => inf.influence === newInfluence,
        );
        newAbility = infAbil ? infAbil.ability : '';

        if (newAbility !== '') {
          let charAbilityTrait: ITrait | undefined;

          if (newAbility.indexOf(':') >= 0) {
            const charAbilitiesTraitsList = traitsList.current.abilities.filter(
              trait => trait.trait.indexOf(newAbility) >= 0,
            );

            if (charAbilitiesTraitsList.length === 0) {
              newAbility = '';
            } else {
              charAbilityTrait = charAbilitiesTraitsList.reduce(
                (accTrait, trait) => {
                  return accTrait.level >= trait.level ? accTrait : trait;
                },
              );

              newAbility = charAbilityTrait.trait;
            }
          } else {
            charAbilityTrait = traitsList.current.abilities.find(
              trait => trait.trait === newAbility,
            );
          }

          if (charAbilityTrait) {
            ability_level = charAbilityTrait.level;
          } else {
            newAbility = '';
          }
        }
      }

      const newDefendEndeavor = {
        title: newTitle,
        influence_level,
        ability: newAbility,
        ability_level,
        action: newTitle,
      };

      updateInfluenceLevelArray(influence_level);
      updateAbilityLevelArray(newAbility);
      setDefendEndeavor(newDefendEndeavor);
    },
    [getInfluencePT, updateAbilityLevelArray, updateInfluenceLevelArray],
  );

  const handleInfluenceSelectChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newInfluence = getInfluenceByLabel(event.target.value);

      if (endeavor === 'defend') {
        handleDefendEndeavor(newInfluence);
      }

      setInfluence(newInfluence);
      setInfluenceLevel(0);
      setHasChanges(true);
    },
    [endeavor, getInfluenceByLabel, handleDefendEndeavor],
  );

  const handleInfluenceLevelSelectChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newInfluenceLevel = Number(event.target.value);

      setInfluenceLevel(newInfluenceLevel);
      setHasChanges(true);
    },
    [],
  );

  const handleEndeavorSelectChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newEndeavor = getEndeavorByLabel(event.target.value);

      if (newEndeavor === 'defend') {
        handleDefendEndeavor(influence);
      } else {
        setDefendEndeavor({} as IDefendEndeavor);
      }

      setEndeavor(newEndeavor);
      setHasChanges(true);
    },
    [getEndeavorByLabel, handleDefendEndeavor, influence],
  );

  const handleAbilitySelectChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newAbility = event.target.value;

      setAbility(newAbility);
      updateAbilityLevelArray(newAbility);
      setAbilityLevel(0);
      setHasChanges(true);
    },
    [updateAbilityLevelArray],
  );

  const handleAbilityLevelSelectChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newAbilityLevel = Number(event.target.value);

      setAbilityLevel(newAbilityLevel);
      setHasChanges(true);
    },
    [],
  );

  const handleBackgroundToAddSelectChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newBackgroundToAdd = event.target.value;

      setBackgroundToAdd(newBackgroundToAdd);
      updateBackgroundToAddLevelArray(newBackgroundToAdd);
      setBackgroundToAddLevel(0);
    },
    [updateBackgroundToAddLevelArray],
  );

  const handleBackgroundToAddLevelSelectChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newBackgroundToAddLevel = Number(event.target.value);

      setBackgroundToAddLevel(newBackgroundToAddLevel);
      // setHasChanges(true);
    },
    [],
  );

  const handleAddBackground = useCallback(() => {
    const newBackgroundLabel = `${backgroundToAdd} x${backgroundToAddLevel}`;

    let newBackgrounds;
    if (backgrounds.indexOf(backgroundToAdd) >= 0) {
      const bgList = backgrounds.split('|').map(bg => {
        if (bg.indexOf(backgroundToAdd) >= 0) return newBackgroundLabel;
        return bg;
      });

      newBackgrounds = bgList.join('|');
    } else if (backgrounds === '') {
      newBackgrounds = `${newBackgroundLabel}`;
    } else {
      newBackgrounds = `${backgrounds}|${newBackgroundLabel}`;
    }

    setBackgrounds(newBackgrounds);
  }, [backgroundToAdd, backgroundToAddLevel, backgrounds]);

  const handleRemoveBackground = useCallback(() => {
    if (backgrounds.indexOf(backgroundToAdd) >= 0) {
      const bgList = backgrounds
        .split('|')
        .filter(bg => bg.indexOf(backgroundToAdd) === -1);

      const newBackgrounds = bgList.join('|');
      setBackgrounds(newBackgrounds);
    }
  }, [backgroundToAdd, backgrounds]);

  const handleDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newDescription = event.target.value;

      setActionDescription(newDescription);
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    const todo = 'TODO';

    return todo;
  }, []);

  const sortBgList = useCallback((bgList: IBackground[]) => {
    return bgList.sort((bgA: IBackground, bgB: IBackground) => {
      if (bgA.background < bgB.background) return -1;
      if (bgA.background > bgB.background) return 1;
      return 0;
    });
  }, []);

  const isBgInTheList = useCallback(
    background => {
      const isBgInList =
        backgroundList.findIndex(bg => bg.background === background) >= 0;

      return isBgInList;
    },
    [backgroundList],
  );

  useEffect(() => {
    if (!hasChanges) return;

    const { morality } = traitsList.current;

    let moralityTraitLevel = Math.floor(morality.level / 2);
    let moralityLevel = 0;
    let newActionForce: number;

    if (morality.trait.indexOf('Humanity') === -1) {
      moralityTraitLevel -= 2;
    }

    moralityLevel = moralityTraitLevel > 0 ? moralityTraitLevel : 1;

    switch (endeavor) {
      case 'defend':
        newActionForce =
          Number(defendEndeavor.influence_level) * 2 +
          moralityLevel +
          Number(defendEndeavor.ability_level);
        break;
      case 'combine':
        newActionForce = Number(influenceLevel);
        break;
      default:
        newActionForce =
          Number(influenceLevel) + moralityLevel + Number(abilityLevel);
    }

    setActionForce(newActionForce);
  }, [
    abilityLevel,
    defendEndeavor.ability_level,
    defendEndeavor.influence_level,
    endeavor,
    hasChanges,
    influenceLevel,
  ]);

  useEffect(() => {
    if (backgrounds !== '') {
      const bgList = backgrounds.split('|');
      const parsedBgList: IBackground[] = bgList.map(bg => {
        const newBg = bg.split(' x');

        if (newBg.length !== 2) {
          return {
            background: bg,
            level: 0,
            validLevel: 0,
          } as IBackground;
        }

        const name = newBg[0];
        const level = Number(newBg[1]) || 0;
        let validLevel: number;

        switch (name) {
          case 'Allies':
          case 'Cult':
            validLevel = level - 1;
            break;
          case 'Contacts':
          case 'Assamite: Web of Influence':
          case 'Followers of Set: Fellowship':
            validLevel = level;
            break;
          case 'Resources':
            validLevel = Math.floor(level / 2);
            break;
          default:
            validLevel = 0;
        }

        const parsedBg: IBackground = {
          background: name,
          level,
          validLevel,
        };

        return parsedBg;
      });

      setBackgroundList(sortBgList(parsedBgList));
    }
  }, [backgrounds, sortBgList]);

  useEffect(() => {
    let maxLevel: number;
    const infLevel = getCharInfluenceLevel(influence);

    if (backgroundList.length > 0) {
      const addedValues = [
        ...backgroundList.map(bg => bg.validLevel),
        infLevel,
      ];
      const higherValue = Math.max(...addedValues);

      let baseTaken = false;
      maxLevel = addedValues.reduce((acc, value) => {
        let newValue: number;

        if (value === higherValue && baseTaken === false) {
          newValue = value;
          baseTaken = true;
        } else {
          newValue = value / 2;
        }

        return acc + newValue;
      }, 0);
    } else {
      maxLevel = infLevel;
    }

    updateInfluenceLevelArray(maxLevel);
  }, [
    backgroundList,
    getCharInfluenceLevel,
    influence,
    updateInfluenceLevelArray,
  ]);

  useEffect(() => {
    if (selectedAction.title === undefined) return;
    console.log(selectedAction);

    setInfluence(selectedAction.influence || '');
    setInfluenceLevel(Number(selectedAction.influence_level) || 0);
    setBackgrounds(selectedAction.backgrounds || '');
    setActionForce(selectedAction.action_force || 0);
    setActionDescription(selectedAction.action || '');
    setStReply(selectedAction.st_reply || '');
    setNews(selectedAction.news || '');

    setEndeavor(selectedAction.endeavor || 'other');
    if (selectedAction.endeavor !== 'defend') {
      setTitle(selectedAction.title || '');
      setAbility(selectedAction.ability || '');
      updateAbilityLevelArray(selectedAction.ability);
      setAbilityLevel(selectedAction.ability_level || 0);
    } else {
      handleDefendEndeavor(selectedAction.influence);
    }
  }, [handleDefendEndeavor, selectedAction, updateAbilityLevelArray]);

  useEffect(() => {
    if (selectedAction === undefined) return;

    buildInfluenceList();
    traitsList.current = charTraitsList;
    setAction(selectedAction);
    // populateActionFields(selectedAction);
  }, [buildInfluenceList, charTraitsList, selectedAction]);

  return (
    <Dialog TransitionComponent={Transition} fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{getTitle()}</DialogTitle>
      <AddActionContainer>
        <Form onSubmit={handleSubmit} ref={formRef}>
          <FieldBox>
            <FieldBoxChild proportion={85}>
              <InputField
                name="title"
                id="title"
                label="Título"
                value={endeavor !== 'defend' ? title : defendEndeavor.title}
                InputProps={{ readOnly: readonly || endeavor === 'defend' }}
                onChange={handleChangeTitle}
                fullWidth
                required
                error={!!validationErrors.title}
                helperText={validationErrors.title}
                addmargin="right"
                disabled={saving}
              />
            </FieldBoxChild>
            <FieldBoxChild proportion={15}>
              <InputField
                name="action_period"
                id="action_period"
                label="Período"
                defaultValue={action.action_period}
                InputProps={{ readOnly: true }}
                align="center"
                fullWidth
                disabled={saving}
              />
            </FieldBoxChild>
          </FieldBox>
          <FieldBox>
            <FieldBoxChild proportion={25}>
              <InputField
                name="influence"
                id="influence"
                label="Influência"
                value={getInfluencePT(influence)}
                InputProps={{ readOnly: readonly }}
                onChange={handleInfluenceSelectChange}
                select
                required
                helperText="Selecione a influência"
                align="center"
                fullWidth
                addmargin="right"
                disabled={saving}
              >
                {influenceList.current.map(inf => (
                  <MenuItem key={inf.influence} value={inf.influence_PT}>
                    {inf.influence_PT}
                  </MenuItem>
                ))}
              </InputField>
            </FieldBoxChild>

            <FieldBoxChild proportion={10}>
              <InputField
                name="influence_level"
                id="influence_level"
                label="Nível"
                value={
                  influenceLevelArray.length < 2
                    ? '0'
                    : `${
                        endeavor !== 'defend'
                          ? influenceLevel
                          : defendEndeavor.influence_level
                      }`
                }
                InputProps={{ readOnly: readonly || endeavor === 'defend' }}
                onChange={handleInfluenceLevelSelectChange}
                select
                required
                align="center"
                fullWidth
                disabled={saving}
              >
                {influenceLevelArray.map(level => (
                  <MenuItem key={level} value={`${level}`}>
                    {level}
                  </MenuItem>
                ))}
              </InputField>
            </FieldBoxChild>

            <FieldBoxChild proportion={20} addmargin="auto">
              <InputField
                name="endeavor"
                id="endeavor"
                label="Tipo"
                value={getEndeavorPT(endeavor)}
                InputProps={{ readOnly: readonly }}
                onChange={handleEndeavorSelectChange}
                select
                required
                helperText="Selectione o tipo de ação"
                align="center"
                fullWidth
                disabled={saving}
              >
                {endeadorList.map(endea => (
                  <MenuItem key={endea.title} value={endea.titlePT}>
                    {endea.titlePT}
                  </MenuItem>
                ))}
              </InputField>
            </FieldBoxChild>

            <FieldBoxChild proportion={25} invisible={endeavor === 'combine'}>
              <InputField
                name="ability"
                id="ability"
                label="Habilidade principal"
                value={endeavor !== 'defend' ? ability : defendEndeavor.ability}
                InputProps={{ readOnly: readonly || endeavor === 'defend' }}
                onChange={handleAbilitySelectChange}
                select
                required
                helperText="Selecione uma habilidade"
                align="center"
                fullWidth
                addmargin="right"
                disabled={saving}
              >
                {traitsList.current.abilities.map(abil => (
                  <MenuItem key={abil.id} value={abil.trait}>
                    {abil.trait}
                  </MenuItem>
                ))}
              </InputField>
            </FieldBoxChild>

            <FieldBoxChild proportion={10} invisible={endeavor === 'combine'}>
              <InputField
                name="ability_level"
                id="ability_level"
                label="Nível"
                value={
                  abilityLevelArray.length < abilityLevel
                    ? '0'
                    : `${
                        endeavor !== 'defend'
                          ? abilityLevel
                          : defendEndeavor.ability_level
                      }`
                }
                InputProps={{ readOnly: readonly || endeavor === 'defend' }}
                onChange={handleAbilityLevelSelectChange}
                select
                required
                align="center"
                fullWidth
                disabled={saving}
              >
                {abilityLevelArray.map(level => (
                  <MenuItem key={level} value={`${level}`}>
                    {level}
                  </MenuItem>
                ))}
              </InputField>
            </FieldBoxChild>
          </FieldBox>

          <FieldBox>
            {endeavor !== 'defend' && (
              <>
                <FieldBoxChild proportion={25}>
                  <InputField
                    name="background"
                    id="background"
                    label="Incluir / Excluir Antecedente"
                    value={backgroundToAdd}
                    InputProps={{ readOnly: readonly }}
                    onChange={handleBackgroundToAddSelectChange}
                    select
                    helperText="Reforçar a ação com antecedente"
                    align="center"
                    fullWidth
                    addmargin="right"
                    disabled={saving}
                  >
                    {traitsList.current.backgrounds.map(bg => (
                      <MenuItem key={bg.id} value={bg.trait}>
                        {bg.trait}
                      </MenuItem>
                    ))}
                  </InputField>
                </FieldBoxChild>

                <FieldBoxChild proportion={10}>
                  <InputField
                    name="background_level"
                    id="background_level"
                    label="Nível"
                    value={
                      backgroundLevelArray.length < 2
                        ? '0'
                        : `${backgroundToAddLevel}`
                    }
                    InputProps={{ readOnly: readonly }}
                    onChange={handleBackgroundToAddLevelSelectChange}
                    select
                    align="center"
                    fullWidth
                    disabled={saving}
                  >
                    {backgroundLevelArray.map(level => (
                      <MenuItem key={level} value={`${level}`}>
                        {level}
                      </MenuItem>
                    ))}
                  </InputField>
                </FieldBoxChild>
                <FieldBoxChild proportion={5} flexDirection="column">
                  <ActionButton
                    disabled={
                      saving ||
                      backgroundToAdd === '' ||
                      backgroundToAddLevel === 0
                    }
                    title="Incluir Antecedente"
                    onClick={() => handleAddBackground()}
                  >
                    <FiPlus />
                  </ActionButton>
                  <ActionButton
                    disabled={
                      saving ||
                      backgroundToAdd === '' ||
                      !isBgInTheList(backgroundToAdd)
                    }
                    color="red"
                    title="Excluir Antecedente"
                    onClick={() => handleRemoveBackground()}
                  >
                    <FiX />
                  </ActionButton>
                </FieldBoxChild>
                <FieldBoxChild proportion={50}>
                  <InputField
                    name="backgrounds"
                    id="backgrounds"
                    label="Antecedentes adicionados"
                    value={backgrounds.replaceAll('|', ', ')}
                    InputProps={{ readOnly: true }}
                    align="left"
                    multiline
                    minRows={2}
                    maxRows={2}
                    fullWidth
                    addmargin="right"
                    disabled={saving}
                  />
                </FieldBoxChild>
              </>
            )}

            <FieldBoxChild
              proportion={10}
              addmargin={endeavor === 'defend' ? 'auto' : 'left'}
            >
              <InputField
                name="action_force"
                id="action_force"
                label="Força da ação"
                value={actionForce}
                InputProps={{ readOnly: true }}
                align="center"
                fullWidth
                disabled={saving}
                highlight="true"
              />
            </FieldBoxChild>
          </FieldBox>
          <InputField
            name="description"
            id="description"
            label="Descrição"
            value={
              endeavor !== 'defend' ? actionDescription : defendEndeavor.title
            }
            InputProps={{ readOnly: readonly || endeavor === 'defend' }}
            onChange={handleDescriptionChange}
            multiline
            minRows={6}
            maxRows={6}
            fullWidth
            // error={!!validationErrors.description}
            helperText="Descreva a sua ação"
            disabled={saving}
          />

          {action.result !== 'not evaluated' && (
            <>
              <InputField
                name="st_reply"
                id="st_reply"
                label="Resposta do Narrador"
                value={stReply}
                // onChange={handleDescriptionChange}
                InputProps={{ readOnly: !storyteller }}
                multiline
                minRows={3}
                maxRows={3}
                fullWidth
                // error={!!validationErrors.description}
                helperText="Resposta do narrador sobre sua ação"
                disabled={saving}
              />

              <InputField
                name="news"
                id="news"
                label="Notícias Geradas"
                value={news || 'Esta ação não gerou nenhuma notícia ainda.'}
                // onChange={handleDescriptionChange}
                InputProps={{ readOnly: !storyteller }}
                multiline
                minRows={3}
                maxRows={3}
                fullWidth
                // error={!!validationErrors.description}
                helperText="Notícias geradas pela ação"
                disabled={saving}
              />
            </>
          )}

          <ButtonsContainer>
            {!readonly && (
              <ButtonBox>
                <Button type="submit" disabled={!hasChanges || saving}>
                  Salvar
                </Button>
              </ButtonBox>
            )}
            <ButtonBox>
              <Button onClick={handleClose}>
                {`${readonly ? 'Retornar' : 'Cancelar'}`}
              </Button>
            </ButtonBox>
          </ButtonsContainer>
        </Form>
      </AddActionContainer>
    </Dialog>
  );
};

export default AddAction;
