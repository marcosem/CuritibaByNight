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
import Button from '../Button';

import {
  AddPowerContainer,
  ButtonsContainer,
  ButtonBox,
  FieldBox,
  InputField,
  FieldBoxChild,
} from './styles';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/*
interface IPowerSimple {
  id: string;
  name: string;
  level: number;
  type: string;
  included: boolean;
  show: boolean;
} */

interface IType {
  type: string;
  label: string;
}

const types: IType[] = [
  {
    type: 'discipline',
    label: 'Disciplina',
  },
  {
    type: 'rituals',
    label: 'Ritual',
  },
  {
    type: 'combination',
    label: 'Combo',
  },
  {
    type: 'gift',
    label: 'Dom',
  },
  {
    type: 'arcanoi',
    label: 'Arcanoi',
  },
  {
    type: 'spheres',
    label: 'Esfera',
  },
  {
    type: 'routes',
    label: 'Rotina',
  },
  {
    type: 'other',
    label: 'Outro',
  },
];

interface IPower {
  id: string;
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

interface DialogPropsEx extends DialogProps {
  selectedPower: IPower;
  handleSave: () => void;
  handleClose: () => void;
}

const AddPower: React.FC<DialogPropsEx> = ({
  selectedPower,
  handleSave,
  handleClose,
  ...rest
}) => {
  const formRef = useRef<FormHandles>(null);
  const [power, setPower] = useState<IPower>({} as IPower);
  const [selectedType, setSelectedType] = useState<IType>({} as IType);
  const [currentLevel, setCurrentLevel] = useState<string>('');

  const getType = useCallback(type => {
    const typeFound = types.find(myType => myType.type === type);

    const typeResult = typeFound || { type: 'other', label: 'Outro' };

    return typeResult;
  }, []);

  const getTypeByLabel = useCallback(label => {
    const typeFound = types.find(myType => myType.label === label);

    const typeResult = typeFound || { type: 'other', label: 'Outro' };

    return typeResult;
  }, []);

  const updateLevelLabel = useCallback((level, type) => {
    if (level === undefined || level === 0 || type === 'combination') {
      setCurrentLevel('');
      return;
    }

    const typesText = ['rituals', 'gift', 'routes'];
    const levelLabels = ['Básico', 'Intermediário', 'Avançado'];
    let label = '';

    if (typesText.includes(type)) {
      if (level > 3) {
        label = 'Ancião';
      } else {
        label = levelLabels[level - 1];
      }
    } else {
      label = `${level}`;
    }

    setCurrentLevel(label);
  }, []);

  const handleTypeSelectChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newType = getTypeByLabel(event.target.value);
      updateLevelLabel(power.level, newType.type);
      setSelectedType(newType);
    },
    [getTypeByLabel, power.level, updateLevelLabel],
  );

  const handleSubmit = useCallback(() => {
    const toDO = '';
    return toDO;
  }, []);

  useEffect(() => {
    const currType = getType(power.type);
    setSelectedType(currType);
    updateLevelLabel(power.level, currType.type);
  }, [getType, power.level, power.type, updateLevelLabel]);

  useEffect(() => {
    setPower(selectedPower);
  }, [selectedPower]);

  return (
    <Dialog TransitionComponent={Transition} fullWidth maxWidth="md" {...rest}>
      <DialogTitle>Editar Poder</DialogTitle>
      <AddPowerContainer>
        <Form onSubmit={handleSubmit} ref={formRef}>
          <InputField
            id="long_name"
            label="Nome"
            fullWidth
            InputProps={{ readOnly: true }}
            value={power.long_name}
          />
          <InputField
            id="short_name"
            label="Nome abreviado ou Título*"
            fullWidth
            defaultValue={power.short_name}
          />

          <FieldBox>
            <FieldBoxChild>
              <InputField
                id="type"
                select
                label="Tipo*"
                value={selectedType.label}
                onChange={handleTypeSelectChange}
                helperText="Selecione o tipo do poder"
                align="center"
              >
                {types.map(type => (
                  <MenuItem key={type.type} value={type.label}>
                    {type.label}
                  </MenuItem>
                ))}
              </InputField>
              <InputField
                id="level"
                label="Nível"
                InputProps={{ readOnly: true }}
                value={currentLevel}
                align="center"
                addMarginLeft
              />
            </FieldBoxChild>

            <FieldBoxChild>
              <InputField
                id="origin"
                label="Origem"
                fullWidth
                value={power.origin}
                helperText="Este poder é exclusivo, único, segredo de secto/clã? Inclua esta informação aqui..."
              />
            </FieldBoxChild>
          </FieldBox>

          <ButtonsContainer>
            <ButtonBox>
              <Button type="submit">Salvar</Button>
            </ButtonBox>
            <ButtonBox>
              <Button onClick={handleClose}>Cancelar</Button>
            </ButtonBox>
          </ButtonsContainer>
        </Form>
      </AddPowerContainer>
    </Dialog>
  );
};

export default AddPower;
