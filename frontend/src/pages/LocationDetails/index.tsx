/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { useHistory, useParams } from 'react-router-dom';
// import { FiPlus, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { FiPlus, FiMinus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { FaSpinner, FaShieldAlt, FaEye } from 'react-icons/fa';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  Content,
  LocationCardContainer,
  LocationDetailsContainer,
  LocationShields,
  LocationShield,
  LocationContainer,
  DetailsContainer,
  DoubleDetailsContainer,
  SingleTraitContainer,
  SelectContainer,
  Select,
  AddButton,
  AddonContainer,
  AddonDiv,
  ActionContainer,
  ActionTitle,
  LevelBox,
  LevelTemp,
  ActionButton,
  SubDivision,
  AddonRequirement,
  AddonReqTitle,
  AddonReqDesc,
  GoBackButton,
} from './styles';

// import Button from '../../components/Button';
import Loading from '../../components/Loading';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useModalBox } from '../../hooks/modalBox';
import { useMobile } from '../../hooks/mobile';
import { useHeader } from '../../hooks/header';
import ICharacter from '../../components/CharacterList/ICharacter';
import LocationCard from '../../components/LocationCard';

import AddonCard, { IAddon, IAddonDetails } from '../../components/AddonCard';

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
}

interface IRouteParams {
  locationId: string;
}

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

const LocationDetails: React.FC = () => {
  const { locationId } = useParams<IRouteParams>();
  const [locationAddonList, setLocationAddonList] = useState<IAddon[]>([]);
  const [availableAddonsList, setAvailableAddonsList] = useState<
    IAddonDetails[]
  >([]);
  const [selectedAddon, setSelectedAddon] = useState<
    IAddonDetails | undefined
  >();
  const [locationDefense, setLocationDefense] = useState<number>(0);
  const [locationSurveillance, setLocationSurveillance] = useState<number>(0);

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
  });

  const [isBusy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const { showModal } = useModalBox();
  const { signOut, char, user } = useAuth();
  const { isMobileVersion } = useMobile();
  const { setCurrentPage } = useHeader();
  const history = useHistory();

  const loadLocation = useCallback(async () => {
    setBusy(true);

    try {
      await api
        .post('locations/show', {
          location_id: locationId,
          char_id: user.storyteller ? undefined : char.id,
        })
        .then(response => {
          const location = response.data;
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
            level: parseInt(`${location.level}`, 10),
            mystical_level: location.mystical_level,
            picture_url: location.picture_url || undefined,
          };

          setSelectedLocation(newLocation);
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
            title: 'Erro ao tentar carregar local',
            description: `Erro: '${message}'`,
          });
        }
      }
    }

    setBusy(false);
  }, [addToast, char.id, locationId, signOut, user.storyteller]);

  const loadLocationAddons = useCallback(async () => {
    try {
      await api
        .post('locaddon/list', {
          char_id: user.storyteller ? undefined : char.id,
          location_id: locationId,
        })
        .then(response => {
          const res = response.data;

          const { defense, surveillance } = res;

          const newAddonList = res.addonsList.map((addon: IAddon) => {
            let currentAddon: IAddonDetails | null = null;
            let nextAddon: IAddonDetails | null = null;

            if (addon.currentAddon !== null) {
              currentAddon = {
                name: addon.currentAddon.name,
                level: addon.currentAddon.level,
                description: addon.currentAddon.description,
                defense: parseInt(`${addon.currentAddon.defense}`, 10),
                surveillance: parseInt(
                  `${addon.currentAddon.surveillance}`,
                  10,
                ),
                req_background: addon.currentAddon.req_background,
                req_merit: addon.currentAddon.req_merit,
                req_influence: addon.currentAddon.req_influence,
                req_other: addon.currentAddon.req_other,
                req_addon_1: addon.currentAddon.req_addon_1,
                req_addon_2: addon.currentAddon.req_addon_2,
                req_addon_3: addon.currentAddon.req_addon_3,
                ability: addon.currentAddon.ability,
                ability_qty: parseInt(`${addon.currentAddon.ability_qty}`, 10),
                influence: addon.currentAddon.influence,
                influence_qty: parseInt(
                  `${addon.currentAddon.influence_qty}`,
                  10,
                ),
                time_qty: parseInt(`${addon.currentAddon.time_qty}`, 10),
                time_type: addon.currentAddon.time_type,
              };
            }

            if (addon.nextAddon !== null) {
              nextAddon = {
                name: addon.nextAddon.name,
                level: addon.nextAddon.level,
                description: addon.nextAddon.description,
                defense: parseInt(`${addon.nextAddon.defense}`, 10),
                surveillance: parseInt(`${addon.nextAddon.surveillance}`, 10),
                req_background: addon.nextAddon.req_background,
                req_merit: addon.nextAddon.req_merit,
                req_influence: addon.nextAddon.req_influence,
                req_other: addon.nextAddon.req_other,
                req_addon_1: addon.nextAddon.req_addon_1,
                req_addon_2: addon.nextAddon.req_addon_2,
                req_addon_3: addon.nextAddon.req_addon_3,
                ability: addon.nextAddon.ability,
                ability_qty: parseInt(`${addon.nextAddon.ability_qty}`, 10),
                influence: addon.nextAddon.influence,
                influence_qty: parseInt(`${addon.nextAddon.influence_qty}`, 10),
                time_qty: parseInt(`${addon.nextAddon.time_qty}`, 10),
                time_type: addon.nextAddon.time_type,
              };
            }

            const newAddon: IAddon = {
              location_id: addon.location_id,
              addon_name: addon.addon_name,
              addon_level: parseInt(`${addon.addon_level}`, 10),
              temp_ability: parseInt(`${addon.temp_ability}`, 10),
              temp_influence: parseInt(`${addon.temp_influence}`, 10),
              currentAddon,
              nextAddon,
            };

            return newAddon;
          });

          setLocationDefense(defense);
          setLocationSurveillance(surveillance);
          setLocationAddonList(newAddonList);
        });
    } catch (error) {
      const parsedError: any = error;

      if (parsedError.response) {
        const { message } = parsedError.response.data;

        if (parsedError.response.status !== 401) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar addons da Localização',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
  }, [addToast, char.id, locationId, user.storyteller]);

  const loadAvailableAddons = useCallback(async () => {
    try {
      await api
        .post('addons/list', {
          char_id: user.storyteller ? undefined : char.id,
          location_id: locationId,
        })
        .then(response => {
          const addons = response.data;
          const newAddons = addons.map((addon: IAddonDetails) => {
            const newAddon: IAddonDetails = {
              name: addon.name,
              level: parseInt(`${addon.level}`, 10),
              description: addon.description,
              defense: parseInt(`${addon.defense}`, 10),
              surveillance: parseInt(`${addon.surveillance}`, 10),
              req_background: addon.req_background,
              req_merit: addon.req_merit,
              req_influence: addon.req_influence,
              req_other: addon.req_other,
              req_addon_1: addon.req_addon_1,
              req_addon_2: addon.req_addon_2,
              req_addon_3: addon.req_addon_3,
              ability: addon.ability,
              ability_qty: parseInt(`${addon.ability_qty}`, 10),
              influence: addon.influence,
              influence_qty: parseInt(`${addon.influence_qty}`, 10),
              time_qty: parseInt(`${addon.time_qty}`, 10),
              time_type: addon.time_type,
            };

            return newAddon;
          });

          setAvailableAddonsList(newAddons);
        });
    } catch (error) {
      const parsedError: any = error;

      if (parsedError.response) {
        const { message } = parsedError.response.data;

        if (parsedError.response.status !== 401) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar addons disponíveis',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
  }, [addToast, char.id, locationId, user.storyteller]);

  const handleAddAddonToLocation = useCallback(async () => {
    if (selectedAddon === undefined || selectedLocation.id === undefined) {
      return;
    }

    setSaving(true);

    try {
      await api
        .post('/locaddon/add', {
          addon_name: selectedAddon.name,
          location_id: selectedLocation.id,
        })
        .then(() => {
          loadLocationAddons();
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
            title: 'Erro ao tentar adicionar addon',
            description: `Erro: '${message}'`,
          });
        }
      }
    }

    setSaving(false);
  }, [
    addToast,
    loadLocationAddons,
    selectedAddon,
    selectedLocation.id,
    signOut,
  ]);

  const handleSelectedAddonChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let mySelectedAddon: IAddonDetails | undefined;

      if (selIndex > 0) {
        const selAddon = availableAddonsList[selIndex - 1];
        mySelectedAddon = selAddon;
      } else {
        mySelectedAddon = undefined;
      }

      setSelectedAddon(mySelectedAddon);
    },
    [availableAddonsList],
  );

  const deleteAddon = useCallback(
    async addon => {
      setSaving(true);

      try {
        const requestData = {
          location_id: selectedLocation.id,
          addon_name: addon,
        };

        const reqData = { data: requestData };

        await api.delete('/locaddon/remove', reqData);

        addToast({
          type: 'success',
          title: 'Addon Removido',
          description: 'O Addon foi removido com sucesso!',
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
              description:
                'Sessão de usuário expirada, faça o login novamente!',
            });

            signOut();
          } else {
            addToast({
              type: 'error',
              title: 'Erro ao tentar remover o addon da localização',
              description: `Erro: '${message}'`,
            });
          }
        }
      }

      loadLocationAddons();

      setSaving(false);
    },
    [addToast, loadLocationAddons, selectedLocation.id, signOut],
  );

  const handleAddonLevelChange = useCallback(
    async (addon, newLevel) => {
      if (newLevel < 0) {
        showModal({
          type: 'warning',
          title: 'Confirmar remoção de addon',
          description: `Você está prestes a remover o addon [${addon}], você confirma?`,
          btn1Title: 'Sim',
          btn1Function: () => deleteAddon(addon),
          btn2Title: 'Não',
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          btn2Function: () => {},
        });
      } else {
        setSaving(true);

        try {
          await api
            .patch('/locaddon/update', {
              addon_name: addon,
              addon_level: newLevel,
              location_id: selectedLocation.id,
            })
            .then(() => {
              loadLocationAddons();
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
                description:
                  'Sessão de usuário expirada, faça o login novamente!',
              });

              signOut();
            } else {
              addToast({
                type: 'error',
                title: 'Erro ao tentar alterar o nível do Addon',
                description: `Erro: '${message}'`,
              });
            }
          }
        }

        setSaving(false);
      }
    },
    [
      addToast,
      deleteAddon,
      loadLocationAddons,
      selectedLocation.id,
      showModal,
      signOut,
    ],
  );

  const handleAddonProgressChange = useCallback(
    async (addon, type, newLevel) => {
      setSaving(true);

      try {
        await api
          .patch('/locaddon/update', {
            addon_name: addon,
            temp_ability: type === 'ability' ? newLevel : undefined,
            temp_influence: type === 'influence' ? newLevel : undefined,
            location_id: selectedLocation.id,
          })
          .then(() => {
            loadLocationAddons();
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
              description:
                'Sessão de usuário expirada, faça o login novamente!',
            });

            signOut();
          } else {
            addToast({
              type: 'error',
              title: 'Erro ao tentar alterar o progresso do Addon',
              description: `Erro: '${message}'`,
            });
          }
        }
      }

      setSaving(false);
    },
    [addToast, loadLocationAddons, selectedLocation.id, signOut],
  );

  const getLocTypePT = useCallback((type: string) => {
    const typePt = typeList.find(myType => myType.titleEn === type);

    if (typePt) return typePt.title;

    return type;
  }, []);

  const getLocPropertyPT = useCallback((property: string) => {
    const propertyPt = propertyList.find(
      myProperty => myProperty.titleEn === property,
    );

    if (propertyPt) return propertyPt.title;

    return property;
  }, []);

  const buildAddonCard = useCallback(
    (addon: IAddon) => {
      const rows = [];
      const isStoryteller = user.storyteller;

      rows.push(
        <AddonContainer
          key={`AddonCard-${addon.addon_name}`}
          level={addon.addon_level}
          isMobile={isMobileVersion}
        >
          <AddonCard
            location_id={addon.location_id}
            addon_name={addon.addon_name}
            addon_level={addon.addon_level}
            temp_ability={addon.temp_ability}
            temp_influence={addon.temp_influence}
            currentAddon={addon.currentAddon}
            nextAddon={addon.nextAddon}
          />

          {isStoryteller && (
            <>
              <ActionTitle isMobile={isMobileVersion}>Nível</ActionTitle>

              <ActionContainer>
                <ActionButton
                  mode="down"
                  onClick={
                    saving
                      ? undefined
                      : () =>
                          handleAddonLevelChange(
                            addon.addon_name,
                            addon.addon_level - 1,
                          )
                  }
                >
                  {addon.addon_level === 0 ? <FiTrash2 /> : <FiMinus />}
                </ActionButton>
                <LevelBox>
                  <LevelTemp>{addon.addon_level}</LevelTemp>
                </LevelBox>
                <ActionButton
                  mode="up"
                  key={addon.addon_name}
                  onClick={
                    saving
                      ? undefined
                      : () =>
                          handleAddonLevelChange(
                            addon.addon_name,
                            addon.addon_level + 1,
                          )
                  }
                  disabled={addon.nextAddon === null}
                >
                  <FiPlus />
                </ActionButton>
              </ActionContainer>

              <SubDivision />
            </>
          )}

          {addon.nextAddon !== null && (
            <>
              <ActionTitle isMobile={isMobileVersion}>
                {`Progresso até o Nível ${addon.nextAddon.level}`}
              </ActionTitle>

              <AddonRequirement justifyCenter>
                <AddonReqTitle>
                  {`Habilidades chaves (${addon.nextAddon.ability_qty}):`}
                </AddonReqTitle>
                <AddonReqDesc>{addon.nextAddon.ability}</AddonReqDesc>
              </AddonRequirement>
              <ActionContainer>
                {isStoryteller && (
                  <ActionButton
                    mode="down"
                    onClick={
                      saving
                        ? undefined
                        : () =>
                            handleAddonProgressChange(
                              addon.addon_name,
                              'ability',
                              addon.temp_ability - 1,
                            )
                    }
                    disabled={addon.temp_ability === 0}
                  >
                    <FiMinus />
                  </ActionButton>
                )}
                <LevelBox>
                  {isStoryteller ? (
                    <LevelTemp>{addon.temp_ability}</LevelTemp>
                  ) : (
                    <span>{addon.temp_ability}</span>
                  )}
                  <span>/</span>
                  <span>{addon.nextAddon.ability_qty}</span>
                </LevelBox>
                {isStoryteller && (
                  <ActionButton
                    mode="up"
                    onClick={
                      saving
                        ? undefined
                        : () =>
                            handleAddonProgressChange(
                              addon.addon_name,
                              'ability',
                              addon.temp_ability + 1,
                            )
                    }
                    disabled={
                      addon.temp_ability === addon.nextAddon.ability_qty
                    }
                  >
                    <FiPlus />
                  </ActionButton>
                )}
              </ActionContainer>

              <AddonRequirement justifyCenter>
                <AddonReqTitle>
                  {`Influências chaves (${addon.nextAddon.influence_qty}):`}
                </AddonReqTitle>
                <AddonReqDesc>{addon.nextAddon.influence}</AddonReqDesc>
              </AddonRequirement>
              <ActionContainer>
                {isStoryteller && (
                  <ActionButton
                    mode="down"
                    onClick={
                      saving
                        ? undefined
                        : () =>
                            handleAddonProgressChange(
                              addon.addon_name,
                              'influence',
                              addon.temp_influence - 1,
                            )
                    }
                    disabled={addon.temp_influence === 0}
                  >
                    <FiMinus />
                  </ActionButton>
                )}

                <LevelBox>
                  {isStoryteller ? (
                    <LevelTemp>{addon.temp_influence}</LevelTemp>
                  ) : (
                    <span>{addon.temp_influence}</span>
                  )}
                  <span>/</span>
                  <span>{addon.nextAddon.influence_qty}</span>
                </LevelBox>
                {isStoryteller && (
                  <ActionButton
                    mode="up"
                    onClick={
                      saving
                        ? undefined
                        : () =>
                            handleAddonProgressChange(
                              addon.addon_name,
                              'influence',
                              addon.temp_influence + 1,
                            )
                    }
                    disabled={
                      addon.temp_influence === addon.nextAddon.influence_qty
                    }
                  >
                    <FiPlus />
                  </ActionButton>
                )}
              </ActionContainer>

              <SubDivision />
              <ActionTitle isMobile={isMobileVersion}>
                Requisitos do próximo nível
              </ActionTitle>
              <AddonRequirement>
                <AddonReqTitle>Tempo mínimo:</AddonReqTitle>
                <AddonReqDesc>{`${addon.nextAddon.time_qty} ${addon.nextAddon.time_type}`}</AddonReqDesc>
              </AddonRequirement>

              {(addon.nextAddon.req_merit !== null ||
                addon.nextAddon.req_background !== null ||
                addon.nextAddon.req_influence !== null ||
                addon.nextAddon.req_addon_1 !== null) && (
                <>
                  {addon.nextAddon.req_merit !== null && (
                    <AddonRequirement>
                      <AddonReqTitle>Qualidades:</AddonReqTitle>
                      <AddonReqDesc>{addon.nextAddon.req_merit}</AddonReqDesc>
                    </AddonRequirement>
                  )}

                  {addon.nextAddon.req_background !== null && (
                    <AddonRequirement>
                      <AddonReqTitle>Antecedentes:</AddonReqTitle>
                      <AddonReqDesc>
                        {addon.nextAddon.req_background}
                      </AddonReqDesc>
                    </AddonRequirement>
                  )}

                  {addon.nextAddon.req_influence !== null && (
                    <AddonRequirement>
                      <AddonReqTitle>Influências:</AddonReqTitle>
                      <AddonReqDesc>
                        {addon.nextAddon.req_influence}
                      </AddonReqDesc>
                    </AddonRequirement>
                  )}

                  {addon.nextAddon.req_addon_1 !== null && (
                    <AddonRequirement>
                      <AddonReqTitle>Addons:</AddonReqTitle>
                      <AddonReqDesc>
                        {`${addon.nextAddon.req_addon_1}${
                          addon.nextAddon.req_addon_2 !== null
                            ? `, ${addon.nextAddon.req_addon_2}`
                            : ''
                        }${
                          addon.nextAddon.req_addon_3 !== null
                            ? `, ${addon.nextAddon.req_addon_3}`
                            : ''
                        }`}
                      </AddonReqDesc>
                    </AddonRequirement>
                  )}
                </>
              )}
            </>
          )}
        </AddonContainer>,
      );

      return rows;
    },
    [
      handleAddonLevelChange,
      handleAddonProgressChange,
      isMobileVersion,
      saving,
      user.storyteller,
    ],
  );

  useEffect(() => {
    setCurrentPage('localdetails');
  }, [setCurrentPage]);

  useEffect(() => {
    if (locationId && locationId !== '') {
      loadLocation();
      loadLocationAddons();
      loadAvailableAddons();
    }
  }, [locationId, loadLocationAddons, loadLocation, loadAvailableAddons]);

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Container isMobile={isMobileVersion}>
      <TitleBox>
        {selectedLocation.id ? (
          <strong>Detalhes da Localização</strong>
        ) : (
          <strong>Localização não encontrada.</strong>
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
                locked
              />
            </LocationCardContainer>

            <LocationDetailsContainer isMobile={isMobileVersion}>
              {selectedLocation.id && (
                <LocationContainer>
                  <DetailsContainer isMobile={isMobileVersion}>
                    <h1>{selectedLocation.name}</h1>
                    <h2>{`Nível ${selectedLocation.level}`}</h2>

                    <LocationShields isMobile={isMobileVersion}>
                      <LocationShield title="Defesa" isMobile={isMobileVersion}>
                        <FaShieldAlt />
                        <span>{locationDefense}</span>
                      </LocationShield>
                      <LocationShield
                        title="Vigilância"
                        isMobile={isMobileVersion}
                      >
                        <FaEye />
                        <span>{locationSurveillance}</span>
                      </LocationShield>
                    </LocationShields>
                  </DetailsContainer>

                  {isMobileVersion ? (
                    <DetailsContainer isMobile={isMobileVersion} borderTop>
                      <h2>Informações Gerais</h2>
                      <SingleTraitContainer isMobile={isMobileVersion}>
                        <strong>Endereço:</strong>
                        <span>{selectedLocation.address}</span>
                      </SingleTraitContainer>
                      <SingleTraitContainer isMobile={isMobileVersion}>
                        <strong>Descrição:</strong>
                        <span>{selectedLocation.description}</span>
                      </SingleTraitContainer>
                      <SingleTraitContainer isMobile={isMobileVersion}>
                        <strong>Elysium:</strong>
                        {selectedLocation.elysium ? (
                          <span>Sim</span>
                        ) : (
                          <span>Não</span>
                        )}
                      </SingleTraitContainer>
                      {selectedLocation.mystical_level > 0 && (
                        <SingleTraitContainer isMobile={isMobileVersion}>
                          <strong>Nível Místico:</strong>
                          <span>{selectedLocation.mystical_level}</span>
                        </SingleTraitContainer>
                      )}
                      <h2>Propriedade e Conhecimento</h2>
                      <SingleTraitContainer isMobile={isMobileVersion}>
                        <strong>Tipo:</strong>
                        <span>{getLocTypePT(selectedLocation.type)}</span>
                      </SingleTraitContainer>
                      <SingleTraitContainer isMobile={isMobileVersion}>
                        <strong>Propriedade:</strong>
                        <span>
                          {getLocPropertyPT(selectedLocation.property)}
                        </span>
                      </SingleTraitContainer>
                      {selectedLocation.responsible_char && (
                        <SingleTraitContainer isMobile={isMobileVersion}>
                          <strong>Responsável:</strong>
                          <span>
                            {getLocPropertyPT(
                              selectedLocation.responsible_char.name,
                            )}
                          </span>
                        </SingleTraitContainer>
                      )}
                      {selectedLocation.creature_type !== '' && (
                        <SingleTraitContainer isMobile={isMobileVersion}>
                          <strong>Conhecido pelos:</strong>
                          <span>{selectedLocation.creature_type}</span>
                        </SingleTraitContainer>
                      )}
                      {selectedLocation.clan !== '' && (
                        <SingleTraitContainer isMobile={isMobileVersion}>
                          <strong>Conhecido pelo clã:</strong>
                          <span>{selectedLocation.clan}</span>
                        </SingleTraitContainer>
                      )}
                      {selectedLocation.sect !== '' && (
                        <SingleTraitContainer isMobile={isMobileVersion}>
                          <strong>Conhecido pelo secto:</strong>
                          <span>{selectedLocation.sect}</span>
                        </SingleTraitContainer>
                      )}
                    </DetailsContainer>
                  ) : (
                    <DoubleDetailsContainer>
                      <DetailsContainer isMobile={isMobileVersion} borderTop>
                        <h2>Informações Gerais</h2>
                        <SingleTraitContainer isMobile={isMobileVersion}>
                          <strong>Endereço:</strong>
                          <span>{selectedLocation.address}</span>
                        </SingleTraitContainer>
                        <SingleTraitContainer isMobile={isMobileVersion}>
                          <strong>Descrição:</strong>
                          <span>{selectedLocation.description}</span>
                        </SingleTraitContainer>
                        <SingleTraitContainer isMobile={isMobileVersion}>
                          <strong>Elysium:</strong>
                          {selectedLocation.elysium ? (
                            <span>Sim</span>
                          ) : (
                            <span>Não</span>
                          )}
                        </SingleTraitContainer>
                        {selectedLocation.mystical_level > 0 && (
                          <SingleTraitContainer isMobile={isMobileVersion}>
                            <strong>Nível Místico:</strong>
                            <span>{selectedLocation.mystical_level}</span>
                          </SingleTraitContainer>
                        )}
                      </DetailsContainer>
                      <DetailsContainer
                        isMobile={isMobileVersion}
                        borderTop
                        borderLeft
                      >
                        <h2>Propriedade e Conhecimento</h2>
                        <SingleTraitContainer isMobile={isMobileVersion}>
                          <strong>Tipo:</strong>
                          <span>{getLocTypePT(selectedLocation.type)}</span>
                        </SingleTraitContainer>
                        <SingleTraitContainer isMobile={isMobileVersion}>
                          <strong>Propriedade:</strong>
                          <span>
                            {getLocPropertyPT(selectedLocation.property)}
                          </span>
                        </SingleTraitContainer>
                        {selectedLocation.responsible_char && (
                          <SingleTraitContainer isMobile={isMobileVersion}>
                            <strong>Responsável:</strong>
                            <span>
                              {getLocPropertyPT(
                                selectedLocation.responsible_char.name,
                              )}
                            </span>
                          </SingleTraitContainer>
                        )}
                        {selectedLocation.creature_type !== '' && (
                          <SingleTraitContainer isMobile={isMobileVersion}>
                            <strong>Conhecido pelos:</strong>
                            <span>{selectedLocation.creature_type}</span>
                          </SingleTraitContainer>
                        )}
                        {selectedLocation.clan !== '' && (
                          <SingleTraitContainer isMobile={isMobileVersion}>
                            <strong>Conhecido pelo clã:</strong>
                            <span>{selectedLocation.clan}</span>
                          </SingleTraitContainer>
                        )}
                        {selectedLocation.sect !== '' && (
                          <SingleTraitContainer isMobile={isMobileVersion}>
                            <strong>Conhecido pelo secto:</strong>
                            <span>{selectedLocation.sect}</span>
                          </SingleTraitContainer>
                        )}
                      </DetailsContainer>
                    </DoubleDetailsContainer>
                  )}

                  <DetailsContainer isMobile={isMobileVersion} borderTop>
                    <h2>Addons</h2>
                    {user.storyteller && (
                      <SelectContainer isMobile={isMobileVersion}>
                        <strong>Adicionar Addon:</strong>
                        <div>
                          <Select
                            name="addon"
                            id="addon"
                            value={selectedAddon ? selectedAddon.name : ''}
                            onChange={handleSelectedAddonChange}
                            isMobile={isMobileVersion}
                          >
                            <option value="">Addon:</option>
                            {availableAddonsList.map(addon => (
                              <option
                                key={`Select-${addon.name}`}
                                value={addon.name}
                              >
                                {addon.name}
                              </option>
                            ))}
                          </Select>
                          <AddButton
                            title="Adicionar Addon"
                            onClick={handleAddAddonToLocation}
                            disabled={saving}
                          >
                            {saving ? <FaSpinner /> : <FiPlus />}
                          </AddButton>
                        </div>
                      </SelectContainer>
                    )}
                  </DetailsContainer>

                  {locationAddonList.length > 0 ? (
                    <>
                      <DetailsContainer isMobile={isMobileVersion} borderTop>
                        <h2>Addons da Propriedade</h2>
                      </DetailsContainer>

                      {isMobileVersion || locationAddonList.length === 1 ? (
                        <DetailsContainer isMobile={isMobileVersion}>
                          {locationAddonList.map(addon => (
                            <AddonDiv key={`Single-${addon.addon_name}`}>
                              {buildAddonCard(addon)}
                            </AddonDiv>
                          ))}
                        </DetailsContainer>
                      ) : (
                        <DoubleDetailsContainer>
                          <DetailsContainer isMobile={isMobileVersion}>
                            {locationAddonList
                              .filter((_, index) => (index + 1) % 2 !== 0)
                              .map(addon => (
                                <AddonDiv key={`Odd-${addon.addon_name}`}>
                                  {buildAddonCard(addon)}
                                </AddonDiv>
                              ))}
                          </DetailsContainer>

                          <DetailsContainer
                            isMobile={isMobileVersion}
                            borderLeft
                          >
                            {locationAddonList
                              .filter((_, index) => (index + 1) % 2 === 0)
                              .map(addon => (
                                <AddonDiv key={`Pair-${addon.addon_name}`}>
                                  {buildAddonCard(addon)}
                                </AddonDiv>
                              ))}
                          </DetailsContainer>
                        </DoubleDetailsContainer>
                      )}
                    </>
                  ) : (
                    <DetailsContainer isMobile={isMobileVersion} borderTop>
                      <h2>Esta propriedade não possuí addons</h2>
                    </DetailsContainer>
                  )}
                </LocationContainer>
              )}

              <GoBackButton onClick={handleGoBack} title="Retornar">
                <FiArrowLeft />
              </GoBackButton>
            </LocationDetailsContainer>
          </>
        )}
      </Content>
    </Container>
  );
};

export default LocationDetails;
