/* eslint-disable camelcase */
import React, {
  useState,
  useCallback,
  useEffect,
  ChangeEvent,
  MouseEvent,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  Content,
  LocationCardContainer,
  LocationCharsContainer,
  AddButton,
  SelectLocation,
  SelectContainer,
  Select,
  TableWrapper,
  Table,
  TableCell,
  RemoveButton,
  ButtonBox,
} from './styles';

import Header from '../../components/Header';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import ICharacter from '../../components/CharacterList/ICharacter';
import LocationCard from '../../components/LocationCard';

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

interface ILocationChar {
  location_id: string;
  character_id: string;
  characterId: ICharacter;
}

const LocationCharList: React.FC = () => {
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
  const history = useHistory();
  const [isBusy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [selectedChar, setSelectedChar] = useState<ICharacter>();
  const [locationChars, setLocationChars] = useState<ILocationChar[]>();

  const loadCharacters = useCallback(async () => {
    setBusy(true);

    try {
      await api.get('characters/list/all').then(response => {
        const res = response.data;

        setCharList(res);
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message.indexOf('token') > 0 && error.response.status === 401) {
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

        if (message.indexOf('token') > 0 && error.response.status === 401) {
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

  const loadLocationChars = useCallback(async () => {
    if (selectedLocation.id === undefined) {
      return;
    }
    setBusy(true);

    try {
      await api
        .get(`/locchar/listchars/${selectedLocation.id}`)
        .then(response => {
          const res = response.data;

          const newArray = res.map((locChar: ILocationChar) => {
            const newLocChar = {
              location_id: locChar.location_id,
              character_id: locChar.character_id,
              characterId: locChar.characterId,
            };
            return newLocChar;
          });

          setLocationChars(newArray);
        });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message.indexOf('token') > 0 && error.response.status === 401) {
          addToast({
            type: 'error',
            title: 'Sessão Expirada',
            description: 'Sessão de usuário expirada, faça o login novamente!',
          });

          signOut();
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar os personagens deste local',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, selectedLocation.id, signOut]);

  const handleSelectedCharCharge = useCallback(
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
    },
    [charList],
  );

  const handleLocationChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let newSelectedLocation: ILocation;

      if (selIndex > 0) {
        const selLocation = locationList[selIndex - 1];
        newSelectedLocation = selLocation;
        newSelectedLocation.myIndex = selIndex - 1;
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
      }

      setSelectedLocation(newSelectedLocation);
    },
    [locationList],
  );

  const handleAddCharToLocation = useCallback(async () => {
    if (selectedChar === undefined || selectedLocation === undefined) {
      return;
    }

    setSaving(true);
    try {
      await api
        .post('/locchar/add', {
          location_id: selectedLocation.id,
          char_id: selectedChar.id,
        })
        .then(response => {
          const res: ILocationChar = response.data;

          if (
            res.location_id === selectedLocation.id &&
            res.character_id === selectedChar.id
          ) {
            let newLocationChars: ILocationChar[];

            if (locationChars !== undefined) {
              newLocationChars = [...locationChars, res];
            } else {
              newLocationChars = [res];
            }

            setLocationChars(newLocationChars);
          }
        });

      addToast({
        type: 'success',
        title: 'Personagem adicionado ao Local',
        description: 'Personagem adicionado ao Local com sucesso!',
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message.indexOf('token') > 0 && error.response.status === 401) {
          addToast({
            type: 'error',
            title: 'Sessão Expirada',
            description: 'Sessão de usuário expirada, faça o login novamente!',
          });

          signOut();
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao tentar adicionar personagem ao local',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setSaving(false);
  }, [addToast, locationChars, selectedChar, selectedLocation, signOut]);

  const handleRemoveButton = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      const charId = e.currentTarget.id;

      if (charId === undefined || selectedLocation === undefined) {
        return;
      }

      setSaving(true);
      try {
        const requestData = {
          location_id: selectedLocation.id,
          char_id: charId,
        };

        const reqData = { data: requestData };

        await api.delete('/locchar/remove', reqData).then(() => {
          const newLocationChars = locationChars?.filter(
            locChar => locChar.characterId.id !== charId,
          );

          setLocationChars(newLocationChars);
        });

        addToast({
          type: 'success',
          title: 'Personagem removido do Local',
          description: 'Personagem removido do Local com sucesso!',
        });
      } catch (error) {
        if (error.response) {
          const { message } = error.response.data;

          if (message.indexOf('token') > 0 && error.response.status === 401) {
            addToast({
              type: 'error',
              title: 'Sessão Expirada',
              description:
                'Sessão de usuário expirada, faça o login novamente!',
            });

            signOut();
          } else {
            addToast({
              type: 'error',
              title: 'Erro ao tentar remover personagem dao local',
              description: `Erro: '${message}'`,
            });
          }
        }
      }
      setSaving(false);
    },
    [addToast, locationChars, selectedLocation, signOut],
  );

  useEffect(() => {
    loadCharacters();
    loadLocations();
  }, [loadCharacters, loadLocations]);

  useEffect(() => {
    if (selectedLocation.id !== undefined) {
      loadLocationChars();
    }
  }, [loadLocationChars, selectedLocation]);

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Container>
      <Header page="addlocal" />

      <TitleBox>
        {charList.length > 0 ? (
          <>
            <strong>Selecione uma Localização:</strong>

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
            <LocationCharsContainer>
              <div>
                <h1>Personagens que sabem desta Localização:</h1>
              </div>

              {selectedLocation.responsible_char && (
                <div>
                  <strong>Proprietário / Responsável:</strong>
                  <span>
                    {selectedLocation.responsible_char
                      ? selectedLocation.responsible_char.name
                      : ''}
                  </span>
                </div>
              )}

              {selectedLocation.clan && (
                <div>
                  <strong>Todos os membros do Clã:</strong>
                  <span>{selectedLocation.clan}</span>
                </div>
              )}

              {selectedLocation.elysium ||
              selectedLocation.property === 'public' ? (
                <div>
                  <strong>
                    <b>
                      <br />
                      <br />
                      Este local é de conhecimento de todos por ser Elysium ou
                      Localização Pública.
                    </b>
                  </strong>
                </div>
              ) : (
                <>
                  {selectedLocation.id && (
                    <>
                      <SelectContainer>
                        <strong>Adicionar Personagem:</strong>
                        <Select
                          name="responsible"
                          id="responsible"
                          value={selectedChar ? selectedChar.id : ''}
                          onChange={handleSelectedCharCharge}
                        >
                          <option value="">Personagem:</option>
                          {charList.map(char => (
                            <option key={char.id} value={char.id}>
                              {char.name}
                            </option>
                          ))}
                        </Select>
                        {selectedChar && (
                          <AddButton
                            type="button"
                            onClick={handleAddCharToLocation}
                            disabled={saving}
                          >
                            {saving ? <FaSpinner /> : <FiPlus />}
                          </AddButton>
                        )}
                      </SelectContainer>

                      {locationChars !== undefined && locationChars.length > 0 && (
                        <TableWrapper>
                          <Table>
                            <thead>
                              <tr>
                                <th>Personagem</th>
                                <th>Clã</th>
                                <th>Remover?</th>
                              </tr>
                            </thead>
                            <tbody>
                              {locationChars.map(locChar => (
                                <tr key={locChar.character_id}>
                                  <td>
                                    <TableCell>
                                      {locChar.characterId.name}
                                    </TableCell>
                                  </td>
                                  <td>
                                    <TableCell>
                                      {locChar.characterId.clan}
                                    </TableCell>
                                  </td>
                                  <td>
                                    <RemoveButton
                                      id={locChar.character_id}
                                      type="button"
                                      onClick={handleRemoveButton}
                                      disabled={saving}
                                    >
                                      {saving ? <FaSpinner /> : <FiTrash2 />}
                                    </RemoveButton>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </TableWrapper>
                      )}
                    </>
                  )}
                </>
              )}

              <ButtonBox>
                <Button type="button" onClick={handleGoBack}>
                  Retornar
                </Button>
              </ButtonBox>
            </LocationCharsContainer>
          </>
        )}
      </Content>
    </Container>
  );
};

export default LocationCharList;
