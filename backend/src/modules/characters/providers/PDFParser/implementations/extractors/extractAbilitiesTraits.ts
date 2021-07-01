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

    if (level <= 0) {
      return undefined;
    }

    switch (creatureType) {
      case 'Vampire':
        {
          let endAbility: number;

          if (level > 1) {
            endAbility = line.indexOf(' x');
          } else {
            let disciplineTag = '';

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
              'Dark Thaumaturgy',
              'Thaumaturgy',
              'Valeren',
              'Vicissitude',
              'Visceratika',
              'Akhu',
              'Dur-An-Ki',
              'Koldunic Sorcery',
              'Necromancy',
              'Sadhana',
              'Voudoun Necromancy',
              'Wanga',
              'Assamite',
              'Baali',
              'Brujah',
              'Cappadocian',
              'Daughters of Cacophony',
              // 'Followers of Set',
              // 'Gangrel',
              'Giovanni',
              'Lasombra',
              // 'Malkavian',
              'Nosferatu',
              // 'Ravnos',
              'Salubri',
              'Toreador',
              'Tremere',
              'Tzimisce',
              // 'Ventrue',
              'Abombwe',
              'Bardo',
              'Combination',
              'Daimoinon',
              'Deimos',
              'Einherjar',
              'Gargoyle Powers',
              'Mortis',
              'Mytherceria',
              'Obeah',
              'Ogham',
              'Sanguinus',
              'Spiritus',
            ];

            if (
              line.lastIndexOf(' Ventrue: ') >= 0 &&
              line.lastIndexOf(' Ventrue: ') !==
                line.indexOf(' Ventrue: Blood Scent')
            ) {
              disciplineTag = ' Ventrue: ';
            } else if (
              line.lastIndexOf(' Followers of Set: ') >= 0 &&
              line.lastIndexOf(' Followers of Set: ') !==
                line.indexOf(' Followers of Set: Mummification')
            ) {
              disciplineTag = ' Followers of Set: ';
            } else if (
              line.lastIndexOf(' Malkavian: ') >= 0 &&
              line.lastIndexOf(' Malkavian: ') !==
                line.indexOf(' Malkavian: Malkavian Time')
            ) {
              disciplineTag = ' Malkavian: ';
            } else if (
              line.lastIndexOf(' Gangrel: ') >= 0 &&
              line.lastIndexOf(' Gangrel: ') !==
                line.indexOf(' Gangrel: Divine') &&
              line.lastIndexOf(' Gangrel: ') !==
                line.indexOf(' Gangrel: Rending') &&
              line.lastIndexOf(' Gangrel: ') !==
                line.indexOf(' Gangrel: Rune-Lore') &&
              line.lastIndexOf(' Gangrel: ') !==
                line.indexOf(' Gangrel: Sagaman')
            ) {
              disciplineTag = ' Gangrel: ';
            } else if (
              line.lastIndexOf(' Ravnos: ') >= 0 &&
              line.lastIndexOf(' Ravnos: ') !==
                line.indexOf(' Ravnos: Diversion') &&
              line.lastIndexOf(' Ravnos: ') !==
                line.indexOf(' Ravnos: Escapology') &&
              line.lastIndexOf(' Ravnos: ') !==
                line.indexOf(' Ravnos: Sleight of Hand')
            ) {
              disciplineTag = ' Ravnos: ';
            } else {
              vampireDisciplines.some(discipline => {
                if (line.lastIndexOf(` ${discipline}: `) >= 0) {
                  disciplineTag = ` ${discipline}: `;
                  return true;
                }
                return false;
              });
            }

            if (disciplineTag === '') {
              endAbility = line.length - 2;
            } else {
              endAbility = line.lastIndexOf(disciplineTag);
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
            let numinaTag = '';

            const mortalNuminas = [
              'Arts',
              'Benandanti Rituals',
              'Bioenhancements',
              'Disciplines',
              'Fomori Powers',
              'Gifts',
              'Martial Arts',
              'Psychic',
              'Realms',
              'Sorcery',
              'Shintai',
              'Sorcery [Unrevised]',
              'Theurgy',
              'Theurgy [Unrevised]',
            ];

            mortalNuminas.some(numina => {
              if (line.indexOf(` ${numina}: `) >= 0) {
                numinaTag = ` ${numina}: `;
                return true;
              }
              return false;
            });

            if (numinaTag === '') {
              endAbility = line.length - 2;
            } else {
              endAbility = line.indexOf(numinaTag);
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

      case 'Wraith':
        {
          let endAbility: number;

          if (level > 1) {
            endAbility = line.indexOf(' x');
          } else {
            let arcanoiTag = '';

            const wraithArcanois = [
              'Argos',
              'Behest',
              'Castigate',
              'Chains of the Emperor',
              'Displace',
              'Embody',
              'Fascinate',
              'Fatalism',
              'Flux',
              'Inhabit',
              'Intimation',
              'Keening',
              'Kinesis',
              'Lifeweb',
              'Mnemosynis',
              'Moliate',
              'Outrage',
              'Pandemonium',
              'Phantasm',
              'Puppetry',
              'Usury',
              'Way of the Artisan',
              'Way of the Farmer',
              'Way of the Merchant',
              'Way of the Scholar',
              'Way of the Soul',
            ];

            wraithArcanois.some(arcanoi => {
              if (line.indexOf(` ${arcanoi}: `) >= 0) {
                arcanoiTag = ` ${arcanoi}: `;
                return true;
              }
              return false;
            });

            if (arcanoiTag === '') {
              endAbility = line.length - 2;
            } else {
              endAbility = line.indexOf(arcanoiTag);
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

      case 'Mage':
        {
          let endAbility: number;

          if (level > 1) {
            endAbility = line.indexOf(' x');
          } else {
            let rotesTag = '';

            if (line.indexOf('(Lv') >= 0) {
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

              mageRotes.some(rote => {
                if (line.indexOf(` ${rote} (Lv.`) >= 0) {
                  rotesTag = ` ${rote} (Lv.`;
                  return true;
                }
                return false;
              });
            }

            if (rotesTag === '') {
              endAbility = line.length - 2;
            } else {
              endAbility = line.indexOf(rotesTag);
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

      case 'Werewolf':
        {
          let endAbility: number;

          if (level > 1) {
            endAbility = line.indexOf(' x');
          } else {
            let giftsTag = '';

            if (line.indexOf('  ') >= 0) {
              giftsTag = '  ';
            } else {
              const werewolfGifts = [
                'Homid',
                'Metis',
                'Lupus',
                'Ragabash',
                'Theurge',
                'Philodox',
                'Galliard',
                'Ahroun',
                'Black Furies',
                'Black Spiral Dancers',
                'Bone Gnawer',
                'Children of Gaia',
                'Fianna',
                'Get of Fenris',
                'Glass Walkers',
                'Red Talons',
                'Shadow Lords',
                'Silent Striders',
                'Silver Fangs',
                'Stargazers',
                'Uktena',
                'Wendigo',
                'Boli Zouhisze',
                'Bunyip',
                'Hakken',
                'Hengeyokai',
                'Iron Riders',
                'Tetrasomians',
                'Warders of Man',
              ];

              werewolfGifts.some(gift => {
                if (line.indexOf(` ${gift}: `) >= 0) {
                  giftsTag = ` ${gift}: `;
                  return true;
                }
                return false;
              });
            }

            if (giftsTag === '') {
              endAbility = line.length - 2;
            } else {
              endAbility = line.indexOf(giftsTag);
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
