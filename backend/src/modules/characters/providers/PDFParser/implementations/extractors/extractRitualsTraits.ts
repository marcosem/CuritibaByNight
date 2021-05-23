import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

export default function extractRitualsTraits(
  line: string,
  creature: string,
  ritualsList: CharacterTrait[],
): CharacterTrait[] {
  const currRitualsList = ritualsList;
  let ritual = '';

  switch (creature) {
    case 'Vampire':
      {
        const werewolfRites = [
          'Abyss Mysticism',
          'Akhu',
          'Anarch Curses',
          'Blooding',
          'Dark Thaumaturgy',
          'Dur-an-ki',
          'Necromancy',
          'Sabbat',
          'Voudoun',
          'Wanga',
          'Mortis',
          'Assamite',
          'Gargoyle',
          'Pisanob Necromancy',
          'Revenant Creation',
          'Sorcery',
          'Basic',
          'Intermediate',
          'Advanced',
          'Superior',
        ];

        let ritualIndex = -1;
        werewolfRites.some(rit => {
          const powerIndexAux = line.lastIndexOf(` ${rit}: `);
          if (powerIndexAux >= 0) {
            ritualIndex = powerIndexAux;
            ritual = rit;
            return true;
          }
          return false;
        });

        if (ritual !== '') {
          const startRitual = ritualIndex + 1;
          const endRitual =
            line.indexOf(' (', ritualIndex) > ritualIndex
              ? line.indexOf(' (', ritualIndex)
              : line.length - 1;

          ritual = line.substring(startRitual, endRitual);

          let ritualLevel;
          if (
            line.indexOf('Basic: ', ritualIndex) >= 0 ||
            line.indexOf('(basic', ritualIndex) >= 0
          ) {
            ritual = ritual.replace('Basic: ', '').replace('Rituals, ', '');
            ritualLevel = 1;
          } else if (
            line.indexOf('Intermediate: ', ritualIndex) >= 0 ||
            line.indexOf('(int.', ritualIndex) >= 0
          ) {
            ritual = ritual
              .replace('Intermediate: ', '')
              .replace('Rituals, ', '');
            ritualLevel = 2;
          } else if (
            line.indexOf('Advanced: ', ritualIndex) >= 0 ||
            line.indexOf('(adv.', ritualIndex) >= 0
          ) {
            ritual = ritual.replace('Advanced: ', '').replace('Rituals, ', '');
            ritualLevel = 3;
          } else if (
            line.indexOf('Superior: ', ritualIndex) >= 0 ||
            line.indexOf('Elder: ', ritualIndex) >= 0
          ) {
            ritual = ritual.replace('Superior: ', '').replace('Elder: ', '');
            ritualLevel = 4;
          } else {
            ritualLevel = 0;
          }

          const myRitual = {
            trait: ritual,
            level: ritualLevel,
            type: 'rituals',
          } as CharacterTrait;

          currRitualsList.push(myRitual);
        }
      }
      break;

    case 'Werewolf':
      {
        const werewolfRites = [
          'Accord',
          'Caern',
          'Death',
          'Frontier',
          'Hengeyokai',
          'Minor',
          'Mystic',
          'Punishment',
          'Pure Ones',
          'Renown',
          'Seasonal',
          'Tribal',
        ];

        let ritualIndex = -1;
        werewolfRites.some(rit => {
          const powerIndexAux = line.lastIndexOf(` ${rit}: `);
          if (powerIndexAux >= 0) {
            ritualIndex = powerIndexAux;
            ritual = rit;
            return true;
          }
          return false;
        });

        if (ritual !== '') {
          const startRitual = ritualIndex + 1;
          const endRitual =
            line.indexOf(' (', ritualIndex) > ritualIndex
              ? line.indexOf(' (', ritualIndex)
              : line.length - 1;

          ritual = line.substring(startRitual, endRitual);

          let isARite = true;
          let ritualLevel;
          if (line.indexOf('(basic', ritualIndex) >= 0) {
            ritualLevel = 1;
          } else if (line.indexOf('(int.', ritualIndex) >= 0) {
            ritualLevel = 2;
          } else if (line.indexOf('(adv.', ritualIndex) >= 0) {
            ritualLevel = 3;
          } else {
            isARite = false;
          }

          if (isARite) {
            const myRitual = {
              trait: ritual,
              level: ritualLevel,
              type: 'rituals',
            } as CharacterTrait;

            currRitualsList.push(myRitual);
          }
        }
      }
      break;

    case 'Mage':
      {
        const mageRotes = [
          'Access This',
          'Activate Next Clone',
          'Affix Gauntlet',
          'Akashic Cliffs Notes',
          'Alloy',
          'Alter Simple Creature',
          'Alter Weight',
          'Analyze Substance',
          'Animal Form',
          'Animate the Dead',
          'Apportation',
          'Astral Projection',
          'Avatar Form',
          'Awaken the Inanimate',
          'Ball of Abysmal Flame',
          'Battery Man',
          'Be Cool',
          'Bean',
          "Beginner's Luck",
          'Bending Willow',
          'Better Body',
          'Binding Oath',
          'Blight of Aging',
          'Block Magical Energy',
          'Body of Light',
          'Bond of Blood',
          'Breach the Gauntlet',
          'Break the Dreamshell',
          'Bubble of Reality',
          "Butcher's Disguise",
          'Call Spirit',
          'Call the Tempest',
          'Camouflage Field Generator',
          'Chain',
          'Change the Flow of the Masses',
          'Circle Ward',
          'Cleansing Penance',
          'Co-Location',
          'Code: FIDA',
          'Command the Summoned Beast',
          'Commune',
          'Consecration',
          'Contingent Effect',
          'Correspondence Sensing',
          'Cracks in the Conscience',
          'Create Mind',
          'Create Normal Item',
          'Create Talismans and Artifacts',
          'Curse of Luck',
          'Darksight',
          'Decrepify',
          'Decrypt Thoughts',
          'Deep Umbra Travel',
          'Deflect Bullets [Forces]',
          'Deflect Bullets [Matter]',
          'Destroy Structures',
          'Detect Possession',
          'Discordant Sanctum',
          'Distort Time',
          'Divinations',
          'Duct Tape and WD-40',
          'Electrical Chaos',
          'Embracing the Earth Mother',
          'Empathic Projection',
          'Enchant Life',
          'Enchant Weapon',
          'Encrypt Thoughts',
          'Energy Shield',
          'Enhance Weapon',
          'Fall Upon Thy Knees',
          'Faux Curse',
          'Feng Shui',
          'Filter All-Space',
          'Find Reality Flaws',
          'Flames of Purification',
          'Fly',
          'Fount of Paradise',
          'Fragments of Dream',
          'Friction Curse',
          'Games of Luck',
          'Got a Hunch',
          'Gremlins',
          'Guilty Whispers',
          'Head of a Pin',
          'Heal Self',
          'Heal Wounds',
          "Heart's Blood",
          'Hello, my name is...',
          'Hermes Portal',
          'Historic Editing',
          'Holy Stroke',
          'Hungarian Phrase Book',
          'Hurl Elemental Attacks',
          'Imbue the Living Vessel',
          'Improve Senses',
          'Inferno',
          'Influence Emotions',
          'Information Glut',
          'Instant Karma',
          'Iron Avatar',
          'Knock Out',
          'Know the Lepers Mind',
          'Lambs to the Slaughter',
          'Landscape of the Mind',
          'Life Scan',
          'Like Clockwork',
          'Locate Disorder and Weakness',
          'Manipulate Memory',
          'Manna from Heaven',
          'Masochism Tango',
          "Master's Enchantment",
          'Matter Association',
          'Melt and Reform',
          "Midwife's Blessing",
          "Mimir's Head",
          'Mind Empowerment',
          'Mind GREP',
          'Moment of Inspiration',
          "Mr. Fusion's Clean Burning Fuel Fabrication Formula",
          'Multiple Action [Life]',
          'Multiple Action [Time]',
          'Murder of Crows',
          'Mutate Ephemera',
          'Mutate Form',
          'My God can Beat up your God',
          'Mystic Tag',
          'Nice Boots, Wanna Fuck?',
          'No-Mind',
          'Paradox Ward',
          'Paralyze Opponent [Forces]',
          'Paralyze Opponent [Life]',
          'Paralyze Opponent [Matter]',
          'Parma Magica',
          'Perfect Metamorphosis',
          'Perfect Time',
          'Physiological Emotion Control',
          'Place in the Dance',
          'Plastic Body',
          'Polyappearance',
          "Portal's Herald",
          'Possession',
          'Praise Asphalta',
          'Prayer of Healing Revelation',
          'Precipitate the Summoned Form',
          'Probe Thoughts',
          'Programmed Event',
          'Psychic Attack',
          'Psychic Impression',
          'Pyro Manos',
          'Quantify Energy',
          'Re-live Experience',
          'Red Ones Go Faster',
          'Release the Red Death',
          'Remove Divine Favor',
          'Reveal the Holy Path',
          'Ring of Truth',
          'Ringing Strike',
          'Sanctify Sacred Relic',
          'Sculpture',
          'See the Tainted Soul',
          'Semi-Auto Cad-Cam',
          'Sense Connection',
          'Sense Lies',
          'Sense the Fleeting Moment',
          'Seven-League Stride',
          'Sharing the Experience',
          'Sidestep Time',
          'Slay Machine',
          "Solomon's Binding",
          'Spatial Mutations',
          'Spirit Cloak',
          'Spirit Sight',
          "Spirit's Caress",
          'Spoliato Posterus ad Pensio Nam Nunc',
          'Stepping Sideways',
          'Storm Watch',
          'Straw into Gold',
          "Surprise, You're Dead!",
          "Taliesin's Song",
          'Telekinesis',
          'Telepathy',
          'Tempest in a Teapot',
          'Time Sense',
          'Time Travel',
          'Time Ward',
          'Time Warp',
          'Transformers',
          'Trick Shot',
          'Trippy Light Show',
          'Turn Invisible [Forces]',
          'Turn Invisible [Life]',
          'Turn Invisible [Mind]',
          'Undying Endurance',
          'Void Strike',
          'Ward',
          'Ward the Inner Sanctum',
          'Watch the Weaving',
          'Wellspring',
          'Whereami?',
          'Woad Warrior',
          'Work or Else',
        ];

        let ritualIndex = -1;
        mageRotes.some(rote => {
          const powerIndexAux = line.lastIndexOf(` ${rote}`);
          if (powerIndexAux >= 0) {
            ritualIndex = powerIndexAux;
            ritual = rote;
            return true;
          }
          return false;
        });

        if (ritual !== '') {
          const startRitual = ritualIndex + 1;
          const endRitual =
            line.indexOf(' (', ritualIndex) > ritualIndex
              ? line.indexOf(' (', ritualIndex)
              : line.length - 1;

          ritual = line.substring(startRitual, endRitual);

          let ritualLevel;

          const startLevel = line.indexOf('(Lv. ', ritualIndex) + 5;

          if (startLevel >= 4) {
            ritualLevel = parseInt(
              line.substring(startLevel, startLevel + 1),
              10,
            );

            if (!Number.isNaN(ritualLevel)) {
              const myRitual = {
                trait: ritual,
                level: ritualLevel,
                type: 'rituals',
              } as CharacterTrait;

              currRitualsList.push(myRitual);
            }
          }
        }
      }
      break;

    default:
  }

  return currRitualsList;
}
