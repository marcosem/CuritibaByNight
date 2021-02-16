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
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  TitleBox,
  Content,
  LocationCardContainer,
  LocationFormContainer,
  InputBox,
  SelectLocation,
  SelectContainer,
  Select,
  ButtonBox,
} from './styles';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import Loading from '../../components/Loading';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
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
];

const levelList = [0, 1, 2, 3, 4, 5, 6];

interface FormData {
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
}

interface ILocation {
  id?: string;
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  elysium: boolean;
  type: string;
  property: string;
  responsible: string;
  responsible_char?: ICharacter;
  clan: string;
  level: number;
  mystical_level: number;
  picture_url?: string;
  myIndex: number;
}

const LocationUpdate: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [locationList, setLocationList] = useState<ILocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<ILocation>({
    id: undefined,
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    elysium: false,
    type: 'other',
    property: 'private',
    responsible: '',
    responsible_char: undefined,
    clan: '',
    level: 1,
    mystical_level: 0,
    picture_url: undefined,
    myIndex: -1,
  });

  const { addToast } = useToast();
  const { signOut } = useAuth();
  const [isBusy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [selectedChar, setSelectedChar] = useState<ICharacter>();
  const [clanList, setClanList] = useState<string[]>([]);
  const [selectedClan, setSelectedClan] = useState<string>('');
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

        setClanList(filteredClanList);
        setCharList(res);
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message?.indexOf('token') > 0 && error.response.status === 401) {
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

  const loadLocations = useCallback(async () => {
    setBusy(true);

    try {
      await api.post('locations/list').then(response => {
        const res = response.data;
        const newArray = res.map((location: ILocation) => {
          const newLocation = {
            id: location.id,
            name: location.name,
            description: location.description,
            address: location.address,
            latitude: location.latitude,
            longitude: location.longitude,
            responsible: location.responsible,
            responsible_char: location.responsible_char,
            elysium: location.elysium,
            type: location.type,
            property: location.property,
            clan: location.clan !== null ? location.clan : '',
            level: location.level,
            mystical_level: location.mystical_level,
            picture_url: location.picture_url || undefined,
          };
          return newLocation;
        });

        setLocationList(newArray);
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message?.indexOf('token') > 0 && error.response.status === 401) {
          addToast({
            type: 'error',
            title: 'Sessão Expirada',
            description: 'Sessão de usuário expirada, faça o login novamente!',
          });

          signOut();
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar os locais',
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
          location_id: selectedLocation.id,
          name: data.name,
          description: data.description,
          address: parsedAddress,
          latitude,
          longitude,
          elysium: selectedLocation.elysium,
          type: selectedLocation.type,
          property:
            selectedLocation.property !== ''
              ? selectedLocation.property
              : undefined,
          clan:
            selectedLocation.clan !== '' ? selectedLocation.clan : undefined,
          level: selectedLocation.level,
          mystical_level: selectedLocation.mystical_level,
          char_id: selectedChar ? selectedChar.id : undefined,
        };

        setSaving(true);

        const response = await api.patch('/locations/update', formData);
        const newLocation = {
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          address: response.data.address,
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          elysium: response.data.elysium,
          type: response.data.type,
          property: response.data.property,
          responsible: response.data.responsible,
          responsible_char: charList.find(
            char => char.id === response.data.responsible,
          ),
          clan: response.data.clan !== null ? response.data.clan : '',
          level: response.data.level,
          mystical_level: response.data.mystical_level,
          picture_url: response.data.picture_url || undefined,
          myIndex: selectedLocation.myIndex,
        };

        setSelectedLocation(newLocation);

        const newLocationList = locationList.map(loc => {
          return loc.id === newLocation.id ? newLocation : loc;
        });

        setLocationList(newLocationList);

        addToast({
          type: 'success',
          title: 'Localização atualizada!',
          description: 'Localização atualizada com sucesso!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description: 'Erro ao atualizar localização, tente novamente.',
        });
      }

      setSaving(false);
    },
    [addToast, charList, locationList, selectedChar, selectedLocation],
  );

  const handleElysiumChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsElysium(e.target.checked);

      const tempLocationData = {
        elysium: e.target.checked,
      };

      const newLocData = selectedLocation;
      Object.assign(newLocData, tempLocationData);

      setSelectedLocation(newLocData);
    },
    [selectedLocation],
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

      const newLocData = selectedLocation;
      Object.assign(newLocData, tempLocationData);

      setSelectedLocation(newLocData);
    },
    [selectedLocation],
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

      const newLocData = selectedLocation;
      Object.assign(newLocData, tempLocationData);

      setSelectedLocation(newLocData);
    },
    [selectedLocation],
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
        responsible: selectedCharacter ? selectedCharacter.id : '',
        responsible_char: selectedCharacter,
      };

      const newLocData = selectedLocation;
      Object.assign(newLocData, tempLocationData);

      setSelectedLocation(newLocData);
    },
    [charList, selectedLocation],
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

      const newLocData = selectedLocation;
      Object.assign(newLocData, tempLocationData);

      setSelectedLocation(newLocData);
    },
    [clanList, selectedLocation],
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

      const newLocData = selectedLocation;
      Object.assign(newLocData, tempLocationData);

      setSelectedLocation(newLocData);
    },
    [selectedLocation],
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

      const newLocData = selectedLocation;
      Object.assign(newLocData, tempLocationData);

      setSelectedLocation(newLocData);
    },
    [selectedLocation],
  );

  const handleLocationChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let newSelectedLocation: ILocation;

      if (selIndex > 0) {
        const selLocation = locationList[selIndex - 1];
        newSelectedLocation = selLocation;
        newSelectedLocation.myIndex = selIndex - 1;

        setIsElysium(selLocation.elysium);
        setLocLevel(selLocation.level);
        setLocMysticalLevel(selLocation.mystical_level);
        setSelectedChar(selLocation.responsible_char);
        setSelectedClan(selLocation.clan);

        const newType = typeList.find(tp => tp.titleEn === selLocation.type);
        setLocType(newType || typeList[0]);
        const newProperty = propertyList.find(
          pt => pt.titleEn === selLocation.property,
        );
        setLocProperty(newProperty || propertyList[0]);
      } else {
        newSelectedLocation = {
          id: undefined,
          name: '',
          description: '',
          address: '',
          latitude: '',
          longitude: '',
          elysium: false,
          type: 'other',
          property: 'private',
          responsible: '',
          responsible_char: undefined,
          clan: '',
          level: 1,
          mystical_level: 0,
          picture_url: undefined,
          myIndex: -1,
        };

        setIsElysium(false);
        setLocLevel(1);
        setLocMysticalLevel(0);
        setLocType(typeList[0]);
        setLocProperty(propertyList[0]);
        setSelectedChar(undefined);
        setSelectedClan('');
      }

      formRef.current?.setFieldValue('name', newSelectedLocation.name);
      formRef.current?.setFieldValue(
        'description',
        newSelectedLocation.description,
      );
      formRef.current?.setFieldValue('address', newSelectedLocation.address);
      formRef.current?.setFieldValue('latitude', newSelectedLocation.latitude);
      formRef.current?.setFieldValue(
        'longitude',
        newSelectedLocation.longitude,
      );

      setSelectedLocation(newSelectedLocation);
    },
    [locationList],
  );

  useEffect(() => {
    loadCharacters();
    loadLocations();
  }, [loadCharacters, loadLocations]);

  return (
    <Container>
      <Header page="addlocal" />

      <TitleBox>
        {charList.length > 0 ? (
          <>
            <strong>Selecione a Localização a ser Atualizada:</strong>

            <SelectLocation
              name="location"
              id="location"
              value={selectedLocation.id}
              defaultValue={selectedLocation.id}
              onChange={handleLocationChange}
            >
              <option value="">Seleciona uma Localização:</option>
              {locationList.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </SelectLocation>
          </>
        ) : (
          <strong>
            Não foi encontrada nenhuma Localização na base de dados.
          </strong>
        )}
      </TitleBox>
      <Content>
        {isBusy ? (
          <Loading />
        ) : (
          <>
            <LocationCardContainer>
              <LocationCard
                locationId={selectedLocation.id ? selectedLocation.id : ''}
                name={selectedLocation.name}
                description={selectedLocation.description}
                address={selectedLocation.address}
                elysium={selectedLocation.elysium}
                type={selectedLocation.type}
                property={selectedLocation.property}
                responsibleId={selectedLocation.responsible}
                responsibleName={
                  selectedLocation.responsible_char
                    ? selectedLocation.responsible_char.name
                    : ''
                }
                clan={selectedLocation.clan}
                level={selectedLocation.level}
                mysticalLevel={selectedLocation.mystical_level}
                pictureUrl={
                  selectedLocation.picture_url
                    ? selectedLocation.picture_url
                    : ''
                }
                locked={selectedLocation.id === undefined}
              />
            </LocationCardContainer>
            <LocationFormContainer>
              <div>
                <h1>Atualize os dados da Localização:</h1>
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
                    mask=""
                    placeholder="Latitude"
                    readOnly={saving}
                  />
                  <Input
                    name="longitude"
                    id="longitude"
                    icon={FiMapPin}
                    mask=""
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
                    <strong>Proprietário / Responsável:</strong>
                    <Select
                      name="responsible"
                      id="responsible"
                      value={selectedChar ? selectedChar.id : ''}
                      // defaultValue=""
                      onChange={handleLocResponsibleChange}
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
                      value={selectedClan || ''}
                      // defaultValue=""
                      onChange={handleLocClanChange}
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
                  <Button
                    type="submit"
                    loading={saving}
                    loadingMessage="Atualizando Localização..."
                  >
                    Confirmar Atualização
                  </Button>
                </ButtonBox>
              </Form>
            </LocationFormContainer>
          </>
        )}
      </Content>
    </Container>
  );
};

export default LocationUpdate;
