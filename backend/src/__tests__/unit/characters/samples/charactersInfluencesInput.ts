const characterList = [
  {
    name: 'Vampire #3',
    experience: 666,
    file: 'vamp3.pdf',
    clan: 'Tremere',
    creature_type: 'Vampire',
    sect: 'Camarilla',
    situation: 'active',
    npc: false,
    traits: [
      {
        trait: 'Morality: Humanity',
        level: 1,
        type: 'virtues',
        updated_at: new Date('2022-11-02T00:00:00.000Z'),
      },
      {
        trait: 'Physical',
        level: 11,
        type: 'attributes',
      },
      {
        trait: 'Social',
        level: 11,
        type: 'attributes',
      },
      {
        trait: 'Mental',
        level: 11,
        type: 'attributes',
      },
    ],
  },
  {
    name: 'Vampire #2',
    experience: 666,
    file: 'vamp2.pdf',
    clan: 'Toreador',
    creature_type: 'Vampire',
    sect: 'Camarilla',
    situation: 'active',
    npc: true,
    traits: [
      {
        trait: 'Morality: Humanity',
        level: 6,
        type: 'virtues',
        updated_at: new Date('2022-11-02T00:00:00.000Z'),
      },
      {
        trait: 'Retainers',
        level: 5,
        level_temp: undefined,
        type: 'backgrounds',
      },
      {
        trait: 'Physical',
        level: 11,
        type: 'attributes',
      },
      {
        trait: 'Social',
        level: 11,
        type: 'attributes',
      },
      {
        trait: 'Mental',
        level: 11,
        type: 'attributes',
      },
      {
        trait: 'Ettiquete',
        level: 5,
        type: 'abiltities',
      },
      {
        trait: 'Investigation',
        level: 3,
        type: 'abiltities',
      },
      {
        trait: 'High Society',
        level: 5,
        level_temp: 'full|full|full|full|full',
        type: 'influences',
      },
      {
        trait: 'Police',
        level: 3,
        level_temp: undefined,
        type: 'influences',
      },
    ],
  },
  {
    name: 'Vampire #1',
    experience: 666,
    file: 'vamp1.pdf',
    clan: 'Tzimisce',
    creature_type: 'Vampire',
    sect: 'Sabbat',
    situation: 'active',
    npc: true,
    traits: [
      {
        trait: 'Morality: Path of Blood',
        level: 4,
        type: 'virtues',
      },
      {
        trait: 'Retainers',
        level: 3,
        level_temp: 'full|full|empty',
        type: 'backgrounds',
      },
      {
        trait: 'Physical',
        level: 10,
        type: 'attributes',
      },
      {
        trait: 'Social',
        level: 10,
        type: 'attributes',
      },
      {
        trait: 'Mental',
        level: 10,
        type: 'attributes',
      },
      {
        trait: 'Occult',
        level: 2,
        type: 'abiltities',
      },
      {
        trait: 'Occult',
        level: 4,
        level_temp: undefined,
        type: 'influences',
      },
      {
        trait: 'Police',
        level: 2,
        level_temp: 'empty|empty',
        type: 'influences',
      },
    ],
  },
  {
    name: 'Vampire Transfered',
    experience: 666,
    file: 'vamp3.pdf',
    clan: 'Lasombra',
    creature_type: 'Vampire',
    sect: 'Sabbat',
    situation: 'transfered',
    npc: true,
    traits: [
      {
        trait: 'Morality: Humanity',
        level: 3,
        type: 'virtues',
      },
      {
        trait: 'Retainers',
        level: 5,
        level_temp: undefined,
        type: 'backgrounds',
      },
      {
        trait: 'Physical',
        level: 11,
        type: 'attributes',
      },
      {
        trait: 'Social',
        level: 11,
        type: 'attributes',
      },
      {
        trait: 'Mental',
        level: 11,
        type: 'attributes',
      },
      {
        trait: 'Ettiquete',
        level: 5,
        type: 'abiltities',
      },
      {
        trait: 'Investigation',
        level: 3,
        type: 'abiltities',
      },
      {
        trait: 'High Society',
        level: 5,
        level_temp: 'full|full|full|full|full',
        type: 'influences',
      },
      {
        trait: 'Police',
        level: 3,
        level_temp: undefined,
        type: 'influences',
      },
    ],
  },
  {
    name: 'Ghoul Twin',
    experience: 666,
    file: 'ghoul1.pdf',
    clan: 'Ghoul: Gangrel',
    creature_type: 'Mortal',
    sect: '',
    situation: 'active',
    npc: true,
    traits: [
      {
        trait: 'Physical',
        level: 5,
        type: 'attributes',
      },
      {
        trait: 'Social',
        level: 5,
        type: 'attributes',
      },
      {
        trait: 'Mental',
        level: 5,
        type: 'attributes',
      },
      {
        trait: 'Retainers',
        level: 2,
        type: 'backgrounds',
      },
      {
        trait: 'Street',
        level: 3,
        level_temp: 'full|full|empty',
        type: 'influences',
      },
    ],
  },
  {
    name: 'Ghould Dead',
    experience: 666,
    file: 'ghoul2.pdf',
    clan: 'Ghoul: Ventrue',
    creature_type: 'Mortal',
    sect: '',
    situation: 'dead',
    npc: true,
    traits: [
      {
        trait: 'Physical',
        level: 5,
        type: 'attributes',
      },
      {
        trait: 'Social',
        level: 5,
        type: 'attributes',
      },
      {
        trait: 'Mental',
        level: 5,
        type: 'attributes',
      },
      {
        trait: 'Street',
        level: 5,
        level_temp: 'full|full|empty',
        type: 'influences',
      },
    ],
  },
  {
    name: 'Ghoul Twin',
    experience: 666,
    file: 'ghoul1.pdf',
    clan: 'Ghoul: Gangrel',
    creature_type: 'Mortal',
    sect: '',
    situation: 'active',
    npc: true,
    traits: [
      {
        trait: 'Physical',
        level: 5,
        type: 'attributes',
      },
      {
        trait: 'Social',
        level: 5,
        type: 'attributes',
      },
      {
        trait: 'Mental',
        level: 5,
        type: 'attributes',
      },
    ],
  },
  {
    name: 'Vampire Destroyed',
    experience: 666,
    file: 'vamp4.pdf',
    clan: 'Tremere',
    creature_type: 'Vampire',
    sect: 'Camarilla',
    situation: 'destroyed',
    npc: true,
    traits: [
      {
        trait: 'Morality: Humanity',
        level: 3,
        type: 'virtues',
      },
      {
        trait: 'Physical',
        level: 4,
        type: 'attributes',
      },
      {
        trait: 'Social',
        level: 4,
        type: 'attributes',
      },
      {
        trait: 'Mental',
        level: 4,
        type: 'attributes',
      },
      {
        trait: 'Police',
        level: 6,
        level_temp: undefined,
        type: 'influences',
      },
    ],
  },
  {
    name: 'Vampire #5',
    experience: 666,
    file: 'vamp5.pdf',
    clan: 'Brujah',
    creature_type: 'Vampire',
    sect: 'Camarilla',
    situation: 'inactive',
    npc: true,
    traits: [
      {
        trait: 'Morality: Path of Blood',
        level: 2,
        type: 'virtues',
      },
      {
        trait: 'Physical',
        level: 6,
        type: 'attributes',
      },
      {
        trait: 'Social',
        level: 6,
        type: 'attributes',
      },
      {
        trait: 'Mental',
        level: 6,
        type: 'attributes',
      },
      {
        trait: 'Streetwise',
        level: 3,
        type: 'abiltities',
      },
      {
        trait: 'Street',
        level: 3,
        level_temp: undefined,
        type: 'influences',
      },
    ],
  },
  {
    name: 'Werewolf #1',
    experience: 666,
    file: 'wolf.pdf',
    clan: 'Get of Fenris',
    creature_type: 'Werewolf',
    sect: '',
    situation: 'active',
    npc: true,
    traits: [
      {
        trait: 'Physical',
        level: 14,
        type: 'attributes',
      },
      {
        trait: 'Social',
        level: 14,
        type: 'attributes',
      },
      {
        trait: 'Mental',
        level: 14,
        type: 'attributes',
      },
      {
        trait: 'Camarilla Law',
        level: 3,
        type: 'abiltities',
      },
      {
        trait: 'Law',
        level: 1,
        type: 'abiltities',
      },
      {
        trait: 'Legal',
        level: 4,
        level_temp: 'full|full|full|full',
        type: 'influences',
      },
    ],
  },
  {
    name: 'Wraith #1',
    experience: 666,
    file: 'wraith.pdf',
    clan: 'Solicitor',
    creature_type: 'Wraith',
    sect: 'Hierarchy',
    situation: 'active',
    npc: true,
    traits: [
      {
        trait: 'Physical',
        level: 7,
        type: 'attributes',
      },
      {
        trait: 'Social',
        level: 7,
        type: 'attributes',
      },
      {
        trait: 'Mental',
        level: 7,
        type: 'attributes',
      },
      {
        trait: 'Church',
        level: 1,
        level_temp: undefined,
        type: 'influences',
      },
    ],
  },
  {
    name: 'Mage #1',
    experience: 666,
    file: 'mage.pdf',
    clan: 'Verbena',
    creature_type: 'Mage',
    sect: '',
    situation: 'active',
    npc: true,
    traits: [
      {
        trait: 'Physical',
        level: 7,
        type: 'attributes',
      },
      {
        trait: 'Social',
        level: 7,
        type: 'attributes',
      },
      {
        trait: 'Mental',
        level: 7,
        type: 'attributes',
      },
      {
        trait: 'Crafts: Weaponsmith',
        level: 4,
        type: 'abilities',
      },
      {
        trait: 'Crafts: Brewery',
        level: 2,
        type: 'abilities',
      },
      {
        trait: 'Crafts: Handcraft',
        level: 4,
        type: 'abilities',
      },
      {
        trait: 'Crafts: Armory',
        level: 4,
        type: 'abilities',
      },
      {
        trait: 'Industry',
        level: 4,
        level_temp: undefined,
        type: 'influences',
      },
      {
        trait: 'Church',
        level: 3,
        type: 'influences',
      },
    ],
  },
  {
    name: 'Inactive Ghoul',
    experience: 666,
    file: 'inative_ghoul.pdf',
    clan: 'Ghoul: Ventrue',
    creature_type: 'Mortal',
    sect: '',
    situation: 'inactive',
    npc: true,
    traits: [
      {
        trait: 'Physical',
        level: 7,
        type: 'attributes',
      },
      {
        trait: 'Social',
        level: 7,
        type: 'attributes',
      },
      {
        trait: 'Mental',
        level: 7,
        type: 'attributes',
      },
      {
        trait: 'Legal',
        level: 3,
        level_temp: undefined,
        type: 'influences',
      },
    ],
  },
  {
    name: 'Inactive Retainer',
    experience: 666,
    file: 'inative_retainer.pdf',
    clan: 'Mortal Retainer',
    creature_type: 'Mortal',
    sect: '',
    situation: 'inactive',
    npc: true,
    traits: [
      {
        trait: 'Physical',
        level: 7,
        type: 'attributes',
      },
      {
        trait: 'Social',
        level: 7,
        type: 'attributes',
      },
      {
        trait: 'Mental',
        level: 7,
        type: 'attributes',
      },
      {
        trait: 'University',
        level: 3,
        level_temp: undefined,
        type: 'influences',
      },
    ],
  },
];

export default characterList;
