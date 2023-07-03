/* eslint-disable camelcase */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  // ChangeEvent,
} from 'react';

import {
  Dialog,
  DialogProps,
  Slide,
  DialogTitle,
  MenuItem,
  // MenuItem,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
// import * as Yup from 'yup';
// import Button from '../Button';

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
  handleSave: (savedAction: IAction) => void;
  handleClose: () => void;
}

const AddAction: React.FC<DialogPropsEx> = ({
  selectedAction,
  charTraitsList,
  readonly,
  handleSave,
  handleClose,
  ...rest
}) => {
  const formRef = useRef<FormHandles>(null);
  const [action, setAction] = useState<IAction>({} as IAction);
  const [traitsList, setTraitsList] = useState<ITraitsList>({
    masquerade: {} as ITrait,
    morality: {} as ITrait,
    attributes: [],
    abilities: [],
    backgrounds: [],
    influences: [],
  } as ITraitsList);
  const [saving, setSaving] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<IError>(
    {} as IError,
  );

  const [title, setTitle] = useState<string>('');
  const [influence, setInfluence] = useState<string>('');
  const [influenceList, setInfluenceList] = useState<IInfluence[]>([]);
  const [influenceLevel, setInfluenceLevel] = useState<number>(0);
  const [backgrounds, setBackgrounds] = useState<string>('');
  const [backgroundList, setBackgroundList] = useState<IBackground[]>([]);
  const [influenceLevelMax, setInfluenceLevelMax] = useState<number>(0);
  const [influenceLevelArray, setInfluenceLevelArray] = useState<number[]>([]);
  const [endeavor, setEndeavor] = useState<
    'attack' | 'defend' | 'combine' | 'raise capital' | 'other'
  >('other');
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

  const getInfluencePT = useCallback(
    (influenceEn): string => {
      const infItem = influenceList.find(inf => inf.influence === influenceEn);

      if (infItem) {
        return infItem.influence_PT;
      }

      return '';
    },
    [influenceList],
  );

  const getEndeavorPT = useCallback((endeavorEn): string => {
    const endeavorItem = endeadorList.find(endea => endea.title === endeavorEn);

    if (endeavorItem) {
      return endeavorItem.titlePT;
    }

    return '';
  }, []);

  const buildInfluenceList = useCallback(() => {
    const newInfluenceList = [...influencesAbilities.influences].sort(
      (infA: IInfluence, infB: IInfluence) => {
        if (infA.influence_PT < infB.influence_PT) return -1;
        if (infA.influence_PT > infB.influence_PT) return 1;
        return 0;
      },
    );

    setInfluenceList(newInfluenceList);
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

  const getCharInfluenceLevel = useCallback(
    charInfluence => {
      const influenceTrait: ITrait | undefined = traitsList.influences.find(
        inf => inf.trait === charInfluence,
      );

      let level = 0;
      if (influenceTrait) {
        level = influenceTrait.levelTemp;
      }

      return level;
    },
    [traitsList.influences],
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

    const levelArray = [0];
    for (let i = 1; i <= maxLevel; i += 1) {
      levelArray.push(i);
    }

    setInfluenceLevelArray(levelArray);
    setInfluenceLevelMax(maxLevel);
  }, [backgroundList, getCharInfluenceLevel, influence]);

  useEffect(() => {
    if (ability === '') return;

    const abilityTrait = traitsList.abilities.find(
      trait => trait.trait === ability,
    );

    if (abilityTrait === undefined) return;

    const maxLevel = abilityTrait.level;

    const levelArray = [0];
    for (let i = 1; i <= maxLevel; i += 1) {
      levelArray.push(i);
    }

    setAbilityLevelArray(levelArray);
  }, [ability, abilityLevel, traitsList.abilities]);

  useEffect(() => {
    console.log(action);

    setTitle(action.title || '');
    setInfluence(action.influence || '');
    setInfluenceLevel(Number(action.influence_level) || 0);
    setBackgrounds(action.backgrounds || '');
    setEndeavor(action.endeavor || 'other');
    setActionForce(action.action_force || 0);
    setAbility(action.ability || '');
    setAbilityLevel(action.ability_level || 0);
    setActionDescription(action.action || '');
    setStReply(action.st_reply || '');
    setNews(action.news || '');
  }, [action]);

  useEffect(() => {
    buildInfluenceList();
    setAction(selectedAction);
    setTraitsList(charTraitsList);
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
                value={title}
                InputProps={{ readOnly: readonly }}
                // onChange={undefined}
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
                // onChange={undefined}
                select
                required
                helperText="Selecione a influência"
                align="center"
                fullWidth
                addmargin="right"
                disabled={saving}
              >
                {influenceList.map(inf => (
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
                  influenceLevelArray.length < 2 ? '0' : `${influenceLevel}`
                }
                InputProps={{ readOnly: readonly }}
                // onChange={undefined}
                select
                required
                // helperText="Selecione o Nível"
                align="center"
                fullWidth
                // addmargin="right"
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
                // onChange={undefined}
                select
                required
                helperText="Selectione o tipo de ação"
                align="center"
                fullWidth
                // addmargin="right"
                disabled={saving}
              >
                {endeadorList.map(endea => (
                  <MenuItem key={endea.title} value={endea.titlePT}>
                    {endea.titlePT}
                  </MenuItem>
                ))}
              </InputField>
            </FieldBoxChild>

            <FieldBoxChild proportion={25}>
              <InputField
                name="ability"
                id="ability"
                label="Habilidade principal"
                value={ability}
                InputProps={{ readOnly: readonly }}
                // onChange={undefined}
                select
                required
                helperText="Selecione uma habilidade"
                align="center"
                fullWidth
                addmargin="right"
                disabled={saving}
              >
                {traitsList.abilities.map(abil => (
                  <MenuItem key={abil.id} value={abil.trait}>
                    {abil.trait}
                  </MenuItem>
                ))}
              </InputField>
            </FieldBoxChild>

            <FieldBoxChild proportion={10}>
              <InputField
                name="ability_level"
                id="ability_level"
                label="Nível"
                value={
                  abilityLevelArray.length < abilityLevel
                    ? '0'
                    : `${abilityLevel}`
                }
                InputProps={{ readOnly: readonly }}
                // onChange={undefined}
                select
                required
                // helperText="Selecione o Nível"
                align="center"
                fullWidth
                // addmargin="right"
                disabled={saving}
              >
                {abilityLevelArray.map(level => (
                  <MenuItem key={level} value={`${level}`}>
                    {level}
                  </MenuItem>
                ))}
              </InputField>
            </FieldBoxChild>

            {/*
            <FieldBoxChild proportion={15} addmargin="left">
              <InputField
                name="action_force"
                id="action_force"
                label="Força"
                value={actionForce}
                InputProps={{ readOnly: true }}
                helperText="Força total da ação"
                align="center"
                fullWidth
                disabled={saving}
              />
            </FieldBoxChild>
                */}
          </FieldBox>

          <FieldBox>
            <FieldBoxChild proportion={25}>
              <InputField
                name="background"
                id="background"
                label="Incluir / Excluir Antecedente"
                value={backgroundToAdd}
                InputProps={{ readOnly: readonly }}
                // onChange={undefined}
                select
                helperText="Reforçar a ação com antecedente"
                align="center"
                fullWidth
                addmargin="right"
                disabled={saving}
              >
                {traitsList.backgrounds.map(bg => (
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
                // onChange={undefined}
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
            <FieldBoxChild proportion={8}>
              <ActionButton disabled={saving} title="Incluir Antecedente">
                <FiPlus />
              </ActionButton>
              <ActionButton
                disabled={saving}
                color="red"
                title="Excluir Antecedente"
              >
                <FiX />
              </ActionButton>
            </FieldBoxChild>
            <FieldBoxChild proportion={57}>
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
                addmargin="left"
                disabled={saving}
              />
            </FieldBoxChild>
          </FieldBox>
          <InputField
            name="description"
            id="description"
            label="Descrição"
            value={actionDescription}
            // onChange={handleDescriptionChange}
            multiline
            minRows={6}
            maxRows={6}
            fullWidth
            // error={!!validationErrors.description}
            helperText="Descreva a sua ação"
            disabled={saving}
          />

          <InputField
            name="st_reply"
            id="st_reply"
            label="Resposta do Narrador"
            value={stReply}
            // onChange={handleDescriptionChange}
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
            multiline
            minRows={3}
            maxRows={3}
            fullWidth
            // error={!!validationErrors.description}
            helperText="Notícias geradas pela ação"
            disabled={saving}
          />
        </Form>
      </AddActionContainer>
    </Dialog>
  );
};

export default AddAction;
