import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

export default function extractVampirePowersTraits(
  line: string,
  powersList: CharacterTrait[],
): CharacterTrait[] {
  let currPowersList = powersList;
  let power = '';

  // Search for powers first
  let powerIndex = -1;
  const vampirePowers = [
    'Assamite',
    'Baali',
    'Brujah',
    'Cappadocian',
    'Gargoyle Powers',
    'Giovanni',
    'Lasombra',
    'Nosferatu',
    'Salubri',
    'Toreador',
    'Tremere',
    'Tzimisce',
    'Combination',
    'Einherjar',
  ];

  if (
    line.lastIndexOf(' Ventrue: ') >= 0 &&
    line.lastIndexOf(' Ventrue: ') !== line.indexOf(' Ventrue: Blood Scent')
  ) {
    powerIndex = line.lastIndexOf(' Ventrue: ');
    power = ' Ventrue: ';
  } else if (
    line.lastIndexOf(' Followers of Set: ') >= 0 &&
    line.lastIndexOf(' Followers of Set: ') !==
      line.indexOf(' Followers of Set: Mummification')
  ) {
    powerIndex = line.lastIndexOf(' Followers of Set: ');
    power = ' Followers of Set: ';
  } else if (
    line.lastIndexOf(' Malkavian: ') >= 0 &&
    line.lastIndexOf(' Malkavian: ') !==
      line.indexOf(' Malkavian: Malkavian Time')
  ) {
    powerIndex = line.lastIndexOf(' Malkavian: ');
    power = ' Malkavian: ';
  } else if (
    line.lastIndexOf(' Gangrel: ') >= 0 &&
    line.lastIndexOf(' Gangrel: ') !== line.indexOf(' Gangrel: Divine') &&
    line.lastIndexOf(' Gangrel: ') !== line.indexOf(' Gangrel: Rending') &&
    line.lastIndexOf(' Gangrel: ') !== line.indexOf(' Gangrel: Rune-Lore') &&
    line.lastIndexOf(' Gangrel: ') !== line.indexOf(' Gangrel: Sagaman')
  ) {
    powerIndex = line.lastIndexOf(' Gangrel: ');
    power = ' Gangrel: ';
  } else if (
    line.lastIndexOf(' Ravnos: ') >= 0 &&
    line.lastIndexOf(' Ravnos: ') !== line.indexOf(' Ravnos: Diversion') &&
    line.lastIndexOf(' Ravnos: ') !== line.indexOf(' Ravnos: Escapology') &&
    line.lastIndexOf(' Ravnos: ') !== line.indexOf(' Ravnos: Sleight of Hand')
  ) {
    powerIndex = line.lastIndexOf(' Ravnos: ');
    power = ' Ravnos: ';
  } else {
    vampirePowers.some(pwd => {
      const powerIndexAux = line.lastIndexOf(` ${pwd}: `);
      if (powerIndexAux >= 0) {
        powerIndex = powerIndexAux;
        power = ` ${pwd}: `;
        return true;
      }
      return false;
    });
  }

  // Found a power, stop search
  if (power !== '') {
    const startPower = powerIndex + 1;
    const endPower =
      line.indexOf(' (', powerIndex) > powerIndex
        ? line.indexOf(' (', powerIndex)
        : line.length - 1;

    power = line.substring(startPower, endPower);

    const myPower = {
      trait: power,
      level: 0,
      type: 'powers',
    } as CharacterTrait;

    currPowersList.push(myPower);

    return currPowersList;
  }

  // Search for Disciplines
  const vampireDisciplines = [
    'Animalism',
    'Auspex',
    'Celerity',
    'Chimerstry',
    'Dementation',
    'Dominate',
    'Fortitude',
    'Flight',
    'Melpominee',
    'Obfuscate',
    'Obtenebration',
    'Potence',
    'Presence',
    'Protean',
    'Quietus',
    'Serpentis',
    'Temporis',
    'Thanatosis',
    'Valeren',
    'Vicissitude',
    'Visceratika',
    'Abombwe',
    'Bardo',
    'Daimoinon',
    'Deimos',
    'Mortis',
    'Mytherceria',
    'Obeah',
    'Ogham',
    'Sanguinus',
    'Spiritus',
    'Akhu: Alchemy',
    'Akhu: Breath of Set',
    'Akhu: Divine Hand',
    'Akhu: Path of Anubis',
    'Akhu: Path of Blood',
    'Akhu: Path of Dry Nile',
    'Akhu: Path of Duat',
    'Akhu: Path of Ptah',
    'Akhu: Path of Thoth',
    "Akhu: Sebau's Touch",
    'Akhu: Soul of the Serpent',
    'Akhu: The False Heart',
    'Akhu: The Immanence of Set',
    'Akhu: The Snake Inside',
    'Akhu: Ushabti',
    'Akhu: Valor of Sutekh',
    'Akhu: Vengeance of Khnum',
    'Akhu: Vine of Dionysus',
    'Dur-An-Ki: Alchemy',
    'Dur-An-Ki: Awakening the Steel',
    'Dur-An-Ki: Covenant of Nergal',
    "Dur-An-Ki: Echoes of Allah's Wrath",
    'Dur-An-Ki: Elemental Mastery',
    'Dur-An-Ki: Ex Inferis',
    'Dur-An-Ki: Hands of Destruction',
    'Dur-An-Ki: Lure of Flames',
    'Dur-An-Ki: Movement of the Mind',
    'Dur-An-Ki: Music of the Spheres',
    "Dur-An-Ki: Neptune's Might",
    'Dur-An-Ki: Path of Blood',
    'Dur-An-Ki: Path of Blood Nectar',
    'Dur-An-Ki: Path of Conjuring',
    'Dur-An-Ki: Path of Duat',
    "Dur-An-Ki: Path of Father's Vengeance",
    'Dur-An-Ki: Path of Focused Mind',
    "Dur-An-Ki: Path of the Blood's Curse",
    'Dur-An-Ki: Spirit Manipulation',
    'Dur-An-Ki: The Evil Eye',
    "Dur-An-Ki: The Hunter's Winds",
    'Dur-An-Ki: Weather Control',
    'Dur-An-Ki: Whispers of the Heavens',
    'Dark Thaumaturgy: Fires of the Inferno',
    'Dark Thaumaturgy: Path of Phobos',
    'Dark Thaumaturgy: Taking of the Spirit',
    'Koldunic Sorcery: Way of Sorrow',
    'Koldunic Sorcery: Way of Blood',
    'Koldunic Sorcery: Way of Spirit',
    'Koldunic Sorcery: Way of Earth',
    'Koldunic Sorcery: Way of Wind',
    'Koldunic Sorcery: Way of Fire',
    'Koldunic Sorcery: Way of Water',
    'Necromancy: Ash Path',
    'Necromancy: Bone Path',
    'Necromancy: Sepulchre Path',
    'Necromancy: Cenotaph Path',
    'Necromancy: Vitreous Path',
    "Necromancy: Grave's Decay",
    'Necromancy: Corpse in the Monster',
    'Necromancy: The Four Humours',
    'Necromancy: Path of Haunting',
    'Necromancy: The Nightshade Path',
    'Necromancy: Nigrimancy',
    'Necromancy: Cadaverous Animation',
    'Necromancy: Path of Skulls',
    'Necromancy: Path of Woe',
    'Necromancy: Mortuus Path',
    'Necromancy: Path of Abombo',
    'Necromancy: Path of Hoodoo',
    'Necromancy: Path of Israfil',
    'Necromancy: Path of Maelstrom Manipulation',
    'Necromancy: Path of the Sheppard',
    'Necromancy: Veil Path',
    'Necromancy: The Dragon Path',
    'Necromancy: Path of the Twilight Garden',
    'Thaumaturgy: Path of Blood',
    'Thaumaturgy: Hands of Destruction',
    'Thaumaturgy: Lure of Flames',
    'Thaumaturgy: Movement of the Mind',
    'Thaumaturgy: Path of Conjuring',
    'Thaumaturgy: Alchemy',
    'Thaumaturgy: Biothaumaturgy',
    'Thaumaturgy: Creo Ignem',
    'Thaumaturgy: Creo Materia',
    'Thaumaturgy: Creo Motus',
    'Thaumaturgy: Creo Tempestas',
    'Thaumaturgy: Elemental Mastery',
    'Thaumaturgy: Focused Mind',
    'Thaumaturgy: Gift of Morpheus',
    'Thaumaturgy: Hearth Path',
    'Thaumaturgy: Mastery of the Mortal Shell',
    "Thaumaturgy: Neptune's Might",
    'Thaumaturgy: Oneiromancy',
    'Thaumaturgy: Path of Corruption',
    'Thaumaturgy: Path of Curses',
    "Thaumaturgy: Path of Father's Vengeance",
    'Thaumaturgy: Path of Mars',
    'Thaumaturgy: Path of Shadowcrafting',
    'Thaumaturgy: Path of Transmutation',
    "Thaumaturgy: Path of the Blood's Curse",
    'Thaumaturgy: Path of the Levinbolt',
    'Thaumaturgy: Path of Mercury',
    'Thaumaturgy: Perdo Materia',
    'Thaumaturgy: Rego Elementum',
    'Thaumaturgy: Way of Harmony',
    'Thaumaturgy: Way of the Levinbolt',
    'Thaumaturgy: Rego Motus',
    'Thaumaturgy: Rego Tempestas',
    'Thaumaturgy: Rego Vitae',
    'Thaumaturgy: Spirit Manipulation',
    'Thaumaturgy: Spirit Thaumaturgy',
    'Thaumaturgy: Technomancy',
    'Thaumaturgy: Thaumaturgical Countermagic',
    'Thaumaturgy: The Faux Path',
    'Thaumaturgy: The Green Path',
    'Thaumaturgy: Vine of Dionysus',
    'Thaumaturgy: Weather Control',
    'Voudoun Necromancy: Ash Path',
    'Voudoun Necromancy: Bone Path',
    'Voudoun Necromancy: Sepulchre Path',
    'Voudoun Necromancy: Path of Hoodoo',
    'Voudoun Necromancy: Cenotaph Path',
    'Voudoun Necromancy: Vitreous Path',
    "Voudoun Necromancy: Grave's Decay",
    'Voudoun Necromancy: Corpse in the Monster',
    'Voudoun Necromancy: The Four Humours',
    'Voudoun Necromancy: Path of Haunting',
    'Voudoun Necromancy: The Nightshade Path',
    'Voudoun Necromancy: Nigrimancy',
    'Voudoun Necromancy: Cadaverous Animation',
    'Voudoun Necromancy: Path of Skulls',
    'Voudoun Necromancy: Path of Woe',
    'Voudoun Necromancy: Mortuus Path',
    'Voudoun Necromancy: Path of Abombo',
    'Voudoun Necromancy: Path of Israfil',
    'Voudoun Necromancy: Path of Maelstrom Manipulation',
    'Voudoun Necromancy: Path of the Sheppard',
    'Voudoun Necromancy: Veil Path',
    'Voudoun Necromancy: The Dragon Path',
    'Voudoun Necromancy: Path of the Twilight Garden',
    'Wanga: Binding Chango',
    "Wanga: Orisha's Fortune",
    'Wanga: Path of Blood',
    'Wanga: Path of Conjuring',
    'Wanga: Path of Corruption',
    'Wanga: Path of Curses',
    'Wanga: Spirit Manipulation',
    'Wanga: The Flow of Ashe',
    'Wanga: Voice of the Wild',
    "Wanga: Zarabanda's Malice",
    'Sadhana: Asura-Raja',
    'Sadhana: Brahma-Vidya',
    'Sadhana: Echo of Nirvana',
    'Sadhana: Hand of Mahakala',
    "Sadhana: Lakshmi's Wishes",
    'Sadhana: Path of Blood Nectar',
    'Sadhana: Path of Karma',
    'Sadhana: Path of Praapti',
    'Sadhana: Path of Yama',
    'Sadhana: Rasayana',
    "Sadhana: Rishi's Hand",
    'Sadhana: Temptations of Mara',
    'Sadhana: Yaksha-Vidya',
  ];

  let discipline = '';

  vampireDisciplines.some(disc => {
    const powerIndexAux = line.lastIndexOf(` ${disc}`);
    if (powerIndexAux >= 0) {
      powerIndex = powerIndexAux;
      discipline = disc;
      return true;
    }
    return false;
  });

  // Found a discipline?
  if (discipline !== '') {
    const myPower: CharacterTrait =
      currPowersList.find(disc => disc.trait === discipline) ||
      ({
        trait: discipline,
        level: 0,
        type: 'powers',
      } as CharacterTrait);

    const newPower = myPower.level === 0;
    let isAPower = true;

    if (line.indexOf('(basic', powerIndex) >= 0) {
      myPower.level = myPower.level === 1 ? 2 : 1;
    } else if (line.indexOf('(int.', powerIndex) >= 0) {
      myPower.level = myPower.level === 3 ? 4 : 3;
    } else if (line.indexOf('(adv.', powerIndex) >= 0) {
      myPower.level = 5;
    } else if (line.indexOf('(elder', powerIndex) >= 0) {
      myPower.level = 6;
    } else if (line.indexOf('(master', powerIndex) >= 0) {
      myPower.level = 7;
    } else {
      isAPower = false;
    }

    if (isAPower) {
      if (newPower) {
        currPowersList.push(myPower);
      } else {
        currPowersList = currPowersList.map(disc =>
          disc.trait === discipline ? myPower : disc,
        );
      }
    }
  }

  return currPowersList;
}
