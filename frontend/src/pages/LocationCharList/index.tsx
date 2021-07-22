/* eslint-disable camelcase */
import React, {
  useState,
  useCallback,
  useEffect,
  ChangeEvent,
  MouseEvent,
  useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FiPlus, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
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
  FunctionButton,
  ButtonBox,
} from './styles';

import Button from '../../components/Button';
import Loading from '../../components/Loading';
import Checkbox from '../../components/Checkbox';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useSelection } from '../../hooks/selection';
import { useMobile } from '../../hooks/mobile';
import { useHeader } from '../../hooks/header';
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
  creature_type: string;
  sect: string;
  level: number;
  mystical_level: number;
  picture_url?: string;
  myIndex: number;
}

interface ILocationChar {
  location_id: string;
  character_id: string;
  characterId: ICharacter;
  shared: boolean;
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
    creature_type: '',
    sect: '',
    level: 1,
    mystical_level: 0,
    picture_url: undefined,
    myIndex: -1,
  });

  const [isBusy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [selectedChar, setSelectedChar] = useState<ICharacter>();
  const [sharedLocation, setSharedLocation] = useState<boolean>(false);
  const [locationChars, setLocationChars] = useState<ILocationChar[]>();
  const { addToast } = useToast();
  const { signOut } = useAuth();
  const { setChar } = useSelection();
  const { isMobileVersion } = useMobile();
  const { setCurrentPage } = useHeader();
  const history = useHistory();

  const [isScrollOn, setIsScrollOn] = useState<boolean>(true);
  const tableRowRef = useRef<HTMLTableRowElement>(null);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

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

        if (error.response.status !== 401) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar personagens',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast]);

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
            creature_type:
              location.creature_type !== null ? location.creature_type : '',
            sect: location.sect !== null ? location.sect : '',
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
            const newLocChar = locChar;

            let filteredClan: string[];
            if (newLocChar.characterId.clan) {
              filteredClan = newLocChar.characterId.clan.split(' (');
              filteredClan = filteredClan[0].split(':');
            } else {
              filteredClan = [''];
            }

            const clanIndex = 0;
            newLocChar.characterId.clan = filteredClan[clanIndex];

            return newLocChar;
          });

          setLocationChars(newArray);
        });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (error.response.status !== 401) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar os personagens deste local',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, selectedLocation.id]);

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
          creature_type: '',
          sect: '',
          level: 1,
          mystical_level: 0,
          picture_url: undefined,
          myIndex: -1,
        };
      }

      setSelectedLocation(newSelectedLocation);
      setSharedLocation(false);
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
          shared: sharedLocation,
        })
        .then(response => {
          const res: ILocationChar = response.data;

          if (
            res.location_id === selectedLocation.id &&
            res.character_id === selectedChar.id
          ) {
            let newLocationChars: ILocationChar[];
            const newLocChar = res;

            let filteredClan: string[];
            if (newLocChar.characterId.clan) {
              filteredClan = newLocChar.characterId.clan.split(' (');
              filteredClan = filteredClan[0].split(':');
            } else {
              filteredClan = [''];
            }

            const clanIndex = 0;
            newLocChar.characterId.clan = filteredClan[clanIndex];

            if (locationChars !== undefined) {
              newLocationChars = [...locationChars, res];

              newLocationChars.sort((a, b) => {
                const nameA = a.characterId
                  ? a.characterId.name
                      .toUpperCase()
                      .replace(/[ÁÀÃÂ]/gi, 'A')
                      .replace(/[ÉÊ]/gi, 'E')
                      .replace(/[Í]/gi, 'I')
                      .replace(/[ÓÔÕ]/gi, 'O')
                      .replace(/[Ú]/gi, 'U')
                  : '';
                const nameB = b.characterId
                  ? b.characterId.name
                      .toUpperCase()
                      .replace(/[ÁÀÃÂ]/gi, 'A')
                      .replace(/[ÉÊ]/gi, 'E')
                      .replace(/[Í]/gi, 'I')
                      .replace(/[ÓÔÕ]/gi, 'O')
                      .replace(/[Ú]/gi, 'U')
                  : '';

                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }

                return 0;
              });
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
            title: 'Erro ao tentar adicionar personagem ao local',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setSaving(false);
  }, [
    addToast,
    locationChars,
    selectedChar,
    selectedLocation,
    sharedLocation,
    signOut,
  ]);

  const handleUpdateCharLocation = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      const charData = e.currentTarget.id.split(':');

      if (charData === undefined) {
        return;
      }

      if (charData.length !== 2) {
        return;
      }

      const charId = charData[0];

      if (charId === undefined || selectedLocation === undefined) {
        return;
      }

      const shared: boolean = charData[1] === 'true';

      setSaving(true);
      try {
        await api
          .patch('/locchar/update', {
            location_id: selectedLocation.id,
            char_id: charId,
            shared: !shared,
          })
          .then(response => {
            const errorMsg = response.data.message;

            if (
              errorMsg ===
              'The character was removed from Location, he is only aware of it now'
            ) {
              const newLocationChars = locationChars?.filter(
                (locChar: ILocationChar) => {
                  if (
                    locChar.character_id === charId &&
                    locChar.location_id === selectedLocation.id
                  ) {
                    return false;
                  }
                  return true;
                },
              );

              setLocationChars(newLocationChars);
            } else {
              const res: ILocationChar = response.data;

              if (
                res.location_id === selectedLocation.id &&
                res.character_id === charId
              ) {
                let newLocationChars: ILocationChar[];
                const newLocChar = res;

                let filteredClan: string[];
                if (newLocChar.characterId.clan) {
                  filteredClan = newLocChar.characterId.clan.split(' (');
                  filteredClan = filteredClan[0].split(':');
                } else {
                  filteredClan = [''];
                }

                const clanIndex = 0;
                newLocChar.characterId.clan = filteredClan[clanIndex];

                if (locationChars !== undefined) {
                  newLocationChars = locationChars.map(
                    (locChar: ILocationChar) => {
                      let updatedLocChar: ILocationChar;
                      if (
                        locChar.character_id === newLocChar.character_id &&
                        locChar.location_id === newLocChar.location_id
                      ) {
                        updatedLocChar = newLocChar;
                      } else {
                        updatedLocChar = locChar;
                      }

                      return updatedLocChar;
                    },
                  );

                  setLocationChars(newLocationChars);
                }
              }
            }
          });

        addToast({
          type: 'success',
          title: 'Atualizado situação do Personagem no Local',
          description:
            'Situação do Personagem atualizado ao Local com sucesso!',
        });
      } catch (error) {
        if (error.response) {
          const { message } = error.response.data;

          if (message?.indexOf('token') > 0 && error.response.status === 401) {
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
              title: 'Erro ao tentar adicionar atualizar o personagem no local',
              description: `Erro: '${message}'`,
            });
          }
        }
      }
      setSaving(false);
    },
    [addToast, locationChars, selectedLocation, signOut],
  );

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

          if (message?.indexOf('token') > 0 && error.response.status === 401) {
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

  const handleCharacterDetails = useCallback(
    async (e: MouseEvent<HTMLTableDataCellElement>) => {
      const charId = e.currentTarget.id;
      const detailChar = charList.find(ch => ch.id === charId);

      if (detailChar) {
        setChar(detailChar);
        history.push(`/character/${charId}`);
      }
    },
    [charList, history, setChar],
  );

  const handleSharedLocation = useCallback(() => {
    setSharedLocation(!sharedLocation);
  }, [sharedLocation]);

  useEffect(() => {
    setTimeout(() => {
      if (tableRowRef.current && tableBodyRef.current) {
        if (
          tableRowRef.current.offsetWidth === tableBodyRef.current.offsetWidth
        ) {
          setIsScrollOn(false);
        } else {
          setIsScrollOn(true);
        }
      }
    }, 50);
  }, [locationChars]);

  useEffect(() => {
    setCurrentPage('localchars');
    loadCharacters();
    loadLocations();
  }, [loadCharacters, loadLocations, setCurrentPage]);

  useEffect(() => {
    if (selectedLocation.id !== undefined) {
      loadLocationChars();
    }
  }, [loadLocationChars, selectedLocation]);

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Container isMobile={isMobileVersion}>
      <TitleBox>
        {charList.length > 0 ? (
          <>
            {isMobileVersion ? (
              <strong>Localização:</strong>
            ) : (
              <strong>Selecione uma Localização:</strong>
            )}

            <SelectLocation
              name="location"
              id="location"
              value={selectedLocation.id}
              defaultValue={selectedLocation.id}
              onChange={handleLocationChange}
            >
              <option value="">Selecione uma Localização:</option>
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
      <Content isMobile={isMobileVersion}>
        {isBusy ? (
          <Loading />
        ) : (
          <>
            <LocationCardContainer isMobile={isMobileVersion}>
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
                creature_type={selectedLocation.creature_type}
                sect={selectedLocation.sect}
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
            <LocationCharsContainer isMobile={isMobileVersion}>
              <div>
                <h1>Personagens que sabem desta Localização:</h1>
              </div>

              {selectedLocation.responsible_char && (
                <div>
                  {isMobileVersion ? (
                    <strong>Responsável:</strong>
                  ) : (
                    <strong>Proprietário / Responsável:</strong>
                  )}

                  <span>
                    {selectedLocation.responsible_char
                      ? selectedLocation.responsible_char.name
                      : ''}
                  </span>
                </div>
              )}

              {selectedLocation.creature_type && (
                <div>
                  <strong>Todos os:</strong>
                  <span>{selectedLocation.creature_type}</span>
                </div>
              )}

              {selectedLocation.sect && (
                <div>
                  {isMobileVersion ? (
                    <strong>Secto:</strong>
                  ) : (
                    <strong>Todos os membros:</strong>
                  )}

                  <span>{selectedLocation.sect}</span>
                </div>
              )}

              {selectedLocation.clan && (
                <div>
                  {isMobileVersion ? (
                    <strong>Todos do Clã:</strong>
                  ) : (
                    <strong>Todos os membros do Clã:</strong>
                  )}
                  <span>{selectedLocation.clan}</span>
                </div>
              )}

              {selectedLocation.property === 'public' ? (
                <div>
                  <strong>
                    <b>
                      <br />
                      <br />
                      Este local é de conhecimento de todos por Localização
                      Pública.
                    </b>
                  </strong>
                </div>
              ) : (
                <>
                  {selectedLocation.id && (
                    <>
                      <SelectContainer isMobile={isMobileVersion}>
                        <strong>Adicionar Personagem:</strong>
                        <div>
                          <Select
                            name="responsible"
                            id="responsible"
                            value={selectedChar ? selectedChar.id : ''}
                            onChange={handleSelectedCharCharge}
                            isMobile={isMobileVersion}
                          >
                            <option value="">Personagem:</option>
                            {charList.map(char => (
                              <option key={char.id} value={char.id}>
                                {char.name}
                              </option>
                            ))}
                          </Select>
                          {selectedChar && (
                            <>
                              {!isMobileVersion && (
                                <Checkbox
                                  name="sharedLocation"
                                  id="sharedLocation"
                                  checked={sharedLocation}
                                  titlebar
                                  onChange={handleSharedLocation}
                                >
                                  Co-Proprietário?
                                </Checkbox>
                              )}
                              <AddButton
                                type="button"
                                onClick={handleAddCharToLocation}
                                disabled={saving}
                              >
                                {saving ? <FaSpinner /> : <FiPlus />}
                              </AddButton>
                            </>
                          )}
                        </div>
                      </SelectContainer>

                      <TableWrapper
                        isMobile={isMobileVersion}
                        isVisible={
                          locationChars !== undefined &&
                          locationChars.length > 0
                        }
                      >
                        <Table
                          isMobile={isMobileVersion}
                          isScrollOn={isScrollOn}
                        >
                          <thead>
                            <tr>
                              <th>Personagem</th>
                              {!isMobileVersion && <th>Clã</th>}
                              <th>
                                {isMobileVersion
                                  ? 'Co-Prop.?'
                                  : 'Co-Proprietário?'}
                              </th>
                              <th>Remover?</th>
                            </tr>
                          </thead>
                          <tbody ref={tableBodyRef}>
                            {locationChars !== undefined ? (
                              <>
                                {locationChars.map((locChar, index) => (
                                  <tr
                                    key={locChar.character_id}
                                    ref={index === 0 ? tableRowRef : undefined}
                                  >
                                    <td
                                      id={locChar.character_id}
                                      onClick={handleCharacterDetails}
                                    >
                                      <TableCell isMobile={isMobileVersion}>
                                        <span>{locChar.characterId.name}</span>
                                      </TableCell>
                                    </td>
                                    {!isMobileVersion && (
                                      <td
                                        id={locChar.character_id}
                                        onClick={handleCharacterDetails}
                                      >
                                        <TableCell isMobile={isMobileVersion}>
                                          <span>
                                            {locChar.characterId
                                              .creature_type !== 'Vampire' &&
                                            locChar.characterId
                                              .creature_type !== 'Mortal' ? (
                                              // eslint-disable-next-line react/jsx-indent
                                              <>
                                                {locChar.characterId.clan ? (
                                                  <>
                                                    {`${locChar.characterId.creature_type}: ${locChar.characterId.clan}`}
                                                  </>
                                                ) : (
                                                  <>
                                                    {
                                                      locChar.characterId
                                                        .creature_type
                                                    }
                                                  </>
                                                )}
                                              </>
                                            ) : (
                                              <>
                                                {locChar.characterId.clan.indexOf(
                                                  ' (',
                                                ) > 0
                                                  ? locChar.characterId.clan.substring(
                                                      0,
                                                      locChar.characterId.clan.indexOf(
                                                        ' (',
                                                      ),
                                                    )
                                                  : locChar.characterId.clan}
                                              </>
                                            )}
                                          </span>
                                        </TableCell>
                                      </td>
                                    )}
                                    <td>
                                      <TableCell
                                        isMobile={isMobileVersion}
                                        centered
                                      >
                                        <span>
                                          <FunctionButton
                                            id={`${locChar.character_id}:${locChar.shared}`}
                                            type="button"
                                            onClick={handleUpdateCharLocation}
                                            disabled={saving}
                                            title={
                                              locChar.shared ? 'Sim' : 'Não'
                                            }
                                            green={locChar.shared}
                                          >
                                            {saving ? (
                                              <FaSpinner />
                                            ) : (
                                              <>
                                                {locChar.shared ? (
                                                  <FiCheck />
                                                ) : (
                                                  <FiX />
                                                )}
                                              </>
                                            )}
                                          </FunctionButton>
                                        </span>
                                      </TableCell>
                                    </td>

                                    <td>
                                      <FunctionButton
                                        id={locChar.character_id}
                                        type="button"
                                        onClick={handleRemoveButton}
                                        disabled={saving}
                                        title="Remover"
                                      >
                                        {saving ? <FaSpinner /> : <FiTrash2 />}
                                      </FunctionButton>
                                    </td>
                                  </tr>
                                ))}
                              </>
                            ) : (
                              <tr>
                                <td>Nenhum</td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </TableWrapper>
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
