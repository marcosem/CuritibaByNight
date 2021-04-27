/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect, HTMLAttributes } from 'react';

import { GiDrop, GiPlainCircle } from 'react-icons/gi';
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

/*
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import { useModalBox } from '../../hooks/modalBox';
import { useSelection } from '../../hooks/selection';
*/

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
  levelArray: ILevel[];
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
  const [showTraits, setShowTraits] = useState<boolean>(false);
  const { isMobileVersion } = useMobile();
  /*
  const history = useHistory();
  const { user, char, signOut } = useAuth();
  const { setChar } = useSelection();

  const [lastChar, setLastChar] = useState<ICharacter>();
  const { showModal } = useModalBox();
  */

  const loadTraits = useCallback(async () => {
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

          const levelArray: ILevel[] = [];
          while (traitLevel > 0) {
            const level: ILevel = {
              id: `${trait.trait}:${traitLevel}`,
              enabled: traitLevel === 1,
              level: traitLevel,
              status: 'full',
            };

            levelArray.push(level);
            traitLevel -= 1;
          }

          const newTrait = trait;
          newTrait.levelArray = levelArray;

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
  }, [addToast, myChar]);

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
                <strong>{`${trait.trait}:`}</strong>
                <span>{trait.level}</span>
                {trait.level > 0 &&
                  trait.trait !== 'Personal Masquerade' &&
                  trait.trait !== 'Rank' && (
                    <>
                      {trait.levelArray && (
                        <TraitsList key={trait.levelArray[0].id}>
                          {trait.levelArray.map(level => (
                            <TraitButton
                              type="button"
                              id={level.id}
                              key={level.id}
                              disabled={!level.enabled}
                              title={`${trait.trait}: ${level.level}`}
                              traitColor={
                                trait.trait === 'Blood' ? 'red' : 'black'
                              }
                              isMobile={isMobileVersion}
                            >
                              {trait.trait === 'Blood' ? (
                                <>{level.status === 'full' ? <GiDrop /> : ''}</>
                              ) : (
                                <GiPlainCircle />
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
    [isMobileVersion],
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
                <span>{trait.level}</span>
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
                              title={`${trait.trait}: ${level.level}`}
                              traitColor="black"
                              isMobile={isMobileVersion}
                            >
                              <GiPlainCircle />
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
    [isMobileVersion],
  );

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
                            <span>{trait.level}</span>
                            <TraitsList key={`List:${trait.trait}`}>
                              {trait.levelArray.map(level => (
                                <TraitButton
                                  type="button"
                                  id={level.id}
                                  key={level.id}
                                  disabled={!level.enabled}
                                  title={`${trait.trait}: ${level.level}`}
                                  traitColor="black"
                                  isMobile={isMobileVersion}
                                >
                                  <GiPlainCircle />
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
                                title={`${trait.trait}: ${level.level}`}
                                traitColor="black"
                                isMobile={isMobileVersion}
                              >
                                <GiPlainCircle />
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
                            title={`${trait.trait}: ${level.level}`}
                            traitColor="black"
                            isMobile={isMobileVersion}
                          >
                            <GiPlainCircle />
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
                            <span>{trait.level}</span>
                            <TraitsList key={`List:${trait.trait}`}>
                              {trait.levelArray.map(level => (
                                <TraitButton
                                  type="button"
                                  id={level.id}
                                  key={level.id}
                                  disabled={!level.enabled}
                                  title={`${trait.trait}: ${level.level}`}
                                  traitColor="black"
                                  isMobile={isMobileVersion}
                                >
                                  <GiPlainCircle />
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
                                title={`${trait.trait}: ${level.level}`}
                                traitColor="black"
                                isMobile={isMobileVersion}
                              >
                                <GiPlainCircle />
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
                            title={`${trait.trait}: ${level.level}`}
                            traitColor="black"
                            isMobile={isMobileVersion}
                          >
                            <GiPlainCircle />
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
                        title={`${trait.trait}: ${level.level}`}
                        traitColor="black"
                        isMobile={isMobileVersion}
                      >
                        <GiPlainCircle />
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
                            title={`${trait.trait}: ${level.level}`}
                            traitColor="black"
                            isMobile={isMobileVersion}
                          >
                            <GiPlainCircle />
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
                            title={`${trait.trait}: ${level.level}`}
                            traitColor="black"
                            isMobile={isMobileVersion}
                          >
                            <GiPlainCircle />
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
                            title={`${trait.trait}: ${level.level}`}
                            traitColor="black"
                            isMobile={isMobileVersion}
                          >
                            <GiPlainCircle />
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
                            title={`${trait.trait}: ${level.level}`}
                            traitColor="black"
                            isMobile={isMobileVersion}
                          >
                            <GiPlainCircle />
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
