/* eslint-disable camelcase */
import React, {
  useState,
  useCallback,
  useEffect,
  HTMLAttributes,
  MouseEvent,
} from 'react';

import {
  GiWaterDrop,
  GiPlainCircle,
  GiHearts,
  GiHeartMinus,
  GiCancel,
  GiPrettyFangs,
} from 'react-icons/gi';
import api from '../../services/api';

import {
  Container,
  TypeContainer,
  DoubleTypeContainer,
  TraitsRow,
  TraitContainer,
  VirtuesContainer,
  SingleTraitContainer,
  AttributeContainer,
  TraitsListRow,
  TraitsList,
  SingleTraitsList,
  TraitButton,
} from './styles';

import ICharacter from '../CharacterList/ICharacter';
import Loading from '../Loading';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';
import { useAuth } from '../../hooks/auth';
import { useSocket } from '../../hooks/socket';

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
}

interface ITraitsList {
  creature: ITrait[];
  virtues: ITrait[];
  attributes: ITrait[];
  abilities: ITrait[];
  backgrounds: ITrait[];
  influences: ITrait[];
  health: ITrait[];
}

type IPanelProps = HTMLAttributes<HTMLDivElement> & {
  myChar: ICharacter;
};

const TraitsPanel: React.FC<IPanelProps> = ({ myChar }) => {
  const [traitsList, setTraitsList] = useState<ITraitsList>({
    creature: [],
    virtues: [],
    attributes: [],
    abilities: [],
    backgrounds: [],
    influences: [],
    health: [],
  } as ITraitsList);
  const [typeList, setTypeList] = useState<string[]>([]);
  const { addToast } = useToast();
  const [isBusy, setBusy] = useState(true);
  const { isMobileVersion } = useMobile();
  const { user } = useAuth();
  const {
    isConnected,
    updatedTrait,
    reloadCharTraits,
    notifyTraitUpdate,
    clearUpdatedTrait,
    clearReloadTraits,
  } = useSocket();

  const loadTraits = useCallback(async () => {
    clearUpdatedTrait();
    clearReloadTraits();

    if (myChar === undefined) {
      return;
    }

    setBusy(true);

    try {
      await api.get(`/character/traits/${myChar.id}`).then(response => {
        const res: ITrait[] = response.data;
        const traitTypeList: string[] = [];
        const newTraitsList: ITraitsList = {
          creature: [],
          virtues: [],
          attributes: [],
          abilities: [],
          backgrounds: [],
          influences: [],
          health: [],
        } as ITraitsList;

        res.forEach(trait => {
          const traitType = trait.type;

          if (traitTypeList.indexOf(traitType) === -1) {
            traitTypeList.push(traitType);
          }

          let traitLevel = Number(trait.level);

          const tempLevels = trait.level_temp
            ? trait.level_temp.split('|')
            : [];
          const levelArray: ILevel[] = [];

          if (tempLevels.length === traitLevel && trait.level_temp !== null) {
            tempLevels.reverse();

            let enableNext = false;
            while (traitLevel > 0) {
              const status = tempLevels[traitLevel - 1];
              let enabled = false;

              if (user.storyteller) {
                if (trait.type === 'health') {
                  enabled = true;
                } else if (status === 'full') {
                  if (traitLevel === 1) {
                    enabled = true;
                    enableNext = false;
                  } else {
                    const nextStatus = tempLevels[traitLevel - 2];
                    if (nextStatus !== 'full') {
                      enabled = true;
                      enableNext = true;
                    } else {
                      enableNext = false;
                    }
                  }
                } else if (enableNext) {
                  enabled = true;
                  enableNext = false;
                } else if (traitLevel === tempLevels.length) {
                  enabled = true;
                  enableNext = false;
                }
              }

              const level: ILevel = {
                id: `${trait.type}|${trait.trait}|${traitLevel}`,
                enabled,
                level: traitLevel,
                status,
              };

              levelArray.push(level);
              traitLevel -= 1;
            }
          } else {
            while (traitLevel > 0) {
              const level: ILevel = {
                id: `${trait.type}|${trait.trait}|${traitLevel}`,
                enabled:
                  user.storyteller &&
                  (trait.type === 'health' ? true : traitLevel === 1),

                level: traitLevel,
                status: 'full',
              };

              levelArray.push(level);
              traitLevel -= 1;
            }
          }

          const newTrait = trait;
          newTrait.levelArray = levelArray;

          // Initial point for temporary level
          let tempLevelCount = 0;
          newTrait.levelArray.forEach(level => {
            if (level.status === 'full') tempLevelCount += 1;
          });

          newTrait.levelTemp = tempLevelCount;

          switch (traitType) {
            case 'creature':
              switch (newTrait.trait) {
                case 'Personal Masquerade':
                  newTrait.index = [0, 0];
                  break;
                case 'Blood':
                  newTrait.index = [1, 0];
                  break;
                case 'True Faith':
                  newTrait.index = [2, 0];
                  break;
                case 'Pathos':
                  newTrait.index = [3, 1];
                  break;
                case 'Corpus':
                  newTrait.index = [3, 2];
                  break;
                case 'Arete':
                  newTrait.index = [4, 1];
                  break;
                case 'Quintessence':
                  newTrait.index = [4, 2];
                  break;
                case 'Paradox':
                  newTrait.index = [5, 0];
                  break;
                case 'Rage':
                  newTrait.index = [6, 1];
                  break;
                case 'Gnosis':
                  newTrait.index = [6, 2];
                  break;
                case 'Rank':
                  newTrait.index = [6, 3];
                  break;

                default:
                  newTrait.index = [-1, -1];
              }

              newTraitsList.creature.push(newTrait);
              break;
            case 'virtues':
              switch (newTrait.trait) {
                case 'Willpower':
                  newTrait.index = [0, 0];
                  break;
                case 'Courage':
                  newTrait.index = [2, 2];
                  break;
                case 'True Faith':
                  newTrait.index = [3, 0];
                  break;
                default:
                  if (newTrait.trait.indexOf('Morality') >= 0) {
                    newTrait.index = [1, 1];
                  } else if (newTrait.trait.indexOf('Self-Control') >= 0) {
                    newTrait.index = [1, 2];
                  } else if (newTrait.trait.indexOf('Conscience') >= 0) {
                    newTrait.index = [2, 1];
                  } else {
                    newTrait.index = [-1, -1];
                  }
              }

              newTraitsList.virtues.push(newTrait);
              break;
            case 'attributes':
              switch (newTrait.trait) {
                case 'Physical':
                  newTrait.index = [0, 1];
                  break;
                case 'Social':
                  newTrait.index = [0, 2];
                  break;
                case 'Mental':
                  newTrait.index = [0, 3];
                  break;
                default:
                  newTrait.index = [-1, -1];
              }

              newTraitsList.attributes.push(newTrait);
              break;
            case 'abilities':
              newTrait.index = [-1, -1];
              newTraitsList.abilities.push(newTrait);
              break;
            case 'backgrounds':
              newTrait.index = [-1, -1];
              newTraitsList.backgrounds.push(newTrait);
              break;
            case 'influences':
              newTrait.index = [-1, -1];
              newTraitsList.influences.push(newTrait);
              break;
            case 'health':
              switch (trait.trait) {
                case 'Healthy':
                  newTrait.index = [0, 0];
                  break;
                case 'Bruised':
                  newTrait.index = [1, 0];
                  break;
                case 'Wounded':
                  newTrait.index = [2, 0];
                  break;
                case 'Incapacited':
                  newTrait.index = [3, 0];
                  break;
                case 'Torpor':
                case 'Mortally Wounded':
                  newTrait.index = [4, 0];
                  break;
                default:
                  newTrait.index = [-1, -1];
              }
              newTraitsList.health.push(newTrait);
              break;
            default:
              break;
          }
        });

        if (traitTypeList.length > 0) {
          newTraitsList.creature.sort((traitA: ITrait, traitB: ITrait) => {
            if (traitA.index[0] < traitB.index[0]) return -1;
            if (traitA.index[0] > traitB.index[0]) return 1;

            if (traitA.index[0] === traitB.index[0]) {
              if (traitA.index[1] < traitB.index[1]) return -1;
              if (traitA.index[1] > traitB.index[1]) return 1;
            }
            return 0;
          });

          newTraitsList.virtues.sort((traitA: ITrait, traitB: ITrait) => {
            if (traitA.index < traitB.index) return -1;
            if (traitA.index > traitB.index) return 1;

            if (traitA.index[0] === traitB.index[0]) {
              if (traitA.index[1] < traitB.index[1]) return -1;
              if (traitA.index[1] > traitB.index[1]) return 1;
            }

            return 0;
          });

          newTraitsList.attributes.sort((traitA: ITrait, traitB: ITrait) => {
            if (traitA.index < traitB.index) return -1;
            if (traitA.index > traitB.index) return 1;

            if (traitA.index[0] === traitB.index[0]) {
              if (traitA.index[1] < traitB.index[1]) return -1;
              if (traitA.index[1] > traitB.index[1]) return 1;
            }

            return 0;
          });

          newTraitsList.health.sort((traitA: ITrait, traitB: ITrait) => {
            if (traitA.index < traitB.index) return -1;
            if (traitA.index > traitB.index) return 1;

            return 0;
          });

          setTypeList(traitTypeList);
          setTraitsList(newTraitsList);
        }
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (error.response.status !== 401) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar traits do personagens',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [
    addToast,
    clearReloadTraits,
    clearUpdatedTrait,
    myChar,
    user.storyteller,
  ]);

  const updateTraits = useCallback(
    async (trait: ITrait) => {
      try {
        const levelArray = trait.levelArray.map(level => level.status);
        const levelArrayString = levelArray.join('|');

        await api.patch('/character/traits/update', {
          character_id: trait.character_id,
          trait_id: trait.id,
          trait_name: trait.trait,
          trait_type: trait.type,
          trait_level: trait.level,
          trait_level_temp: levelArrayString,
        });

        if (isConnected) {
          notifyTraitUpdate(trait);
        }
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Erro ao tentar atualizar Trait de personagens',
          description: error.response.data.message
            ? `Erro: ${error.response.data.message}`
            : 'Erro ao tentat atualizar Trait de personagem, tente novamente.',
        });
      }
    },
    [addToast, isConnected, notifyTraitUpdate],
  );

  const handleTraitClick = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (!user.storyteller) return;

      const traitLevelId = e.currentTarget.id;
      const traitInfo = traitLevelId.split('|');

      if (traitInfo.length !== 3) {
        addToast({
          type: 'error',
          title: 'Trait inválido',
          description:
            "Este Trait possuí um caracter inválido: '|' e deve ser corrigido na ficha original.",
        });
        return;
      }

      let traits: ITrait[];

      switch (traitInfo[0]) {
        case 'creature':
          traits = traitsList.creature;
          break;
        case 'virtues':
          traits = traitsList.virtues;
          break;
        case 'attributes':
          traits = traitsList.attributes;
          break;
        case 'abilities':
          traits = traitsList.abilities;
          break;
        case 'backgrounds':
          traits = traitsList.backgrounds;
          break;
        case 'influences':
          traits = traitsList.influences;
          break;
        case 'health':
          traits = traitsList.health;
          break;
        default:
          addToast({
            type: 'error',
            title: 'Trait inválido',
            description: `Trait de tipo inválido: '${traitInfo[0]}', verifique se a ficha está correta.`,
          });
          return;
      }

      const trait: ITrait | undefined = traits.find(
        (myTrait: ITrait) => myTrait.trait === traitInfo[1],
      );

      if (!trait) {
        addToast({
          type: 'error',
          title: 'Trait inválido',
          description: `Trait inválido: '${traitInfo[1]}', verifique se a ficha está correta.`,
        });
        return;
      }

      const { levelArray } = trait;
      const levelIndex = levelArray.findIndex(
        myLevel => myLevel.id === traitLevelId,
      );

      const level = levelIndex >= 0 ? levelArray[levelIndex] : undefined;

      if (levelIndex === -1 || !level) {
        addToast({
          type: 'error',
          title: 'Trait Level inválido',
          description: `Trait Level inválido: '${traitLevelId}', verifique se a ficha está correta.`,
        });
        return;
      }

      // let healthTrait: ITrait | undefined;
      // let healthTraitLevels: ILevel[] | undefined;
      if (trait.type === 'health') {
        switch (levelArray[levelIndex].status) {
          case 'full':
            level.status = 'bashing';
            trait.levelTemp -= 1;
            break;
          case 'bashing':
            level.status = 'lethal';
            break;
          case 'lethal':
            level.status = 'aggravated';
            break;
          case 'aggravated':
            level.status = 'full';
            trait.levelTemp += 1;
            break;
          default:
        }
      } else if (levelArray[levelIndex].status === 'full') {
        levelArray[levelIndex].status = 'empty';

        if (levelIndex > 0) {
          levelArray[levelIndex - 1].enabled = true;
        }

        if (levelIndex < levelArray.length - 1) {
          levelArray[levelIndex + 1].enabled = false;
        }

        trait.levelTemp -= 1;
      } else if (
        (trait.type === 'virtues' || trait.type === 'attributes') &&
        levelArray[levelIndex].status === 'empty'
      ) {
        level.status = 'permanent';
      } else {
        level.status = 'full';
        if (levelIndex > 0) {
          levelArray[levelIndex - 1].enabled = false;
        }

        if (levelIndex < levelArray.length - 1) {
          levelArray[levelIndex + 1].enabled = true;
        }

        trait.levelTemp += 1;
      }

      const newLevelArray = [...levelArray];
      trait.levelArray = newLevelArray;

      const newTypeTraitsList = traits.map(myTrait =>
        myTrait.id === trait.id ? trait : myTrait,
      );

      // Create a new object to force the rendering
      const newTraitsList = JSON.parse(JSON.stringify(traitsList));

      newTraitsList[traitInfo[0]] = [...newTypeTraitsList];
      setTraitsList(newTraitsList);

      // Update Traits to DB
      updateTraits(trait);
    },
    [addToast, traitsList, updateTraits, user.storyteller],
  );

  const buildOrdinaryTraitsList = useCallback(
    (traits: ITrait[], type: string): JSX.Element[] => {
      if (traits.length === 0) {
        return [
          <TraitContainer key={type} isMobile={isMobileVersion}>
            <strong>Nenhum</strong>
          </TraitContainer>,
        ];
      }

      let traitsCount = 0;
      let lastTrait: ITrait = traits[0];
      let traitsListBlock: ITrait[] = [];
      const blockList = [];

      while (traitsCount < traits.length) {
        const trait = traits[traitsCount];

        if (lastTrait.index[0] === trait.index[0]) {
          traitsListBlock.push(trait);
        } else {
          const oldTraitsListBlock = traitsListBlock;
          blockList.push(oldTraitsListBlock);
          traitsListBlock = [];

          traitsListBlock.push(trait);
        }

        if (traitsCount === traits.length - 1 && traitsListBlock.length > 0) {
          blockList.push(traitsListBlock);
        }

        traitsCount += 1;
        lastTrait = trait;
      }

      const rows = [];
      let blocksCount = 0;
      while (blocksCount < blockList.length) {
        const traitsRow = blockList[blocksCount];
        const numTraits = traitsRow.length;

        rows.push(
          <TraitsRow key={`${type}:${blocksCount}`}>
            {traitsRow.map((trait, index) => (
              <TraitContainer
                key={trait.id}
                alignment={
                  numTraits === 1
                    ? 'center'
                    : `${
                        index === 1
                          ? 'left'
                          : `${
                              numTraits === 2
                                ? 'right'
                                : `${index === 2 ? 'center' : 'right'}`
                            }`
                      }`
                }
                isMobile={isMobileVersion}
              >
                <strong>
                  {`${
                    trait.trait === 'Personal Masquerade'
                      ? 'Quebra de Máscara Pessoal'
                      : `${trait.trait}`
                  }:`}
                </strong>
                <span>
                  {`${
                    trait.trait === 'Blood'
                      ? `${trait.levelTemp}/${trait.level}`
                      : `${
                          trait.trait === 'Personal Masquerade'
                            ? `${trait.levelTemp}`
                            : `${trait.level}`
                        }`
                  }`}
                </span>
                {trait.level > 0 && trait.trait !== 'Rank' && (
                  <>
                    {trait.levelArray && (
                      <TraitsList key={trait.levelArray[0].id}>
                        {trait.levelArray.map(level => (
                          <TraitButton
                            type="button"
                            id={level.id}
                            key={level.id}
                            disabled={!level.enabled}
                            title={`${
                              level.enabled
                                ? `${
                                    level.status === 'full'
                                      ? `Remover [${trait.trait} Trait]`
                                      : `Adicionar [${trait.trait} Trait]`
                                  }`
                                : `${trait.trait} x${trait.levelTemp}`
                            }`}
                            traitColor={
                              trait.trait === 'Blood' ||
                              trait.trait === 'Personal Masquerade'
                                ? 'red'
                                : 'black'
                            }
                            isMobile={isMobileVersion}
                            onClick={handleTraitClick}
                          >
                            {level.status === 'full' ? (
                              <>
                                {trait.trait === 'Blood' ? (
                                  <GiWaterDrop />
                                ) : (
                                  <>
                                    {trait.trait === 'Personal Masquerade' ? (
                                      <GiPrettyFangs />
                                    ) : (
                                      <GiPlainCircle />
                                    )}
                                  </>
                                )}
                              </>
                            ) : (
                              ''
                            )}
                          </TraitButton>
                        ))}
                      </TraitsList>
                    )}
                  </>
                )}
              </TraitContainer>
            ))}
          </TraitsRow>,
        );

        blocksCount += 1;
      }

      return rows;
    },
    [handleTraitClick, isMobileVersion],
  );

  const buildAttributesTraitsList = useCallback(
    (traits: ITrait[]): JSX.Element => {
      if (traits.length !== 3) {
        return (
          <TraitContainer key="attributes" isMobile={isMobileVersion}>
            <strong>Nenhum</strong>
          </TraitContainer>
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const attributesLevels: any[][] = [];

      for (let i = 0; i < traits.length; i += 1) {
        let levelsCount = 0;
        const levelArraySize = traits[i].levelArray.length;
        let levelsListBlock: ILevel[] = [];
        let traitLevelsList = [];

        while (levelsCount < levelArraySize) {
          const level = traits[i].levelArray[levelsCount];

          if ((levelsCount + 1) % 5 !== 0) {
            levelsListBlock.push(level);
          } else {
            levelsListBlock.push(level);
            const oldLevelsListBlock = levelsListBlock;
            traitLevelsList.push(oldLevelsListBlock);
            levelsListBlock = [];
          }

          if (
            levelsCount === levelArraySize - 1 &&
            levelsListBlock.length > 0
          ) {
            traitLevelsList.push(levelsListBlock);
          }

          levelsCount += 1;
        }

        attributesLevels.push(traitLevelsList);
        traitLevelsList = [];
      }

      return (
        <TraitsRow key="attributes">
          {traits.map((trait, index) => (
            <AttributeContainer
              key={trait.id}
              alignment={
                index === 0 ? 'left' : `${index === 1 ? 'center' : 'right'}`
              }
              isMobile={isMobileVersion}
            >
              <div key={trait.trait}>
                <strong>{`${trait.trait}:`}</strong>
                <span>{`${trait.levelTemp}/${trait.level}`}</span>
              </div>

              {trait.level > 0 && (
                <>
                  {attributesLevels[index].length > 0 && (
                    <>
                      {attributesLevels[index].map((levelBlock: ILevel[]) => (
                        <TraitsListRow
                          key={`${trait.trait}:${levelBlock[0].id}`}
                        >
                          {levelBlock.map((level: ILevel) => (
                            <TraitButton
                              type="button"
                              id={level.id}
                              key={level.id}
                              disabled={!level.enabled}
                              title={`${
                                level.enabled
                                  ? `${
                                      level.status === 'full'
                                        ? `Remover [${trait.trait} Trait]`
                                        : `${
                                            level.status === 'empty'
                                              ? `Remover [${trait.trait} Trait] Permanente`
                                              : `Adicionar [${trait.trait} Trait]`
                                          }`
                                    }`
                                  : `${trait.trait} x${trait.levelTemp}`
                              }`}
                              traitColor="black"
                              isMobile={isMobileVersion}
                              onClick={handleTraitClick}
                            >
                              {level.status === 'full' ? (
                                <GiPlainCircle />
                              ) : (
                                <>
                                  {level.status === 'permanent' ? (
                                    <GiCancel />
                                  ) : (
                                    ''
                                  )}
                                </>
                              )}
                            </TraitButton>
                          ))}
                        </TraitsListRow>
                      ))}
                    </>
                  )}
                </>
              )}
            </AttributeContainer>
          ))}
        </TraitsRow>
      );
    },
    [handleTraitClick, isMobileVersion],
  );

  useEffect(() => {
    if (updatedTrait.id) {
      const myUpdatedTrait: ITrait = JSON.parse(JSON.stringify(updatedTrait));
      clearUpdatedTrait();

      if (myUpdatedTrait.character_id !== myChar.id) {
        return;
      }

      const updatedLevels = myUpdatedTrait.levelArray.map(myLevel => {
        const newLevel = myLevel;
        newLevel.enabled = user.storyteller && newLevel.enabled;
        return newLevel;
      });

      myUpdatedTrait.levelArray = updatedLevels;

      let typeTraits: ITrait[] = [];
      switch (myUpdatedTrait.type) {
        case 'creature':
          typeTraits = traitsList.creature;
          break;
        case 'virtues':
          typeTraits = traitsList.virtues;
          break;
        case 'attributes':
          typeTraits = traitsList.attributes;
          break;
        case 'abilities':
          typeTraits = traitsList.abilities;
          break;
        case 'backgrounds':
          typeTraits = traitsList.backgrounds;
          break;
        case 'influences':
          typeTraits = traitsList.influences;
          break;
        case 'health':
          typeTraits = traitsList.health;
          break;
        default:
      }

      if (typeTraits.length > 0) {
        const updatedTraits = typeTraits.map(myTrait =>
          myTrait.id === myUpdatedTrait.id ? myUpdatedTrait : myTrait,
        );

        const newTraitsList = JSON.parse(JSON.stringify(traitsList));
        switch (updatedTrait.type) {
          case 'creature':
            newTraitsList.creature = updatedTraits;
            break;
          case 'virtues':
            newTraitsList.virtues = updatedTraits;
            break;
          case 'attributes':
            newTraitsList.attributes = updatedTraits;
            break;
          case 'abilities':
            newTraitsList.abilities = updatedTraits;
            break;
          case 'backgrounds':
            newTraitsList.backgrounds = updatedTraits;
            break;
          case 'influences':
            newTraitsList.influences = updatedTraits;
            break;
          case 'health':
            newTraitsList.health = updatedTraits;
            break;
          default:
        }

        setTraitsList(newTraitsList);
      }
    }
  }, [
    myChar.id,
    clearUpdatedTrait,
    traitsList,
    updatedTrait,
    user.storyteller,
  ]);

  useEffect(() => {
    if (reloadCharTraits === '') return;

    if (reloadCharTraits === myChar.id) {
      // loadTraits executes clearRealoadTraits()
      loadTraits();
    } else {
      clearReloadTraits();
    }
  }, [clearReloadTraits, loadTraits, myChar.id, reloadCharTraits]);

  useEffect(() => {
    loadTraits();
  }, [loadTraits, myChar]);

  return (
    <Container>
      {isBusy ? (
        <Loading />
      ) : (
        <>
          <TypeContainer isMobile={isMobileVersion}>
            {typeList.indexOf('creature') >= 0 ? (
              <>
                <h1>Características Comuns:</h1>
                {buildOrdinaryTraitsList(traitsList.creature, 'creature')}
              </>
            ) : (
              <h1>Ficha não atualizada!</h1>
            )}
          </TypeContainer>
          {isMobileVersion ? (
            <>
              {typeList.indexOf('virtues') >= 0 && (
                <TypeContainer
                  borderTop
                  key="virtues"
                  isMobile={isMobileVersion}
                >
                  <h1>Virtudes:</h1>
                  {traitsList.virtues.map((trait: ITrait) => (
                    <VirtuesContainer key={trait.id}>
                      {trait.trait === 'Willpower' ? (
                        <TraitsRow key={`Row:${trait.trait}`}>
                          <TraitContainer
                            alignment="left"
                            key={`Container:${trait.trait}`}
                            isMobile={isMobileVersion}
                          >
                            <strong>{`${trait.trait}:`}</strong>
                            <span>{`${trait.levelTemp}/${trait.level}`}</span>
                            <TraitsList key={`List:${trait.trait}`}>
                              {trait.levelArray.map(level => (
                                <TraitButton
                                  type="button"
                                  id={level.id}
                                  key={level.id}
                                  disabled={!level.enabled}
                                  title={`${
                                    level.enabled
                                      ? `${
                                          level.status === 'full'
                                            ? `Remover [${trait.trait} Trait]`
                                            : `${
                                                level.status === 'empty'
                                                  ? `Remover [${trait.trait} Trait] Permanente`
                                                  : `Adicionar [${trait.trait} Trait]`
                                              }`
                                        }`
                                      : `${trait.trait} x${trait.levelTemp}`
                                  }`}
                                  traitColor="black"
                                  isMobile={isMobileVersion}
                                  onClick={handleTraitClick}
                                >
                                  {level.status === 'full' ? (
                                    <GiPlainCircle />
                                  ) : (
                                    <>
                                      {level.status === 'permanent' ? (
                                        <GiCancel />
                                      ) : (
                                        ''
                                      )}
                                    </>
                                  )}
                                </TraitButton>
                              ))}
                            </TraitsList>
                          </TraitContainer>
                        </TraitsRow>
                      ) : (
                        <SingleTraitContainer
                          key={`Container:${trait.trait}`}
                          isMobile={isMobileVersion}
                        >
                          <SingleTraitsList
                            key={`List:${trait.trait}`}
                            isMobile={isMobileVersion}
                          >
                            {trait.levelArray.map(level => (
                              <TraitButton
                                type="button"
                                id={level.id}
                                key={level.id}
                                disabled={!level.enabled}
                                title={`${
                                  level.enabled
                                    ? `${
                                        level.status === 'full'
                                          ? `Remover [${trait.trait} Trait]`
                                          : `${
                                              level.status === 'empty'
                                                ? `Remover [${trait.trait} Trait] Permanente`
                                                : `Adicionar [${trait.trait} Trait]`
                                            }`
                                      }`
                                    : `${trait.trait} x${trait.levelTemp}`
                                }`}
                                traitColor="black"
                                isMobile={isMobileVersion}
                                onClick={handleTraitClick}
                              >
                                {level.status === 'full' ? (
                                  <GiPlainCircle />
                                ) : (
                                  <>
                                    {level.status === 'permanent' ? (
                                      <GiCancel />
                                    ) : (
                                      ''
                                    )}
                                  </>
                                )}
                              </TraitButton>
                            ))}
                          </SingleTraitsList>
                          <strong>{`${trait.trait}`}</strong>
                          <span>{`x${trait.level}`}</span>
                        </SingleTraitContainer>
                      )}
                    </VirtuesContainer>
                  ))}
                </TypeContainer>
              )}
              {typeList.indexOf('health') >= 0 && (
                <TypeContainer
                  borderTop
                  key="health"
                  isMobile={isMobileVersion}
                >
                  <h1>Vitalidade:</h1>
                  {traitsList.health.map((trait: ITrait) => (
                    <SingleTraitContainer
                      key={`Container:${trait.trait}`}
                      isMobile={isMobileVersion}
                    >
                      <SingleTraitsList
                        key={`List:${trait.trait}`}
                        isMobile={isMobileVersion}
                      >
                        {trait.levelArray.map(level => (
                          <TraitButton
                            type="button"
                            id={level.id}
                            key={level.id}
                            disabled={!level.enabled}
                            title={`${
                              level.enabled
                                ? `${
                                    level.status === 'full'
                                      ? 'Causar Dano de Contusão'
                                      : `${
                                          level.status === 'bashing'
                                            ? 'Causar Dano Letal'
                                            : `${
                                                level.status === 'lethal'
                                                  ? 'Causar Dano Agravado'
                                                  : 'Curar Dano'
                                              }`
                                        }`
                                  }`
                                : `${
                                    level.status === 'full'
                                      ? 'Sem Dano'
                                      : `${
                                          level.status === 'bashing'
                                            ? 'Dano de Contusão'
                                            : `${
                                                level.status === 'lethal'
                                                  ? 'Dano Letal'
                                                  : 'Dano Agravado'
                                              }`
                                        }`
                                  }`
                            }`}
                            traitColor="red"
                            isMobile={isMobileVersion}
                            onClick={handleTraitClick}
                          >
                            {level.status === 'full' ? (
                              <GiHearts />
                            ) : (
                              <>
                                {level.status === 'bashing' ? (
                                  <GiHeartMinus />
                                ) : (
                                  <>
                                    {level.status === 'lethal' ? (
                                      ''
                                    ) : (
                                      <GiCancel />
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </TraitButton>
                        ))}
                      </SingleTraitsList>
                      <strong>{`${trait.trait}`}</strong>
                      <span>{`x${trait.level}`}</span>
                    </SingleTraitContainer>
                  ))}
                </TypeContainer>
              )}
            </>
          ) : (
            <DoubleTypeContainer key="virtues:health">
              {typeList.indexOf('virtues') >= 0 && (
                <TypeContainer
                  borderTop
                  key="virtues"
                  isMobile={isMobileVersion}
                >
                  <h1>Virtudes:</h1>
                  {traitsList.virtues.map((trait: ITrait) => (
                    <VirtuesContainer key={trait.id}>
                      {trait.trait === 'Willpower' ? (
                        <TraitsRow key={`Row:${trait.trait}`}>
                          <TraitContainer
                            alignment="left"
                            key={`Container:${trait.trait}`}
                            isMobile={isMobileVersion}
                          >
                            <strong>{`${trait.trait}:`}</strong>
                            <span>{`${trait.levelTemp}/${trait.level}`}</span>
                            <TraitsList key={`List:${trait.trait}`}>
                              {trait.levelArray.map(level => (
                                <TraitButton
                                  type="button"
                                  id={level.id}
                                  key={level.id}
                                  disabled={!level.enabled}
                                  title={`${
                                    level.enabled
                                      ? `${
                                          level.status === 'full'
                                            ? `Remover [${trait.trait} Trait]`
                                            : `${
                                                level.status === 'empty'
                                                  ? `Remover [${trait.trait} Trait] Permanente`
                                                  : `Adicionar [${trait.trait} Trait]`
                                              }`
                                        }`
                                      : `${trait.trait} x${trait.levelTemp}`
                                  }`}
                                  traitColor="black"
                                  isMobile={isMobileVersion}
                                  onClick={handleTraitClick}
                                >
                                  {level.status === 'full' ? (
                                    <GiPlainCircle />
                                  ) : (
                                    <>
                                      {level.status === 'permanent' ? (
                                        <GiCancel />
                                      ) : (
                                        ''
                                      )}
                                    </>
                                  )}
                                </TraitButton>
                              ))}
                            </TraitsList>
                          </TraitContainer>
                        </TraitsRow>
                      ) : (
                        <SingleTraitContainer
                          key={`Container:${trait.trait}`}
                          isMobile={isMobileVersion}
                        >
                          <SingleTraitsList
                            key={`List:${trait.trait}`}
                            isMobile={isMobileVersion}
                          >
                            {trait.levelArray.map(level => (
                              <TraitButton
                                type="button"
                                id={level.id}
                                key={level.id}
                                disabled={!level.enabled}
                                title={`${
                                  level.enabled
                                    ? `${
                                        level.status === 'full'
                                          ? `Remover [${trait.trait} Trait]`
                                          : `${
                                              level.status === 'empty'
                                                ? `Remover [${trait.trait} Trait] Permanente`
                                                : `Adicionar [${trait.trait} Trait]`
                                            }`
                                      }`
                                    : `${trait.trait} x${trait.levelTemp}`
                                }`}
                                traitColor="black"
                                isMobile={isMobileVersion}
                                onClick={handleTraitClick}
                              >
                                {level.status === 'full' ? (
                                  <GiPlainCircle />
                                ) : (
                                  <>
                                    {level.status === 'permanent' ? (
                                      <GiCancel />
                                    ) : (
                                      ''
                                    )}
                                  </>
                                )}
                              </TraitButton>
                            ))}
                          </SingleTraitsList>
                          <strong>{`${trait.trait}`}</strong>
                          <span>{`x${trait.level}`}</span>
                        </SingleTraitContainer>
                      )}
                    </VirtuesContainer>
                  ))}
                </TypeContainer>
              )}
              {typeList.indexOf('health') >= 0 && (
                <TypeContainer
                  borderTop
                  borderLeft
                  key="health"
                  isMobile={isMobileVersion}
                >
                  <h1>Vitalidade:</h1>
                  {traitsList.health.map((trait: ITrait) => (
                    <SingleTraitContainer
                      key={`Container:${trait.trait}`}
                      isMobile={isMobileVersion}
                    >
                      <SingleTraitsList
                        key={`List:${trait.trait}`}
                        isMobile={isMobileVersion}
                      >
                        {trait.levelArray.map(level => (
                          <TraitButton
                            type="button"
                            id={level.id}
                            key={level.id}
                            disabled={!level.enabled}
                            title={`${
                              level.enabled
                                ? `${
                                    level.status === 'full'
                                      ? 'Causar Dano de Contusão'
                                      : `${
                                          level.status === 'bashing'
                                            ? 'Causar Dano Letal'
                                            : `${
                                                level.status === 'lethal'
                                                  ? 'Causar Dano Agravado'
                                                  : 'Curar Dano'
                                              }`
                                        }`
                                  }`
                                : `${
                                    level.status === 'full'
                                      ? 'Sem Dano'
                                      : `${
                                          level.status === 'bashing'
                                            ? 'Dano de Contusão'
                                            : `${
                                                level.status === 'lethal'
                                                  ? 'Dano Letal'
                                                  : 'Dano Agravado'
                                              }`
                                        }`
                                  }`
                            }`}
                            traitColor="red"
                            isMobile={isMobileVersion}
                            onClick={handleTraitClick}
                          >
                            {level.status === 'full' ? (
                              <GiHearts />
                            ) : (
                              <>
                                {level.status === 'bashing' ? (
                                  <GiHeartMinus />
                                ) : (
                                  <>
                                    {level.status === 'lethal' ? (
                                      ''
                                    ) : (
                                      <GiCancel />
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </TraitButton>
                        ))}
                      </SingleTraitsList>
                      <strong>{`${trait.trait}`}</strong>
                      <span>{`x${trait.level}`}</span>
                    </SingleTraitContainer>
                  ))}
                </TypeContainer>
              )}
            </DoubleTypeContainer>
          )}
          {typeList.indexOf('attributes') >= 0 && (
            <TypeContainer borderTop isMobile={isMobileVersion}>
              <h1>Atributos:</h1>
              {buildAttributesTraitsList(traitsList.attributes)}
            </TypeContainer>
          )}
          {typeList.indexOf('abilities') >= 0 && (
            <TypeContainer borderTop isMobile={isMobileVersion}>
              <h1>Habilidades:</h1>
              {traitsList.abilities.map((trait: ITrait) => (
                <SingleTraitContainer key={trait.id} isMobile={isMobileVersion}>
                  <SingleTraitsList isMobile={isMobileVersion}>
                    {trait.levelArray.map(level => (
                      <TraitButton
                        type="button"
                        id={level.id}
                        key={level.id}
                        disabled={!level.enabled}
                        title={`${
                          level.enabled
                            ? `${
                                level.status === 'full'
                                  ? `Remover [${trait.trait} Trait]`
                                  : `Adicionar [${trait.trait} Trait]`
                              }`
                            : `${trait.trait} x${trait.levelTemp}`
                        }`}
                        traitColor="black"
                        isMobile={isMobileVersion}
                        onClick={handleTraitClick}
                      >
                        {level.status === 'full' ? <GiPlainCircle /> : ''}
                      </TraitButton>
                    ))}
                  </SingleTraitsList>
                  <strong>{`${trait.trait}`}</strong>
                  <span>{`x${trait.level}`}</span>
                </SingleTraitContainer>
              ))}
            </TypeContainer>
          )}
          {isMobileVersion ? (
            <>
              {typeList.indexOf('backgrounds') >= 0 && (
                <TypeContainer borderTop isMobile={isMobileVersion}>
                  <h1>Antecedentes:</h1>
                  {traitsList.backgrounds.map((trait: ITrait) => (
                    <SingleTraitContainer
                      key={trait.id}
                      isMobile={isMobileVersion}
                    >
                      <SingleTraitsList isMobile={isMobileVersion}>
                        {trait.levelArray.map(level => (
                          <TraitButton
                            type="button"
                            id={level.id}
                            key={level.id}
                            disabled={!level.enabled}
                            title={`${
                              level.enabled
                                ? `${
                                    level.status === 'full'
                                      ? `Remover [${trait.trait} Trait]`
                                      : `Adicionar [${trait.trait} Trait]`
                                  }`
                                : `${trait.trait} x${trait.levelTemp}`
                            }`}
                            traitColor="black"
                            isMobile={isMobileVersion}
                            onClick={handleTraitClick}
                          >
                            {level.status === 'full' ? <GiPlainCircle /> : ''}
                          </TraitButton>
                        ))}
                      </SingleTraitsList>
                      <strong>{`${trait.trait}`}</strong>
                      <span>{`x${trait.level}`}</span>
                    </SingleTraitContainer>
                  ))}
                </TypeContainer>
              )}
              {typeList.indexOf('influences') >= 0 && (
                <TypeContainer borderTop isMobile={isMobileVersion}>
                  <h1>Influências:</h1>
                  {traitsList.influences.map((trait: ITrait) => (
                    <SingleTraitContainer
                      key={trait.id}
                      isMobile={isMobileVersion}
                    >
                      <SingleTraitsList isMobile={isMobileVersion}>
                        {trait.levelArray.map(level => (
                          <TraitButton
                            type="button"
                            id={level.id}
                            key={level.id}
                            disabled={!level.enabled}
                            title={`${
                              level.enabled
                                ? `${
                                    level.status === 'full'
                                      ? `Remover [${trait.trait} Trait]`
                                      : `Adicionar [${trait.trait} Trait]`
                                  }`
                                : `${trait.trait} x${trait.levelTemp}`
                            }`}
                            traitColor="black"
                            isMobile={isMobileVersion}
                            onClick={handleTraitClick}
                          >
                            {level.status === 'full' ? <GiPlainCircle /> : ''}
                          </TraitButton>
                        ))}
                      </SingleTraitsList>
                      <strong>{`${trait.trait}`}</strong>
                      <span>{`x${trait.level}`}</span>
                    </SingleTraitContainer>
                  ))}
                </TypeContainer>
              )}
            </>
          ) : (
            <DoubleTypeContainer>
              {typeList.indexOf('backgrounds') >= 0 && (
                <TypeContainer borderTop isMobile={isMobileVersion}>
                  <h1>Antecedentes:</h1>
                  {traitsList.backgrounds.map((trait: ITrait) => (
                    <SingleTraitContainer
                      key={trait.id}
                      isMobile={isMobileVersion}
                    >
                      <SingleTraitsList isMobile={isMobileVersion}>
                        {trait.levelArray.map(level => (
                          <TraitButton
                            type="button"
                            id={level.id}
                            key={level.id}
                            disabled={!level.enabled}
                            title={`${
                              level.enabled
                                ? `${
                                    level.status === 'full'
                                      ? `Remover [${trait.trait} Trait]`
                                      : `Adicionar [${trait.trait} Trait]`
                                  }`
                                : `${trait.trait} x${trait.levelTemp}`
                            }`}
                            traitColor="black"
                            isMobile={isMobileVersion}
                            onClick={handleTraitClick}
                          >
                            {level.status === 'full' ? <GiPlainCircle /> : ''}
                          </TraitButton>
                        ))}
                      </SingleTraitsList>
                      <strong>{`${trait.trait}`}</strong>
                      <span>{`x${trait.level}`}</span>
                    </SingleTraitContainer>
                  ))}
                </TypeContainer>
              )}
              {typeList.indexOf('influences') >= 0 && (
                <TypeContainer borderTop borderLeft isMobile={isMobileVersion}>
                  <h1>Influências:</h1>
                  {traitsList.influences.map((trait: ITrait) => (
                    <SingleTraitContainer
                      key={trait.id}
                      isMobile={isMobileVersion}
                    >
                      <SingleTraitsList isMobile={isMobileVersion}>
                        {trait.levelArray.map(level => (
                          <TraitButton
                            type="button"
                            id={level.id}
                            key={level.id}
                            disabled={!level.enabled}
                            title={`${
                              level.enabled
                                ? `${
                                    level.status === 'full'
                                      ? `Remover [${trait.trait} Trait]`
                                      : `Adicionar [${trait.trait} Trait]`
                                  }`
                                : `${trait.trait} x${trait.levelTemp}`
                            }`}
                            traitColor="black"
                            isMobile={isMobileVersion}
                            onClick={handleTraitClick}
                          >
                            {level.status === 'full' ? <GiPlainCircle /> : ''}
                          </TraitButton>
                        ))}
                      </SingleTraitsList>
                      <strong>{`${trait.trait}`}</strong>
                      <span>{`x${trait.level}`}</span>
                    </SingleTraitContainer>
                  ))}
                </TypeContainer>
              )}
            </DoubleTypeContainer>
          )}
        </>
      )}
    </Container>
  );
};

export default TraitsPanel;
