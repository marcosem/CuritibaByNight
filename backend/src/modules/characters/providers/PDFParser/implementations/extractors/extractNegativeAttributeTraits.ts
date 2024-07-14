import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

export default function extractNegativeAttributeTraits(
  line: string,
): CharacterTrait[] {
  const negAttributes = [] as CharacterTrait[];
  let negPhysical: CharacterTrait;
  let negSocial: CharacterTrait;
  let negMental: CharacterTrait;

  if (line.indexOf('Negative Physical Traits:') >= 0) {
    return [];
  }

  const newLine = line.replace(/ x/g, '_x');

  const nAtts = newLine
    .split(' ')
    .filter(nAtt => nAtt.indexOf('(') === -1 && nAtt.indexOf(')') === -1);

  if (nAtts.length < 3) {
    return [];
  }

  // Take any physical trait
  const nPhysical = nAtts[0].split('_x');
  if (nPhysical[0] !== '') {
    const level = nPhysical.length > 1 ? parseInt(nPhysical[1], 10) : 1;

    negPhysical = {
      trait: `physical:${nPhysical[0]}`,
      level,
      type: 'neg_attributes',
    } as CharacterTrait;
    negAttributes.push(negPhysical);
  }

  const nSocial = nAtts[1].split('_x');
  if (nSocial[0] !== '') {
    const level = nSocial.length > 1 ? parseInt(nSocial[1], 10) : 1;

    negSocial = {
      trait: `social:${nSocial[0]}`,
      level,
      type: 'neg_attributes',
    } as CharacterTrait;
    negAttributes.push(negSocial);
  }

  const nMental = nAtts[2].split('_x');
  if (nMental[0] !== '') {
    const level = nMental.length > 1 ? parseInt(nMental[1], 10) : 1;

    negMental = {
      trait: `mental:${nMental[0]}`,
      level,
      type: 'neg_attributes',
    } as CharacterTrait;
    negAttributes.push(negMental);
  }

  return negAttributes;
}
