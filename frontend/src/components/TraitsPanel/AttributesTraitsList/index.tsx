/* eslint-disable camelcase */
import React, {
  useEffect,
  useState,
  useCallback,
  HTMLAttributes,
  Fragment,
  MouseEvent,
} from 'react';

import { GiPlainCircle, GiCancel } from 'react-icons/gi';

import {
  TraitContainer,
  TraitsRow,
  AttributeContainer,
  TraitsListRow,
  TraitButton,
} from '../styles';

import { useMobile } from '../../../hooks/mobile';

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

type ITraitsProps = HTMLAttributes<HTMLDivElement> & {
  traits: ITrait[];
  handleTraitClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

const AttributesTraitsList: React.FC<ITraitsProps> = ({
  traits,
  handleTraitClick,
}) => {
  const [attributesLevels, setAttributeLevels] = useState([] as any[][]);

  const { isMobileVersion } = useMobile();

  const parseTraits = useCallback((myTraits: ITrait[]) => {
    const newAttributesLevels: any[][] = [];

    for (let i = 0; i < myTraits.length; i += 1) {
      let levelsCount = 0;
      const levelArraySize = myTraits[i].levelArray.length;
      let levelsListBlock: ILevel[] = [];
      let traitLevelsList = [];

      while (levelsCount < levelArraySize) {
        const level = myTraits[i].levelArray[levelsCount];

        if ((levelsCount + 1) % 5 !== 0) {
          levelsListBlock.push(level);
        } else {
          levelsListBlock.push(level);
          const oldLevelsListBlock = levelsListBlock;
          traitLevelsList.push(oldLevelsListBlock);
          levelsListBlock = [];
        }

        if (levelsCount === levelArraySize - 1 && levelsListBlock.length > 0) {
          traitLevelsList.push(levelsListBlock);
        }

        levelsCount += 1;
      }

      newAttributesLevels.push(traitLevelsList);
      traitLevelsList = [];
    }

    setAttributeLevels(newAttributesLevels);
  }, []);

  useEffect(() => {
    if (traits.length === 3) {
      parseTraits(traits);
    }
  }, [parseTraits, traits]);

  return (
    <Fragment key="attributes">
      {traits.length !== 3 || attributesLevels.length !== traits.length ? (
        <TraitContainer isMobile={isMobileVersion}>
          <strong>Nenhum</strong>
        </TraitContainer>
      ) : (
        <TraitsRow>
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
      )}
    </Fragment>
  );
};

export default AttributesTraitsList;
