import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

export default function extractInfluencesTraits(
  line: string,
  creatureType: string,
): CharacterTrait | undefined {
  let influence: string;
  let level: number;
  let influenceTrait: CharacterTrait | undefined;

  if (creatureType === 'Werewolf') {
    if (
      line.indexOf('Bureaucracy') >= 0 &&
      line.indexOf('(Bureaucracy') === -1
    ) {
      influence = 'Bureaucracy';
    } else if (line.indexOf('Church') >= 0 && line.indexOf('(Church') === -1) {
      influence = 'Church';
    } else if (
      line.indexOf('Finance') >= 0 &&
      line.indexOf('(Finance') === -1
    ) {
      influence = 'Finance';
    } else if (line.indexOf('Health') >= 0 && line.indexOf('(Health') === -1) {
      influence = 'Health';
    } else if (
      line.indexOf('High Society') >= 0 &&
      line.indexOf('(High Society')
    ) {
      influence = 'High Society';
    } else if (
      line.indexOf('Industry') >= 0 &&
      line.indexOf('(Industry') === -1
    ) {
      influence = 'Industry';
    } else if (line.indexOf('Legal') >= 0 && line.indexOf('(Legal') === -1) {
      influence = 'Legal';
    } else if (line.indexOf('Media') >= 0 && line.indexOf('(Media') === -1) {
      influence = 'Media';
    } else if (
      line.indexOf('Military') >= 0 &&
      line.indexOf('Military') !== line.indexOf('Military Force')
    ) {
      influence = 'Military';
    } else if (
      line.indexOf('Occult') >= 0 &&
      line.indexOf('(Occult') === -1 &&
      line.indexOf('Occult') !== line.indexOf('Occult Library')
    ) {
      influence = 'Occult';
    } else if (line.indexOf('Police') >= 0 && line.indexOf('(Police') === -1) {
      influence = 'Police';
    } else if (
      line.indexOf('Politics') >= 0 &&
      line.indexOf('(Politics') === -1
    ) {
      influence = 'Politics';
    } else if (line.indexOf('Street') >= 0 && line.indexOf('(Street') === -1) {
      influence = 'Street';
    } else if (
      line.indexOf('Transportation') >= 0 &&
      line.indexOf('(Transportation') === -1
    ) {
      influence = 'Transportation';
    } else if (
      line.indexOf('Underworld') >= 0 &&
      line.indexOf('(Underworld') === -1
    ) {
      influence = 'Underworld';
    } else if (
      line.indexOf('University') >= 0 &&
      line.indexOf('(University') === -1
    ) {
      influence = 'University';
    } else {
      influence = '';
    }

    if (influence !== '') {
      const startLevel =
        line.indexOf(`${influence} x`) >= 0
          ? line.indexOf(`${influence} x`) + `${influence} x`.length
          : -1;

      if (startLevel >= 0) {
        const endLevel = startLevel + 1;
        const extractedLevel = parseInt(
          line.substring(startLevel, endLevel),
          10,
        );

        if (!Number.isNaN(extractedLevel)) {
          level = extractedLevel;
        } else {
          level = 0;
        }
      } else {
        level = 1;
      }

      if (level > 0) {
        influenceTrait = {
          trait: influence,
          level,
          type: 'influences',
        } as CharacterTrait;
      } else {
        influenceTrait = undefined;
      }
    } else {
      influenceTrait = undefined;
    }
  } else {
    if (
      line.lastIndexOf('Bureaucracy') >= 0 &&
      line.lastIndexOf('(Bureaucracy') === -1
    ) {
      influence = 'Bureaucracy';
    } else if (
      line.lastIndexOf('Church') >= 0 &&
      line.lastIndexOf('(Church') === -1
    ) {
      influence = 'Church';
    } else if (
      line.lastIndexOf('Finance') >= 0 &&
      line.lastIndexOf('(Finance') === -1
    ) {
      influence = 'Finance';
    } else if (
      line.lastIndexOf('Health') >= 0 &&
      line.lastIndexOf('(Health') === -1
    ) {
      influence = 'Health';
    } else if (
      line.lastIndexOf('High Society') >= 0 &&
      line.lastIndexOf('(High Society')
    ) {
      influence = 'High Society';
    } else if (
      line.lastIndexOf('Industry') >= 0 &&
      line.lastIndexOf('(Industry') === -1
    ) {
      influence = 'Industry';
    } else if (
      line.lastIndexOf('Legal') >= 0 &&
      line.lastIndexOf('(Legal') === -1
    ) {
      influence = 'Legal';
    } else if (
      line.lastIndexOf('Media') >= 0 &&
      line.lastIndexOf('(Media') === -1
    ) {
      influence = 'Media';
    } else if (
      line.lastIndexOf('Military') >= 0 &&
      line.lastIndexOf('Military') !== line.lastIndexOf('Military Force')
    ) {
      influence = 'Military';
    } else if (
      line.lastIndexOf('Occult') >= 0 &&
      line.lastIndexOf('(Occult') === -1 &&
      line.lastIndexOf('Occult') !== line.lastIndexOf('Occult Library')
    ) {
      influence = 'Occult';
    } else if (
      line.lastIndexOf('Police') >= 0 &&
      line.lastIndexOf('(Police') === -1
    ) {
      influence = 'Police';
    } else if (
      line.lastIndexOf('Politics') >= 0 &&
      line.lastIndexOf('(Politics') === -1
    ) {
      influence = 'Politics';
    } else if (
      line.lastIndexOf('Street') >= 0 &&
      line.lastIndexOf('(Street') === -1
    ) {
      influence = 'Street';
    } else if (
      line.lastIndexOf('Transportation') >= 0 &&
      line.lastIndexOf('(Transportation') === -1
    ) {
      influence = 'Transportation';
    } else if (
      line.lastIndexOf('Underworld') >= 0 &&
      line.lastIndexOf('(Underworld') === -1
    ) {
      influence = 'Underworld';
    } else if (
      line.lastIndexOf('University') >= 0 &&
      line.lastIndexOf('(University') === -1
    ) {
      influence = 'University';
    } else {
      influence = '';
    }

    if (influence !== '') {
      const startLevel =
        line.lastIndexOf(`${influence} x`) >= 0
          ? line.lastIndexOf(`${influence} x`) + `${influence} x`.length
          : -1;

      if (startLevel >= 0) {
        const endLevel = startLevel + 1;
        const extractedLevel = parseInt(
          line.substring(startLevel, endLevel),
          10,
        );

        if (!Number.isNaN(extractedLevel)) {
          level = extractedLevel;
        } else {
          level = 0;
        }
      } else {
        level = 1;
      }

      if (level > 0) {
        influenceTrait = {
          trait: influence,
          level,
          type: 'influences',
        } as CharacterTrait;
      } else {
        influenceTrait = undefined;
      }
    } else {
      influenceTrait = undefined;
    }
  }

  return influenceTrait;
}
