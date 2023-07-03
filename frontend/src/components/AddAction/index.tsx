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

import influencesAbilities from '../../pages/Influences/influencesAbilities.json';

import {
  AddActionContainer,
  FieldBox,
  FieldBoxChild,
  InputField,
} from './styles';

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
}

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

  const getInfluencePT = useCallback(
    (influenceEn): string => {
      const infAbility = influenceList.find(
        infAbi => infAbi.influence === influenceEn,
      );

      if (infAbility) {
        return infAbility.influence_PT;
      }

      return '';
    },
    [influenceList],
  );

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

      setBackgroundList(parsedBgList);
    }
  }, [backgrounds]);

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

    const levelArray = [];
    for (let i = 1; i <= maxLevel; i += 1) {
      levelArray.push(i);
    }

    setInfluenceLevelArray(levelArray);
    setInfluenceLevelMax(maxLevel);
  }, [backgroundList, getCharInfluenceLevel, influence]);

  useEffect(() => {
    setTitle(action.title || '');
    setInfluence(action.influence || '');
    setBackgrounds(action.backgrounds || '');
    setInfluenceLevel(Number(action.influence_level) || 0);
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
            <FieldBoxChild proportion={75}>
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
            <FieldBoxChild proportion={25}>
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
                value={influenceLevel}
                InputProps={{ readOnly: readonly }}
                // onChange={undefined}
                select
                required
                // helperText="Selecione o Nível"
                align="center"
                fullWidth
                addmargin="right"
                disabled={saving}
              >
                {influenceLevelArray.map(level => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </InputField>
            </FieldBoxChild>

            {/*
            <FieldBoxChild proportion={50}>
              <InputField
                name="background"
                id="background"
                label="Antecedente"
                value={backgrounds}
                InputProps={{ readOnly: readonly }}
                // select
                helperText="Selecione para usar antecedente"
                align="center"
                fullWidth
                addmargin="right"
                disabled={saving}
              />
            </FieldBoxChild>
  */}
          </FieldBox>
        </Form>
      </AddActionContainer>
    </Dialog>
  );
};

export default AddAction;
