/* eslint-disable camelcase */
import React, {
  useEffect,
  useState,
  useCallback,
  HTMLAttributes,
  Fragment,
} from 'react';

import { TraitsRow, NegativeTraitsRow, AttributeContainer } from '../styles';

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

interface INegTraits {
  id: string;
  physical: string;
  social: string;
  mental: string;
}

type INegTraitsProps = HTMLAttributes<HTMLDivElement> & {
  traits: ITrait[];
};

const NegAttributesTraitsList: React.FC<INegTraitsProps> = ({ traits }) => {
  const [negTraits, setNegTraits] = useState([] as INegTraits[]);

  const { isMobileVersion } = useMobile();

  const parseTraits = useCallback((myTraits: ITrait[]) => {
    const physicalTraits = myTraits
      .filter(trait => trait.trait.indexOf('physical:') !== -1)
      .map(trait => {
        const newTrait = { ...trait };
        newTrait.trait = trait.trait.replace('physical:', '');

        return newTrait;
      });

    const socialTraits = myTraits
      .filter(trait => trait.trait.indexOf('social:') !== -1)
      .map(trait => {
        const newTrait = { ...trait };
        newTrait.trait = trait.trait.replace('social:', '');

        return newTrait;
      });

    const mentalTraits = myTraits
      .filter(trait => trait.trait.indexOf('mental:') !== -1)
      .map(trait => {
        const newTrait = { ...trait };
        newTrait.trait = trait.trait.replace('mental:', '');

        return newTrait;
      });

    const largerArray = Math.max(
      physicalTraits.length,
      socialTraits.length,
      mentalTraits.length,
    );

    physicalTraits.length = largerArray;
    socialTraits.length = largerArray;
    mentalTraits.length = largerArray;

    let negTraitsArray: INegTraits[] = [];

    negTraitsArray.length = largerArray;
    negTraitsArray = negTraitsArray.fill({
      id: '',
      physical: '',
      social: '',
      mental: '',
    } as INegTraits);

    negTraitsArray = negTraitsArray.map((_, index) => {
      let newPhysical = '';
      let newSocial = '';
      let newMental = '';

      if (physicalTraits[index]) {
        const trait = physicalTraits[index];
        newPhysical =
          trait.level > 1 ? `${trait.trait} x${trait.level}` : trait.trait;
      }

      if (socialTraits[index]) {
        const trait = socialTraits[index];
        newSocial =
          trait.level > 1 ? `${trait.trait} x${trait.level}` : trait.trait;
      }

      if (mentalTraits[index]) {
        const trait = mentalTraits[index];
        newMental =
          trait.level > 1 ? `${trait.trait} x${trait.level}` : trait.trait;
      }

      const newElem = {
        id: `id-${index}`,
        physical: newPhysical,
        social: newSocial,
        mental: newMental,
      };

      return newElem;
    });

    setNegTraits(negTraitsArray);
  }, []);

  useEffect(() => {
    if (traits.length > 0) {
      parseTraits(traits);
    }
  }, [parseTraits, traits]);

  return (
    <Fragment key="neg_attributes">
      {negTraits.length > 0 && (
        <>
          <TraitsRow>
            <AttributeContainer alignment="left" isMobile={isMobileVersion}>
              <div>
                <strong>Physical</strong>
              </div>
            </AttributeContainer>
            <AttributeContainer alignment="center" isMobile={isMobileVersion}>
              <div>
                <strong>Social</strong>
              </div>
            </AttributeContainer>
            <AttributeContainer alignment="right" isMobile={isMobileVersion}>
              <div>
                <strong>Mental</strong>
              </div>
            </AttributeContainer>
          </TraitsRow>
          {negTraits.map(trait => (
            <NegativeTraitsRow key={`neg_attributes-${trait.id}`}>
              <AttributeContainer alignment="left" isMobile={isMobileVersion}>
                <div>
                  <span>{trait.physical}</span>
                </div>
              </AttributeContainer>
              <AttributeContainer alignment="center" isMobile={isMobileVersion}>
                <div>
                  <span>{trait.social}</span>
                </div>
              </AttributeContainer>
              <AttributeContainer alignment="right" isMobile={isMobileVersion}>
                <div>
                  <span>{trait.mental}</span>
                </div>
              </AttributeContainer>
            </NegativeTraitsRow>
          ))}
        </>
      )}
    </Fragment>
  );
};

export default NegAttributesTraitsList;
