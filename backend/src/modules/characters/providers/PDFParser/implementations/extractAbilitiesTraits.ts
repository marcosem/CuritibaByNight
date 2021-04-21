import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

export default function extractAbilitiesTraits(
  line: string,
  creatureType: string,
): CharacterTrait | undefined {
  let ability: string;
  let abilityTrait: CharacterTrait | undefined;

  if (line.indexOf('O ') >= 0) {
    const startAbility = line.indexOf('O ') + 'O '.length;
    const level = line.indexOf('O ') + 1;

    switch (creatureType) {
      case 'Vampire':
        {
          let endAbility: number;

          if (level > 1) {
            endAbility = line.indexOf(' x');
          } else {
            let disciplineTag: string;

            if (line.indexOf(' Animalism:') >= 0) {
              disciplineTag = ' Animalism:';
            } else if (line.indexOf(' Auspex:') >= 0) {
              disciplineTag = ' Auspex:';
            } else if (line.indexOf(' Celerity:') >= 0) {
              disciplineTag = ' Celerity:';
            } else if (line.indexOf(' Chimerstry:') >= 0) {
              disciplineTag = ' Chimerstry:';
            } else if (line.indexOf(' Dementation:') >= 0) {
              disciplineTag = ' Dementation:';
            } else if (line.indexOf(' Dominate:') >= 0) {
              disciplineTag = ' Dominate:';
            } else if (line.indexOf(' Fortitude:') >= 0) {
              disciplineTag = ' Fortitude:';
            } else if (line.indexOf(' Flight:') >= 0) {
              disciplineTag = ' Flight:';
            } else if (line.indexOf(' Melpominee:') >= 0) {
              disciplineTag = ' Melpominee:';
            } else if (line.indexOf(' Obfuscate:') >= 0) {
              disciplineTag = ' Obfuscate:';
            } else if (line.indexOf(' Obtenebration:') >= 0) {
              disciplineTag = ' Obtenebration:';
            } else if (line.indexOf(' Potence:') >= 0) {
              disciplineTag = ' Potence:';
            } else if (line.indexOf(' Presence:') >= 0) {
              disciplineTag = ' Presence:';
            } else if (line.indexOf(' Protean:') >= 0) {
              disciplineTag = ' Protean:';
            } else if (line.indexOf(' Quietus:') >= 0) {
              disciplineTag = ' Quietus:';
            } else if (line.indexOf(' Serpentis:') >= 0) {
              disciplineTag = ' Serpentis:';
            } else if (line.indexOf(' Temporis:') >= 0) {
              disciplineTag = ' Temporis:';
            } else if (line.indexOf(' Thanatosis:') >= 0) {
              disciplineTag = ' Thanatosis:';
            } else if (line.indexOf(' Dark Thaumaturgy:') >= 0) {
              disciplineTag = ' Dark Thaumaturgy:';
            } else if (line.indexOf(' Thaumaturgy:') >= 0) {
              disciplineTag = ' Thaumaturgy:';
            } else if (line.indexOf(' Valeren:') >= 0) {
              disciplineTag = ' Valeren:';
            } else if (line.indexOf(' Vicissitude:') >= 0) {
              disciplineTag = ' Vicissitude:';
            } else if (line.indexOf(' Visceratika:') >= 0) {
              disciplineTag = ' Visceratika:';
            } else if (line.indexOf(' Akhu:') >= 0) {
              disciplineTag = ' Akhu:';
            } else if (line.indexOf(' Dur-An-Ki:') >= 0) {
              disciplineTag = ' Dur-An-Ki:';
            } else if (line.indexOf(' Inceptor:') >= 0) {
              disciplineTag = ' Inceptor:';
            } else if (line.indexOf(' Koldunic Sorcery:') >= 0) {
              disciplineTag = ' Koldunic Sorcery:';
            } else if (line.indexOf(' Necromancy:') >= 0) {
              disciplineTag = ' Necromancy:';
            } else if (line.indexOf(' Sadhana:') >= 0) {
              disciplineTag = ' Sadhana:';
            } else if (line.indexOf(' Voudoun Necromancy:') >= 0) {
              disciplineTag = ' Voudoun Necromancy:';
            } else if (line.indexOf(' Wanga:') >= 0) {
              disciplineTag = ' Wanga:';
            } else if (line.indexOf(' Assamite:') >= 0) {
              disciplineTag = ' Assamite:';
            } else if (line.indexOf(' Baali:') >= 0) {
              disciplineTag = ' Baali:';
            } else if (line.indexOf(' Brujah:') >= 0) {
              disciplineTag = ' Brujah:';
            } else if (line.indexOf(' Cappadocian:') >= 0) {
              disciplineTag = ' Cappadocian:';
            } else if (line.indexOf(' Followers of Set:') >= 0) {
              disciplineTag = ' Followers of Set:';
            } else if (line.indexOf(' Gangrel:') >= 0) {
              disciplineTag = ' Gangrel:';
            } else if (line.indexOf(' Giovanni:') >= 0) {
              disciplineTag = ' Giovanni:';
            } else if (line.indexOf(' Lasombra:') >= 0) {
              disciplineTag = ' Lasombra:';
            } else if (line.indexOf(' Malkavian:') >= 0) {
              disciplineTag = ' Malkavian:';
            } else if (line.indexOf(' Nosferatu:') >= 0) {
              disciplineTag = ' Nosferatu:';
            } else if (line.indexOf(' Ravnos:') >= 0) {
              disciplineTag = ' Ravnos:';
            } else if (line.indexOf(' Salubri:') >= 0) {
              disciplineTag = ' Salubri:';
            } else if (line.indexOf(' Toreador:') >= 0) {
              disciplineTag = ' Toreador:';
            } else if (line.indexOf(' Tremere:') >= 0) {
              disciplineTag = ' Tremere:';
            } else if (line.indexOf(' Tzimisce:') >= 0) {
              disciplineTag = ' Tzimisce:';
            } else if (
              line.indexOf(' Ventrue:') >= 0 &&
              line.indexOf(' Ventrue:') !==
                line.indexOf(' Ventrue: Blood Scent')
            ) {
              disciplineTag = ' Ventrue:';
            } else if (line.indexOf(' Abombwe:') >= 0) {
              disciplineTag = ' Abombwe:';
            } else if (line.indexOf(' Bardo:') >= 0) {
              disciplineTag = ' Bardo:';
            } else if (line.indexOf(' Combination:') >= 0) {
              disciplineTag = ' Combination:';
            } else if (line.indexOf(' Daimoinon:') >= 0) {
              disciplineTag = ' Daimoinon:';
            } else if (line.indexOf(' Deimos:') >= 0) {
              disciplineTag = ' Deimos:';
            } else if (line.indexOf(' Einherjar:') >= 0) {
              disciplineTag = ' Einherjar:';
            } else if (line.indexOf(' Gargoyle Powers:') >= 0) {
              disciplineTag = ' Gargoyle Powers:';
            } else if (line.indexOf(' Mortis:') >= 0) {
              disciplineTag = ' Mortis:';
            } else if (line.indexOf(' Mytherceria:') >= 0) {
              disciplineTag = ' Mytherceria:';
            } else if (line.indexOf(' Obeah:') >= 0) {
              disciplineTag = ' Obeah:';
            } else if (line.indexOf(' Ogham:') >= 0) {
              disciplineTag = ' Ogham:';
            } else if (line.indexOf(' Sanguinus:') >= 0) {
              disciplineTag = ' Sanguinus:';
            } else if (line.indexOf(' Spiritus:') >= 0) {
              disciplineTag = ' Spiritus:';
            } else {
              disciplineTag = '';
            }

            if (disciplineTag === '') {
              endAbility = line.length - 2;
            } else {
              endAbility = line.indexOf(disciplineTag);
            }

            const bracket = line.indexOf(' (');
            if (bracket >= 0 && bracket < endAbility) {
              endAbility = bracket;
            }
          }

          ability = line.substring(startAbility, endAbility);

          abilityTrait = {
            trait: ability,
            level,
            type: 'abilities',
          } as CharacterTrait;
        }
        break;

      case 'Mortal':
        {
          let endAbility: number;

          if (level > 1) {
            endAbility = line.indexOf(' x');
          } else {
            let disciplineTag: string;

            if (line.indexOf(' Arts:') >= 0) {
              disciplineTag = ' Arts:';
            } else if (line.indexOf(' Benandanti Rituals:') >= 0) {
              disciplineTag = ' Benandanti Rituals:';
            } else if (line.indexOf(' Bioenhancements:') >= 0) {
              disciplineTag = ' Bioenhancements:';
            } else if (line.indexOf(' Disciplines:') >= 0) {
              disciplineTag = ' Disciplines:';
            } else if (line.indexOf(' Fomori Powers:') >= 0) {
              disciplineTag = ' Fomori Powers:';
            } else if (line.indexOf(' Gifts:') >= 0) {
              disciplineTag = ' Gifts:';
            } else if (line.indexOf(' Martial Arts:') >= 0) {
              disciplineTag = ' Martial Arts:';
            } else if (line.indexOf(' Psychic:') >= 0) {
              disciplineTag = ' Psychic:';
            } else if (line.indexOf(' Realms:') >= 0) {
              disciplineTag = ' Realms:';
            } else if (line.indexOf(' Sorcery:') >= 0) {
              disciplineTag = ' Sorcery:';
            } else if (line.indexOf(' Shintai:') >= 0) {
              disciplineTag = ' Shintai:';
            } else if (line.indexOf(' Sorcery [Unrevised]:') >= 0) {
              disciplineTag = ' Sorcery [Unrevised]:';
            } else if (line.indexOf(' Theurgy:') >= 0) {
              disciplineTag = ' Theurgy:';
            } else if (line.indexOf(' Theurgy [Unrevised]:') >= 0) {
              disciplineTag = ' Theurgy [Unrevised]:';
            } else {
              disciplineTag = '';
            }

            if (disciplineTag === '') {
              endAbility = line.length - 2;
            } else {
              endAbility = line.indexOf(disciplineTag);
            }

            const bracket = line.indexOf(' (');
            if (bracket >= 0 && bracket < endAbility) {
              endAbility = bracket;
            }
          }
          ability = line.substring(startAbility, endAbility);

          abilityTrait = {
            trait: ability,
            level,
            type: 'abilities',
          } as CharacterTrait;
        }
        break;

      default:
        abilityTrait = undefined;
    }
  } else {
    abilityTrait = undefined;
  }

  return abilityTrait;
}
