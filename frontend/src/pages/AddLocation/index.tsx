/* eslint-disable camelcase */
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  ChangeEvent,
} from 'react';
import { FiHome, FiFileText, FiMap, FiMapPin } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  TitleBox,
  Content,
  LocationCardContainer,
  LocationFormContainer,
  InputBox,
  SelectContainer,
  Select,
  ButtonBox,
} from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import Loading from '../../components/Loading';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useHeader } from '../../hooks/header';
import { useMobile } from '../../hooks/mobile';
import ICharacter from '../../components/CharacterList/ICharacter';
import LocationCard from '../../components/LocationCard';

interface ISelectableItem {
  title: string;
  titleEn: string;
}

const typeList: ISelectableItem[] = [
  {
    title: 'Outro',
    titleEn: 'other',
  },
  {
    title: 'Refúgio',
    titleEn: 'haven',
  },
  {
    title: 'Acampamento',
    titleEn: 'camp',
  },
  {
    title: 'Aeroporto',
    titleEn: 'airport',
  },
  {
    title: 'Castelo',
    titleEn: 'castle',
  },
  {
    title: 'Clube Noturno',
    titleEn: 'nightclub',
  },
  {
    title: 'Local Assombrado',
    titleEn: 'haunt',
  },
  {
    title: 'Mansão',
    titleEn: 'mansion',
  },
  {
    title: 'Propriedade',
    titleEn: 'holding',
  },
  {
    title: 'Universidade',
    titleEn: 'university',
  },
];

const propertyList: ISelectableItem[] = [
  {
    title: 'Privada',
    titleEn: 'private',
  },
  {
    title: 'Pública',
    titleEn: 'public',
  },
  {
    title: 'do Clã',
    titleEn: 'clan',
  },
  {
    title: 'de Criatura',
    titleEn: 'creature',
  },
  {
    title: 'do Secto',
    titleEn: 'sect',
  },
];

const creatureTypeList = [
  'Changeling',
  'Demon',
  'Fera',
  'Kuei-Jin',
  'Mage',
  'Mortal',
  'Mummy',
  'Vampire',
  'Werewolf',
  'Wraith',
  'Other',
];

const levelList = [0, 1, 2, 3, 4, 5, 6];

interface FormData {
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
}

interface ILocationCardProps {
  locationId: string;
  name: string;
  description: string;
  address: string;
  elysium: boolean;
  type: string;
  property: string;
  responsibleId: string;
  responsibleName: string;
  clan: string;
  creature_type: string;
  sect: string;
  level: number;
  mysticalLevel: number;
}

const AddLocation: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { signOut } = useAuth();
  const { setCurrentPage } = useHeader();
  const { isMobileVersion } = useMobile();
  const history = useHistory();
  const [isBusy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [selectedChar, setSelectedChar] = useState<ICharacter>();
  const [clanList, setClanList] = useState<string[]>([]);
  const [selectedClan, setSelectedClan] = useState<string>('');
  const [sectList, setSectList] = useState<string[]>([]);
  const [selectedSect, setSelectedSect] = useState<string>('');
  const [selectedCreature, setSelectedCreature] = useState<string>('');
  const [locationData, setLocationData] = useState<ILocationCardProps>({
    locationId: '',
    name: '',
    description: '',
    address: '',
    elysium: false,
    type: 'other',
    property: 'private',
    responsibleId: '',
    responsibleName: '',
    clan: '',
    creature_type: '',
    sect: '',
    level: 1,
    mysticalLevel: 0,
  });
  const [isElysium, setIsElysium] = useState(false);
  const [locType, setLocType] = useState<ISelectableItem>(typeList[0]);
  const [locProperty, setLocProperty] = useState<ISelectableItem>(
    propertyList[0],
  );
  const [locLevel, setLocLevel] = useState<number>(1);
  const [locMysticalLevel, setLocMysticalLevel] = useState<number>(0);

  const loadCharacters = useCallback(async () => {
    setBusy(true);

    try {
      await api.get('characters/list/all').then(response => {
        const res = response.data;

        // Get list of clan
        const fullClanList = res.map((char: ICharacter) => {
          const clanFilter1 = char.clan.split(':');
          const clanFilter2 = clanFilter1[0].split(' (');

          return clanFilter2[0];
        });
        // Sort clan list and remove duplicated
        const filteredClanList = fullClanList
          .sort()
          .filter((clan: string, pos: number, ary: string[]) => {
            return !pos || clan !== ary[pos - 1];
          });

        const fullSectList = res.map((char: ICharacter) => {
          const { sect } = char;

          return sect;
        });

        const filteredSect = fullSectList
          .sort()
          .filter((sect: string, pos: number, ary: string[]) => {
            return (
              sect !== null && sect !== '' && (!pos || sect !== ary[pos - 1])
            );
          });

        setClanList(filteredClanList);
        setSectList(filteredSect);
        setCharList(res);
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
            title: 'Erro ao tentar listar personagens',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, signOut]);

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        formRef.current?.setErrors({});
        const latlongRegExp = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/;

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          description: Yup.string().required('Descrição obrigatória'),
          address: Yup.string().required('Endereço obrigatório'),
          latitude: Yup.string()
            .matches(latlongRegExp, 'Entre com o formato: -xx.xxxxxxx')
            .required('Latitude obrigatória'),
          longitude: Yup.string()
            .matches(latlongRegExp, 'Entre com o formato: -xxx.xxxxxxx')
            .required('Longitude obrigatória'),
        });

        await schema.validate(data, { abortEarly: false });

        const parsedAddress = data.address
          .replace(/\./gi, '')
          .replace(/Avenida/gi, 'Av')
          .replace(/Rua/gi, 'R')
          .replace(/Estrada/gi, 'Est')
          .replace(/Alameda/gi, 'Al');

        const latitude = parseFloat(data.latitude);
        const longitude = parseFloat(data.longitude);

        const formData = {
          name: data.name,
          description: data.description,
          address: parsedAddress,
          latitude,
          longitude,
          elysium: locationData.elysium,
          type: locationData.type,
          property:
            locationData.property !== '' ? locationData.property : undefined,
          clan: locationData.clan !== '' ? locationData.clan : undefined,
          creature_type:
            locationData.creature_type !== ''
              ? locationData.creature_type
              : undefined,
          sect: locationData.sect !== '' ? locationData.sect : undefined,
          level: locationData.level,
          mystical_level: locationData.mysticalLevel,
          char_id: selectedChar ? selectedChar.id : undefined,
        };

        setSaving(true);

        const response = await api.post('/locations/add', formData);

        setLocationData({
          locationId: response.data.id,
          name: response.data.name,
          description: response.data.description,
          address: response.data.address,
          elysium: response.data.elysium,
          type: response.data.type,
          property: response.data.property,
          responsibleId: response.data.responsible && '',
          responsibleName: response.data.responsible_char
            ? response.data.responsible_char.name
            : '',
          clan: response.data.clan,
          creature_type: response.data.creature_type,
          sect: response.data.sect,
          level: response.data.level,
          mysticalLevel: response.data.mystical_level,
        });

        setSaved(true);

        addToast({
          type: 'success',
          title: 'Localização adicionada!',
          description: 'Localização adicionada com sucesso!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro de localização',
          description: 'Erro ao adicionar localização, tente novamente.',
        });
      }
      setSaving(false);
    },
    [addToast, locationData, selectedChar],
  );

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleElysiumChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsElysium(e.target.checked);

      const tempLocationData = {
        elysium: e.target.checked,
      };

      const newLocData = locationData;
      Object.assign(newLocData, tempLocationData);

      setLocationData(newLocData);
    },
    [locationData],
  );

  const handleLocTypeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let selectedType: ISelectableItem;
      if (selIndex > 0) {
        const selLocType = typeList[selIndex - 1];
        selectedType = selLocType;
      } else {
        // eslint-disable-next-line prefer-destructuring
        selectedType = typeList[0];
      }

      setLocType(selectedType);

      const tempLocationData = {
        type: selectedType.titleEn,
      };

      const newLocData = locationData;
      Object.assign(newLocData, tempLocationData);

      setLocationData(newLocData);
    },
    [locationData],
  );

  const handleLocPropertyChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let selectedProperty: ISelectableItem;
      if (selIndex > 0) {
        const selLocProperty = propertyList[selIndex - 1];
        selectedProperty = selLocProperty;
      } else {
        // eslint-disable-next-line prefer-destructuring
        selectedProperty = propertyList[0];
      }

      setLocProperty(selectedProperty);

      const tempLocationData = {
        property: selectedProperty.titleEn,
      };

      const newLocData = locationData;
      Object.assign(newLocData, tempLocationData);

      setLocationData(newLocData);
    },
    [locationData],
  );

  const handleLocResponsibleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let selectedCharacter: ICharacter | undefined;
      if (selIndex > 0) {
        const selCharacter = charList[selIndex - 1];
        selectedCharacter = selCharacter;
      } else {
        selectedCharacter = undefined;
      }

      setSelectedChar(selectedCharacter);

      const tempLocationData = {
        responsibleId: selectedCharacter ? selectedCharacter.id : '',
        responsibleName: selectedCharacter ? selectedCharacter.name : '',
      };

      const newLocData = locationData;
      Object.assign(newLocData, tempLocationData);

      setLocationData(newLocData);
    },
    [charList, locationData],
  );

  const handleLocClanChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let selClan: string;
      if (selIndex > 0) {
        const curSelClan = clanList[selIndex - 1];
        selClan = curSelClan;
      } else {
        selClan = '';
      }

      setSelectedClan(selClan);

      const tempLocationData = {
        clan: selClan,
      };

      const newLocData = locationData;
      Object.assign(newLocData, tempLocationData);

      setLocationData(newLocData);
    },
    [clanList, locationData],
  );

  const handleLocCreatureChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let selCreature: string;
      if (selIndex > 0) {
        const curSelCreature = creatureTypeList[selIndex - 1];
        selCreature = curSelCreature;
      } else {
        selCreature = '';
      }

      setSelectedCreature(selCreature);

      const tempLocationData = {
        creature_type: selCreature,
      };

      const newLocData = locationData;
      Object.assign(newLocData, tempLocationData);

      setLocationData(newLocData);
    },
    [locationData],
  );

  const handleLocSectChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let selSect: string;
      if (selIndex > 0) {
        const curSelSect = sectList[selIndex - 1];
        selSect = curSelSect;
      } else {
        selSect = '';
      }

      setSelectedSect(selSect);

      const tempLocationData = {
        sect: selSect,
      };

      const newLocData = locationData;
      Object.assign(newLocData, tempLocationData);

      setLocationData(newLocData);
    },
    [locationData, sectList],
  );

  const handleLocLevelChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let selectedLevel: number;
      if (selIndex > 0) {
        const selLocLevel = levelList[selIndex - 1];
        selectedLevel = selLocLevel;
      } else {
        // eslint-disable-next-line prefer-destructuring
        selectedLevel = 1;
      }

      setLocLevel(selectedLevel);

      const tempLocationData = {
        level: selectedLevel,
      };

      const newLocData = locationData;
      Object.assign(newLocData, tempLocationData);

      setLocationData(newLocData);
    },
    [locationData],
  );

  const handleLocMysticalLevelChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let selectedLevel: number;
      if (selIndex > 0) {
        const selLocLevel = levelList[selIndex - 1];
        selectedLevel = selLocLevel;
      } else {
        // eslint-disable-next-line prefer-destructuring
        selectedLevel = 0;
      }

      setLocMysticalLevel(selectedLevel);

      const tempLocationData = {
        mysticalLevel: selectedLevel,
      };

      const newLocData = locationData;
      Object.assign(newLocData, tempLocationData);

      setLocationData(newLocData);
    },
    [locationData],
  );

  useEffect(() => {
    setCurrentPage('addlocal');
    loadCharacters();
  }, [loadCharacters, setCurrentPage]);

  return (
    <Container isMobile={isMobileVersion}>
      <TitleBox>
        <strong>Adicionar uma nova Localização</strong>
      </TitleBox>
      <Content>
        {isBusy ? (
          <Loading />
        ) : (
          <>
            <LocationCardContainer>
              <LocationCard
                locationId={locationData.locationId}
                name={locationData.name}
                description={locationData.description}
                address={locationData.address}
                elysium={locationData.elysium}
                type={locationData.type}
                property={locationData.property}
                responsibleId={locationData.responsibleId}
                responsibleName={locationData.responsibleName}
                clan={locationData.clan}
                creature_type={locationData.creature_type}
                sect={locationData.sect}
                level={locationData.level}
                mysticalLevel={locationData.mysticalLevel}
                pictureUrl=""
                locked={!saved}
              />
            </LocationCardContainer>
            <LocationFormContainer>
              <div>
                <h1>Entre com os dados da nova localização:</h1>
              </div>

              <Form onSubmit={handleSubmit} ref={formRef}>
                <InputBox>
                  <Input
                    name="name"
                    id="name"
                    icon={FiHome}
                    mask=""
                    placeholder="Nome"
                    readOnly={saving}
                  />
                  <Input
                    name="description"
                    id="description"
                    icon={FiFileText}
                    mask=""
                    placeholder="Descrição"
                    readOnly={saving}
                  />
                </InputBox>

                <InputBox>
                  <Input
                    name="address"
                    id="address"
                    icon={FiMap}
                    mask=""
                    placeholder="Endereço"
                    readOnly={saving}
                  />
                  <Checkbox
                    name="elysium"
                    id="elysium"
                    checked={isElysium}
                    onChange={handleElysiumChange}
                  >
                    Elysium
                  </Checkbox>
                </InputBox>

                <InputBox>
                  <Input
                    name="latitude"
                    id="latitude"
                    icon={FiMapPin}
                    mask="S9ZZ9999999"
                    formatChars={{
                      '9': '[0-9]',
                      Z: '[0-9.]',
                      S: '[0-9-]',
                    }}
                    maskChar={null}
                    placeholder="Latitude"
                    readOnly={saving}
                  />
                  <Input
                    name="longitude"
                    id="longitude"
                    icon={FiMapPin}
                    mask="S9ZZZ9999999"
                    formatChars={{
                      '9': '[0-9]',
                      Z: '[0-9.]',
                      S: '[0-9-]',
                    }}
                    maskChar={null}
                    placeholder="Longitude"
                    readOnly={saving}
                  />
                </InputBox>

                <InputBox>
                  <SelectContainer>
                    <strong>Tipo:</strong>

                    <Select
                      name="type"
                      id="type"
                      value={locType ? locType.titleEn : 'other'}
                      onChange={handleLocTypeChange}
                      left
                    >
                      <option value="">Tipo:</option>
                      {typeList.map(locationType => (
                        <option
                          key={locationType.titleEn}
                          value={locationType.titleEn}
                        >
                          {locationType.title}
                        </option>
                      ))}
                    </Select>
                  </SelectContainer>

                  <SelectContainer>
                    <strong>Propriedade:</strong>
                    <Select
                      name="property"
                      id="property"
                      value={locProperty ? locProperty.titleEn : 'private'}
                      onChange={handleLocPropertyChange}
                      left
                    >
                      <option value="">Propriedade:</option>
                      {propertyList.map(property => (
                        <option key={property.titleEn} value={property.titleEn}>
                          {property.title}
                        </option>
                      ))}
                    </Select>
                  </SelectContainer>
                </InputBox>

                <InputBox>
                  <SelectContainer>
                    <strong>De conhecimento dos:</strong>
                    <Select
                      name="creature"
                      id="creature"
                      value={selectedCreature || ''}
                      onChange={handleLocCreatureChange}
                      left
                    >
                      <option value="">Criatura:</option>
                      {creatureTypeList.map(creat => (
                        <option key={creat} value={creat}>
                          {creat}
                        </option>
                      ))}
                    </Select>
                  </SelectContainer>
                  <SelectContainer>
                    <strong>Do Secto:</strong>
                    <Select
                      name="sect"
                      id="sect"
                      value={selectedSect || ''}
                      onChange={handleLocSectChange}
                      left
                    >
                      <option value="">Secto:</option>
                      {sectList.map(sect => (
                        <option key={sect} value={sect}>
                          {sect}
                        </option>
                      ))}
                    </Select>
                  </SelectContainer>
                </InputBox>

                <InputBox>
                  <SelectContainer>
                    <strong>Proprietário / Responsável:</strong>
                    <Select
                      name="responsible"
                      id="responsible"
                      value={selectedChar ? selectedChar.id : undefined}
                      defaultValue=""
                      onChange={handleLocResponsibleChange}
                      left
                    >
                      <option value="">Personagem:</option>
                      {charList.map(char => (
                        <option key={char.id} value={char.id}>
                          {char.name}
                        </option>
                      ))}
                    </Select>
                  </SelectContainer>
                  <SelectContainer>
                    <strong>Conhecido pelo Clã:</strong>
                    <Select
                      name="clan"
                      id="clan"
                      value={selectedClan || undefined}
                      defaultValue=""
                      onChange={handleLocClanChange}
                      left
                    >
                      <option value="">Clã:</option>
                      {clanList.map(clan => (
                        <option key={clan} value={clan}>
                          {clan}
                        </option>
                      ))}
                    </Select>
                  </SelectContainer>
                </InputBox>

                <InputBox>
                  <SelectContainer>
                    <strong>Nível:</strong>
                    <Select
                      name="level"
                      id="level"
                      value={locLevel}
                      onChange={handleLocLevelChange}
                    >
                      <option value="">Nível:</option>
                      {levelList.map(level => (
                        <option key={`Level:${level}`} value={level}>
                          {level}
                        </option>
                      ))}
                    </Select>
                  </SelectContainer>
                  <SelectContainer>
                    <strong>Nível Místico:</strong>
                    <Select
                      name="mysticalLevel"
                      id="mysticalLevel"
                      value={locMysticalLevel}
                      onChange={handleLocMysticalLevelChange}
                    >
                      <option value="">Nível Místico:</option>
                      {levelList.map(level => (
                        <option key={`MysticalLevel:${level}`} value={level}>
                          {level}
                        </option>
                      ))}
                    </Select>
                  </SelectContainer>
                </InputBox>

                <ButtonBox>
                  {saved ? (
                    <Button onClick={handleGoBack}>Retornar</Button>
                  ) : (
                    <Button
                      type="submit"
                      loading={saving}
                      loadingMessage="Salvando Localização..."
                    >
                      Confirmar Inclusão
                    </Button>
                  )}
                </ButtonBox>
              </Form>
            </LocationFormContainer>
          </>
        )}
      </Content>
    </Container>
  );
};

export default AddLocation;
