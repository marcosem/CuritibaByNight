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
import * as Yup from 'yup';
import Button from '../Button';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

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
    type: 'ritual',
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

interface IError {
  short_name?: string;
  origin?: string;
  requirements?: string;
  description?: string;
  system?: string;
  cost?: string;
  source?: string;
}

interface DialogPropsEx extends DialogProps {
  selectedPower: IPower;
  handleSave: (savedPower: IPower) => void;
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
  // const [currentLevel, setCurrentLevel] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const [validationErrors, setValidationErrors] = useState<IError>(
    {} as IError,
  );

  const [shortName, setShortName] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [cost, setCost] = useState<number>(0);
  const [requirements, setRequirements] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [system, setSystem] = useState<string>('');

  const { addToast } = useToast();
  // const { signOut } = useAuth();

  const getType = useCallback(type => {
    const parsedType = type === 'rituals' ? 'ritual' : type;
    const typeFound = types.find(myType => myType.type === parsedType);

    const typeResult = typeFound || { type: 'other', label: 'Outro' };

    return typeResult;
  }, []);

  const getTypeByLabel = useCallback(label => {
    const typeFound = types.find(myType => myType.label === label);

    const typeResult = typeFound || { type: 'other', label: 'Outro' };

    return typeResult;
  }, []);

  const getLevelLabel = useCallback((level: number, type: string) => {
    const typeWithLabel = ['ritual', 'rituals', 'gift', 'routes'];
    const labels = [
      '-',
      'Básico',
      'Intermediário',
      'Avançado',
      'Ancião',
      'Mestre',
      'Matusalém',
    ];

    let label;
    if (level === 0 || typeWithLabel.includes(type)) {
      label = labels[level];
    } else {
      label = level;
    }

    return label;
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      formRef.current?.setErrors({});

      const powerData: IPower = {
        id: power.id,
        long_name: power.long_name,
        short_name: shortName
          .replace(/’/gi, "'")
          .replace(/“/gi, '"')
          .replace(/”/gi, '"'),
        level: Number(power.level),
        type: selectedType.type,
        origin: origin
          .replace(/’/gi, "'")
          .replace(/“/gi, '"')
          .replace(/”/gi, '"'),
        requirements: requirements
          .replace(/’/gi, "'")
          .replace(/“/gi, '"')
          .replace(/”/gi, '"'),
        description: description
          .replace(/’/gi, "'")
          .replace(/“/gi, '"')
          .replace(/”/gi, '"'),
        system: system
          .replace(/’/gi, "'")
          .replace(/“/gi, '"')
          .replace(/”/gi, '"'),
        cost,
        source: source
          .replace(/’/gi, "'")
          .replace(/“/gi, '"')
          .replace(/”/gi, '"'),
      };

      const schema = Yup.object().shape({
        short_name: Yup.string().required(
          'Nome abreviado ou Título obrigatório',
        ),
        origin: Yup.string(),
        requirements: Yup.string(),
        description: Yup.string(),
        system: Yup.string(),
        cost: Yup.number(),
        source: Yup.string(),
      });

      await schema.validate(powerData, { abortEarly: false });
      setValidationErrors({} as IError);

      setSaving(true);

      let response;

      if (powerData.id) {
        response = await api.patch('/powers/update', powerData);

        addToast({
          type: 'success',
          title: 'Poder atualizado!',
          description: 'Poder atualizado com sucesso!',
        });
      } else {
        response = await api.post('/powers/add', powerData);

        addToast({
          type: 'success',
          title: 'Poder adicionado!',
          description: 'Poder adicionado com sucesso!',
        });
      }

      setSaving(false);

      handleSave(response.data);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
        setValidationErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro no cadastro de poder',
        description: 'Erro ao adicionar poder, tente novamente.',
      });
    }
  }, [
    addToast,
    cost,
    description,
    handleSave,
    origin,
    power.id,
    power.level,
    power.long_name,
    requirements,
    selectedType.type,
    shortName,
    source,
    system,
  ]);

  const handleTypeSelectChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newType = getTypeByLabel(event.target.value);

      setSelectedType(newType);
      setHasChanges(true);
    },
    [getTypeByLabel],
  );

  const handleShortNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const changedValue = event.target.value;

      setShortName(changedValue);
      setHasChanges(true);
    },
    [],
  );

  const handleCostChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const changedValue = event.target.value;

      const parsedValue = changedValue.replace(/\D-/g, '');
      const validValue = Number(parsedValue) < 0 ? 0 : Number(parsedValue);

      setCost(validValue);
      setHasChanges(true);
    },
    [],
  );

  const handleOriginChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const changedValue = event.target.value;

      setOrigin(changedValue);
      setHasChanges(true);
    },
    [],
  );

  const handleRequirementsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const changedValue = event.target.value;

      setRequirements(changedValue);
      setHasChanges(true);
    },
    [],
  );

  const handleSourceChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const changedValue = event.target.value;

      setSource(changedValue);
      setHasChanges(true);
    },
    [],
  );

  const handleDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const changedValue = event.target.value;

      setDescription(changedValue);
      setHasChanges(true);
    },
    [],
  );

  const handleSystemChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const changedValue = event.target.value;

      setSystem(changedValue);
      setHasChanges(true);
    },
    [],
  );

  useEffect(() => {
    const currType = getType(power.type);
    setSelectedType(currType);

    setShortName(power.short_name || '');
    setOrigin(power.origin || '');
    setCost(power.cost || 0);
    setRequirements(power.requirements || '');
    setSource(power.source || '');
    setDescription(power.description || '');
    setSystem(power.system || '');
  }, [getType, power]);

  useEffect(() => {
    setPower(selectedPower);
    // setCurrentLevel(getLevelLabel(selectedPower.level, selectedPower.type));
  }, [getLevelLabel, selectedPower]);

  return (
    <Dialog TransitionComponent={Transition} fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{power.id ? 'Editar ' : 'Adicionar '} Poder</DialogTitle>
      <AddPowerContainer>
        <Form onSubmit={handleSubmit} ref={formRef}>
          <FieldBox>
            <FieldBoxChild>
              <InputField
                name="long_name"
                id="long_name"
                label="Nome"
                defaultValue={power.long_name}
                fullWidth
                InputProps={{ readOnly: true }}
                addmargin="right"
                disabled={saving}
              />
            </FieldBoxChild>
            <FieldBoxChild>
              <InputField
                name="short_name"
                id="short_name"
                label="Nome abreviado ou Título"
                value={shortName}
                onChange={handleShortNameChange}
                fullWidth
                required
                error={!!validationErrors.short_name}
                helperText={validationErrors.short_name}
                disabled={saving}
              />
            </FieldBoxChild>
          </FieldBox>

          <FieldBox>
            <FieldBoxChild>
              <InputField
                name="type"
                id="type"
                label="Tipo"
                value={selectedType.label}
                onChange={handleTypeSelectChange}
                select
                required
                helperText="Selecione o tipo do poder"
                align="center"
                fullWidth
                addmargin="right"
                disabled={saving}
              >
                {types.map(type => (
                  <MenuItem key={type.type} value={type.label}>
                    {type.label}
                  </MenuItem>
                ))}
              </InputField>
              <InputField
                name="level"
                id="level"
                label="Nível"
                value={getLevelLabel(power.level, selectedType.type)}
                InputProps={{ readOnly: true }}
                align="center"
                fullWidth
                addmargin="right"
                disabled={saving}
              />
            </FieldBoxChild>

            <FieldBoxChild>
              <InputField
                name="origin"
                id="origin"
                label="Origem"
                value={origin}
                onChange={handleOriginChange}
                fullWidth
                error={!!validationErrors.origin}
                helperText={
                  validationErrors.origin ||
                  'Este poder é exclusivo, único, segredo de secto/clã? Inclua esta informação aqui...'
                }
                disabled={saving}
              />
            </FieldBoxChild>
          </FieldBox>
          <FieldBox>
            <FieldBoxChild proportion={25}>
              <InputField
                name="cost"
                id="cost"
                label="Custo"
                value={selectedType.type === 'combination' ? cost : ''}
                onChange={handleCostChange}
                type="number"
                InputProps={{ readOnly: selectedType.type !== 'combination' }}
                required={selectedType.type === 'combination'}
                fullWidth
                addmargin="right"
                align="center"
                error={!!validationErrors.cost}
                helperText={
                  validationErrors.cost || 'Custo em XP, requerido para Combos'
                }
                disabled={saving}
              />
            </FieldBoxChild>
            <FieldBoxChild proportion={50}>
              <InputField
                name="requeriments"
                id="requeriments"
                label="Requisitos"
                value={requirements}
                onChange={handleRequirementsChange}
                fullWidth
                error={!!validationErrors.requirements}
                helperText={
                  validationErrors.requirements ||
                  'Requisitos deste poder, disciplinas, níveis, etc.'
                }
                disabled={saving}
              />
            </FieldBoxChild>
            <FieldBoxChild proportion={25}>
              <InputField
                name="source"
                id="source"
                label="Fonte"
                value={source}
                onChange={handleSourceChange}
                fullWidth
                addmargin="left"
                error={!!validationErrors.source}
                helperText={
                  validationErrors.source || 'Fonte da descrição (Livro/Página)'
                }
                disabled={saving}
              />
            </FieldBoxChild>
          </FieldBox>
          <InputField
            name="description"
            id="description"
            label="Descrição"
            value={description}
            onChange={handleDescriptionChange}
            multiline
            minRows={6}
            maxRows={6}
            fullWidth
            error={!!validationErrors.description}
            helperText={validationErrors.description || 'Descrição RP do poder'}
            disabled={saving}
          />
          <InputField
            name="system"
            id="system"
            label="Sistema"
            value={system}
            onChange={handleSystemChange}
            multiline
            minRows={6}
            maxRows={6}
            fullWidth
            error={!!validationErrors.system}
            helperText={validationErrors.system || 'Sistema de regras do poder'}
            disabled={saving}
          />

          <ButtonsContainer>
            <ButtonBox>
              <Button type="submit" disabled={!hasChanges || saving}>
                Salvar
              </Button>
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
