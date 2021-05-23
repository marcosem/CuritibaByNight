import IPDFParserProvider, {
  IPDFParseDTO,
} from '@modules/characters/providers/PDFParser/models/IPDFParserProvider';
import Character from '@modules/characters/infra/typeorm/entities/Character';
import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

import pdfParser from 'pdf-parse';
import { resolve } from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';
import readline from 'readline';
import { once } from 'events';
import { Readable } from 'stream';
import extractCreatureTraits from './extractors/extractCreatureTraits';
import extractVirtuesTraits from './extractors/extractVirtuesTraits';
import extractAbilitiesTraits from './extractors/extractAbilitiesTraits';
import extractPowersTraits from './extractors/extractPowersTraits';
import extractRitualsTraits from './extractors/extractRitualsTraits';
import extractBackgroundsTraits from './extractors/extractBackgroundsTraits';
import extractInfluencesTraits from './extractors/extractInfluencesTraits';
import extractMeritsTraits from './extractors/extractMeritsTraits';
import extractFlawsTraits from './extractors/extractFlawsTraits';

class PDFParseProvider implements IPDFParserProvider {
  public async parse(
    filename: string,
    masqueradeLevel = 0,
  ): Promise<IPDFParseDTO | undefined> {
    const char = new Character();
    let charTraits = [] as CharacterTrait[];
    let powerTraits = [] as CharacterTrait[];

    const pdfBuffer = await fs.promises.readFile(
      resolve(uploadConfig('sheet').tmpFolder, filename),
    );

    const { text } = await pdfParser(pdfBuffer);

    const rl = readline.createInterface({
      input: Readable.from(text),
      crlfDelay: Infinity,
    });

    char.file = filename;

    let experience: number;
    let experienceTotal: number;
    let index = 0;
    let isTitled = true;
    let clan: string;
    let sect: string;

    let title: string;
    let coterie: string;
    let wraithFactionSet = false;
    let retainerLevel = 0;

    let isParsedXP = false;
    let isParsedXPTotal = false;
    let isParsedRetainerLevel = true;

    // Traits
    let virtuesSectionDone = false;
    let morality: string;
    let attributesSectionDone = false;
    let abilitiesSectionStart = false;
    let abilitiesSectionDone = false;
    let statusAndRitualsSectionStart = false;
    let statusAndRitualsSectionDone = false;
    let backgroundsSectionStart = false;
    let backgroundsSectionDone = false;
    let influencesSectionStart = false;
    let influencesSectionDone = false;
    let meritsAndFlawsSectionDone = false;
    let meritsAndFlawsSectionStart = false;
    let extraHealthy = 0;
    let extraBruised = 0;
    let penaltyHealth = 0;
    const penaltyInfluences = Math.floor(masqueradeLevel / 2);
    const penaltyBackgrounds = Math.floor(masqueradeLevel / 3);

    const penaltyBlood = {
      level_penalty: masqueradeLevel,
      level_temp: '',
    };

    for (let i = 0; i < penaltyBlood.level_penalty; i += 1) {
      penaltyBlood.level_temp =
        i === 0 ? 'Masquerade' : `${penaltyBlood.level_temp}|Masquerade`;
    }

    rl.on('line', line => {
      index += 1;

      // Name start at 3, except for titled sheets
      if (index === 3 && line.indexOf('Curitiba By Night') === -1) {
        isTitled = false;
        char.name = line.substring(0, line.length - 1);
      }

      // Non titled sheet have creature identification at 4
      if (index === 4) {
        if (isTitled) {
          char.name = line.substring(0, line.length - 1);
        } else if (line.indexOf('Mortal') >= 0) {
          char.creature_type = 'Mortal';
        } else if (line.indexOf('Wraith') >= 0) {
          char.creature_type = 'Wraith';
        } else if (line.indexOf('Werewolf') >= 0) {
          char.creature_type = 'Werewolf';
        } else if (line.indexOf('Mage') >= 0) {
          char.creature_type = 'Mage';
        } else if (line.indexOf('Vampire') >= 0) {
          char.creature_type = 'Vampire';
        } else {
          // large names takes two rows
          char.name = `${char.name} ${line.substring(0, line.length - 1)}`;
        }
      }

      // Creature identification start at 5 for titled
      if (index === 5) {
        if (isTitled) {
          if (line.indexOf('Vampire') >= 0) {
            char.creature_type = 'Vampire';
          } else {
            // large names takes two rows
            char.name = `${char.name} ${line.substring(0, line.length - 1)}`;
          }
        } else if (line.indexOf('Mortal') >= 0) {
          char.creature_type = 'Mortal';
        } else if (line.indexOf('Wraith') >= 0) {
          char.creature_type = 'Wraith';
        } else if (line.indexOf('Werewolf') >= 0) {
          char.creature_type = 'Werewolf';
        } else if (line.indexOf('Mage') >= 0) {
          char.creature_type = 'Mage';
        } else if (line.indexOf('Vampire') >= 0) {
          char.creature_type = 'Vampire';
        }
      }

      // In case of titled have large names, the creature identification will appear at 6
      if (index === 6 && isTitled && !char.creature_type) {
        if (line.indexOf('Vampire') >= 0) {
          char.creature_type = 'Vampire';
        }
      }

      // If at 7 no creature identification was found, the files is invalid
      if (index === 7 && !char.creature_type) {
        rl.close();
      }

      if (!experience && line.indexOf('Experience Unspent: ') >= 0) {
        const startXP =
          line.indexOf('Experience Unspent: ') + 'Experience Unspent: '.length;
        const endXP = line.indexOf('Date Printed:') - 1;

        experience = parseInt(line.substring(startXP, endXP), 10);

        if (!Number.isNaN(experience)) {
          char.experience = experience;
          isParsedXP = true;
        }
      }

      if (!experienceTotal && line.indexOf('Total Experience Earned: ') >= 0) {
        const startXPTotal =
          line.indexOf('Total Experience Earned: ') +
          'Total Experience Earned: '.length;
        const endXPTotal = line.indexOf('Last Modified:') - 1;

        experienceTotal = parseInt(
          line.substring(startXPTotal, endXPTotal),
          10,
        );

        if (!Number.isNaN(experienceTotal)) {
          char.experience_total = experienceTotal;
          isParsedXPTotal = true;
        }
      }

      // Creature family
      if (!clan) {
        switch (char.creature_type) {
          case 'Mortal':
            if (line.indexOf('Affiliation: ') >= 0) {
              const startClan =
                line.indexOf('Affiliation: ') + 'Affiliation: '.length;
              const endClan = line.indexOf('Motivation:') - 1;

              clan = line.substring(startClan, endClan);
              char.clan = clan;
            }
            break;
          case 'Vampire':
            if (line.indexOf('Clan: ') >= 0) {
              const startClan = line.indexOf('Clan: ') + 'Clan: '.length;
              const endClan = line.indexOf('Generation:') - 1;

              clan = line.substring(startClan, endClan);
              char.clan = clan;

              // Clan Ventrue loses one blood point
              if (clan === 'Ventrue') {
                if (penaltyBlood.level_penalty === 0) {
                  penaltyBlood.level_temp = 'Clan';
                } else {
                  penaltyBlood.level_temp = `${penaltyBlood.level_temp}|Clan`;
                }
                penaltyBlood.level_penalty += 1;
              }
            }
            break;
          case 'Wraith':
            if (line.indexOf('Guild: ') >= 0) {
              const startClan = line.indexOf('Guild: ') + 'Guild: '.length;
              const endClan = line.indexOf('Legion:') - 1;

              clan = line.substring(startClan, endClan);
              char.clan = clan;
            }
            break;
          case 'Werewolf':
            if (line.indexOf('Tribe: ') >= 0) {
              const startClan = line.indexOf('Tribe: ') + 'Tribe: '.length;
              const endClan = line.indexOf('Rank:') - 1;

              clan = line.substring(startClan, endClan);
              char.clan = clan;

              // Get of Fenris has one extra Healthy
              if (clan === 'Get of Fenris') {
                extraHealthy += 1;
              }
            }
            break;
          case 'Mage':
            if (line.indexOf('Tradition: ') >= 0) {
              const startClan =
                line.indexOf('Tradition: ') + 'Tradition: '.length;
              const endClan = line.indexOf('Essence:') - 1;

              clan = line.substring(startClan, endClan);
              char.clan = clan;
            }
            break;
          default:
        }
      }

      // Creature Sect
      if (!sect) {
        switch (char.creature_type) {
          case 'Vampire':
            if (line.indexOf('Sect: ') >= 0) {
              const startSect = line.indexOf('Sect: ') + 'Sect: '.length;
              const endSect = line.indexOf('Title:') - 1;

              sect = line.substring(startSect, endSect);
              char.sect = sect;
            }
            break;
          case 'Wraith':
            if (line.indexOf('Faction: ') >= 0 && !wraithFactionSet) {
              const startSect = line.indexOf('Faction: ') + 'Faction: '.length;
              const endSect = line.indexOf('Rank:') - 1;

              sect = line.substring(startSect, endSect);
              char.sect = sect;
              wraithFactionSet = true;
            }
            break;
          case 'Werewolf':
            if (char.clan) {
              switch (char.clan) {
                case 'Black Spiral Dancers':
                  sect = 'Wyrm';
                  break;
                case 'Glass Walkers':
                  sect = 'Weaver';
                  break;
                default:
                  sect = 'Wyld';
              }

              char.sect = sect;
            }
            break;
          case 'Mage':
            if (line.indexOf('Faction: ') >= 0) {
              const startSect = line.indexOf('Faction: ') + 'Faction: '.length;
              const endSect = line.indexOf('Cabal:') - 1;

              sect = line.substring(startSect, endSect);
              char.sect = sect;
            }
            break;
          case 'Mortal':
          default:
        }
      }

      // Title
      if (!title) {
        switch (char.creature_type) {
          case 'Mortal':
            if (line.indexOf('Title: ') >= 0) {
              const startTitle = line.indexOf('Title: ') + 'Title: '.length;
              const endString = 'Nature:';
              const endTitle = line.indexOf(endString) - 1;

              title = line.substring(startTitle, endTitle);

              char.title = title;
            }
            break;
          case 'Vampire':
            if (line.indexOf('Title: ') >= 0) {
              const startTitle = line.indexOf('Title: ') + 'Title: '.length;
              const endString = 'Demeanor:';
              const endTitle = line.indexOf(endString) - 1;

              title = line.substring(startTitle, endTitle);

              char.title = title;
            }
            break;
          case 'Wraith':
            if (line.indexOf('Rank: ') >= 0) {
              const startTitle = line.indexOf('Rank: ') + 'Rank: '.length;
              const endString = 'Demeanor:';
              const endTitle = line.indexOf(endString) - 1;

              title = line.substring(startTitle, endTitle);

              char.title = title;
            }
            break;
          case 'Werewolf':
            if (line.indexOf('Position: ') >= 0) {
              const startTitle =
                line.indexOf('Position: ') + 'Position: '.length;
              const endTitle = line.length - 1;

              title = line.substring(startTitle, endTitle);

              char.title = title;

              // For Werewolf, it finishes here
              // rl.close();
            }
            break;
          case 'Mage':
            if (line.indexOf('Rank: ') >= 0) {
              const startTitle = line.indexOf('Rank: ') + 'Rank: '.length;
              const endTitle = line.length - 1;

              title = line.substring(startTitle, endTitle);

              char.title = title;

              // For Mages, it finishes here
              // rl.close();
            }
            break;
          default:
        }
      }

      // Coterie / Pack
      if (!coterie) {
        switch (char.creature_type) {
          case 'Vampire':
            if (line.indexOf('Coterie/Pack: ') >= 0) {
              const startCoterie =
                line.indexOf('Coterie/Pack: ') + 'Coterie/Pack: '.length;
              const endCoterie = line.indexOf('Sire:') - 1;

              coterie = line.substring(startCoterie, endCoterie);
              char.coterie = coterie;

              // For Vampire, it finishes here
              // rl.close();
            }
            break;

          case 'Werewolf':
            if (line.indexOf('Pack: ') >= 0) {
              const startCoterie = line.indexOf('Pack: ') + 'Pack: '.length;
              const endCoterie = line.indexOf('Demeanor:') - 1;

              coterie = line.substring(startCoterie, endCoterie);
              char.coterie = coterie;
            }
            break;
          case 'Mage':
            if (line.indexOf('Cabal: ') >= 0) {
              const startCoterie = line.indexOf('Cabal: ') + 'Cabal: '.length;
              const endCoterie = line.indexOf('Demeanor:') - 1;

              coterie = line.substring(startCoterie, endCoterie);
              char.coterie = coterie;
            }
            break;
          case 'Mortal':
          case 'Wraith':
          default:
            if (!char.coterie) {
              char.coterie = '';
            }
        }
      }

      // Virtues and Creature Traits
      if (char.creature_type && !virtuesSectionDone) {
        const creatureTraits = extractCreatureTraits(line, char.creature_type);
        if (creatureTraits.length > 0) {
          charTraits = charTraits.concat(creatureTraits);
        }

        const virtuesTraits = extractVirtuesTraits(line, char.creature_type);
        if (virtuesTraits.length > 0) {
          charTraits = charTraits.concat(virtuesTraits);
        }

        switch (char.creature_type) {
          case 'Vampire':
            if (line.indexOf('Morality Path: ') >= 0) {
              const startMorality =
                line.indexOf('Morality Path: ') + 'Morality Path: '.length;
              const endMorality = line.indexOf('Aura:') - 1;
              morality = line.substring(startMorality, endMorality);
            }

            if (morality && line.indexOf('Morality Traits: ') >= 0) {
              const startMorality =
                line.indexOf('Morality Traits: ') + 'Morality Traits: '.length;
              const endMorality = line.indexOf('O', startMorality) - 1;
              const moralityTrait = parseInt(
                line.substring(startMorality, endMorality),
                10,
              );

              if (!Number.isNaN(moralityTrait)) {
                const trait = {
                  trait: `Morality: ${morality}`,
                  level: moralityTrait,
                  type: 'virtues',
                } as CharacterTrait;

                charTraits.push(trait);
              }
            }

            if (line.indexOf('Courage: ') >= 0) {
              virtuesSectionDone = true;
            }
            break;

          case 'Mortal':
            if (line.indexOf('Courage: ') >= 0) {
              virtuesSectionDone = true;
            }
            break;

          case 'Wraith':
            if (line.indexOf('Corpus: ') >= 0) {
              virtuesSectionDone = true;
            }
            break;

          case 'Mage':
            if (line.indexOf('Paradox: ') >= 0) {
              // Mage has Blood pool fixed in 10
              const trait = {
                trait: 'Blood',
                level: 10,
                type: 'creature',
              } as CharacterTrait;

              charTraits.push(trait);

              virtuesSectionDone = true;
            }
            break;

          case 'Werewolf':
            if (line.indexOf('Glory: ') >= 0) {
              // Werewolf has Blood pool fixed in 12
              const trait = {
                trait: 'Blood',
                level: 12,
                type: 'creature',
              } as CharacterTrait;

              charTraits.push(trait);

              virtuesSectionDone = true;
            }
            break;

          default:
            virtuesSectionDone = true;
        }
      }

      // Attributes
      if (virtuesSectionDone && !attributesSectionDone) {
        if (line.indexOf('Physical Traits:') >= 0) {
          const startAttribute = line.indexOf('Physical Traits:') - 4;
          const endAttribute = line.indexOf('Physical Traits:') - 1;
          const attribute = parseInt(
            line.substring(startAttribute, endAttribute),
            10,
          );

          if (!Number.isNaN(attribute)) {
            const trait = {
              trait: 'Physical',
              level: attribute,
              type: 'attributes',
            } as CharacterTrait;

            charTraits.push(trait);
          }
        }

        if (line.indexOf('Social Traits:') >= 0) {
          const startAttribute = line.indexOf('Social Traits:') - 4;
          const endAttribute = line.indexOf('Social Traits:') - 1;
          const attribute = parseInt(
            line.substring(startAttribute, endAttribute),
            10,
          );

          if (!Number.isNaN(attribute)) {
            const trait = {
              trait: 'Social',
              level: attribute,
              type: 'attributes',
            } as CharacterTrait;

            charTraits.push(trait);
          }
        }

        if (line.indexOf('Mental Traits:') >= 0) {
          const startAttribute = line.indexOf('Mental Traits:') - 4;
          const endAttribute = line.indexOf('Mental Traits:') - 1;
          const attribute = parseInt(
            line.substring(startAttribute, endAttribute),
            10,
          );

          if (!Number.isNaN(attribute)) {
            const trait = {
              trait: 'Mental',
              level: attribute,
              type: 'attributes',
            } as CharacterTrait;

            charTraits.push(trait);
          }
          attributesSectionDone = true;
        }
      }

      // Abilities, Powers, and Rotes
      if (attributesSectionDone && !abilitiesSectionDone) {
        if (line.indexOf('Abilities:') >= 0) {
          abilitiesSectionStart = true;
        }

        if (abilitiesSectionStart) {
          const ability = extractAbilitiesTraits(line, char.creature_type);

          if (ability) {
            charTraits.push(ability);
          }

          switch (char.creature_type) {
            case 'Vampire':
              powerTraits = extractPowersTraits(
                line,
                char.creature_type,
                powerTraits,
              );

              if (line.indexOf('Fortitude: Mettle') >= 0) {
                extraHealthy += 1;
              }

              if (line.indexOf('Status:') >= 0) {
                abilitiesSectionDone = true;
              }
              break;

            case 'Mortal':
              powerTraits = extractPowersTraits(
                line,
                char.creature_type,
                powerTraits,
              );

              if (line.indexOf('Disciplines: Fortitude: Mettle') >= 0) {
                extraHealthy += 1;
              }

              if (line.indexOf('Humanity:') >= 0) {
                abilitiesSectionDone = true;
              }
              break;

            case 'Wraith':
              powerTraits = extractPowersTraits(
                line,
                char.creature_type,
                powerTraits,
              );

              if (line.indexOf('Merits:') >= 0) {
                abilitiesSectionDone = true;
              }
              break;

            case 'Mage':
              powerTraits = extractRitualsTraits(
                line,
                char.creature_type,
                powerTraits,
              );

              if (line.indexOf('Reputation:') >= 0) {
                abilitiesSectionDone = true;
              }
              break;

            case 'Werewolf':
              powerTraits = extractPowersTraits(
                line,
                char.creature_type,
                powerTraits,
              );

              if (line.indexOf('Backgrounds:') >= 0) {
                abilitiesSectionDone = true;
              }
              break;

            default:
              abilitiesSectionDone = true;
          }
        }
      }

      // Status and Rituals - Vampire only
      if (
        char.creature_type === 'Vampire' &&
        attributesSectionDone &&
        !statusAndRitualsSectionDone
      ) {
        if (line.indexOf('Status:') >= 0) {
          statusAndRitualsSectionStart = true;
        }

        if (statusAndRitualsSectionStart) {
          powerTraits = extractRitualsTraits(
            line,
            char.creature_type,
            powerTraits,
          );

          if (line.indexOf('Backgrounds:') >= 0) {
            statusAndRitualsSectionDone = true;
          }
        }
      }

      // Backgrounds and Spheres (Mages)
      if (attributesSectionDone && !backgroundsSectionDone) {
        if (line.indexOf('Backgrounds:') >= 0) {
          backgroundsSectionStart = true;
        }

        if (backgroundsSectionStart) {
          const background = extractBackgroundsTraits(line, char.creature_type);

          if (background) {
            if (penaltyBackgrounds > 0) {
              let myPenalty =
                background.level < penaltyBackgrounds
                  ? background.level
                  : penaltyBackgrounds;

              let backgroundCount = 0;
              let level_temp = '';
              let level_name = '';

              while (backgroundCount < background.level) {
                if (myPenalty > 0) {
                  level_name = 'Masquerade';
                  myPenalty -= 1;
                } else {
                  level_name = 'full';
                }

                if (backgroundCount === 0) {
                  level_temp = level_name;
                } else {
                  level_temp = `${level_temp}|${level_name}`;
                }
                backgroundCount += 1;
              }

              const tempArray = level_temp.split('|').reverse();
              level_temp = tempArray.join('|');

              background.level_temp = level_temp;
            }

            charTraits.push(background);

            // Retainers loses one blood point
            if (
              background.trait === 'Retainers' ||
              background.trait === 'Animal Retainer'
            ) {
              let level_temp = '';
              let retainerCount = 0;
              while (retainerCount < background.level) {
                if (retainerCount === 0) {
                  level_temp = 'Retainer';
                } else {
                  level_temp = `${level_temp}|Retainer`;
                }
                retainerCount += 1;
              }

              if (penaltyBlood.level_penalty === 0) {
                penaltyBlood.level_temp = level_temp;
              } else {
                penaltyBlood.level_temp = `${penaltyBlood.level_temp}|${level_temp}`;
              }
              penaltyBlood.level_penalty += background.level;
            }
          }

          switch (char.creature_type) {
            case 'Vampire':
            case 'Mortal':
              if (line.indexOf('Derangements:') >= 0) {
                backgroundsSectionDone = true;
              }
              break;
            case 'Wraith':
              if (line.indexOf('Abilities:') >= 0) {
                backgroundsSectionDone = true;
              }
              break;
            case 'Mage':
              // Extract Mage Spheres
              powerTraits = extractPowersTraits(
                line,
                char.creature_type,
                powerTraits,
              );

              if (line.indexOf('Abilities:') >= 0) {
                backgroundsSectionDone = true;
              }
              break;
            case 'Werewolf':
              // Extract Werewolf Rites
              powerTraits = extractRitualsTraits(
                line,
                char.creature_type,
                powerTraits,
              );

              if (line.indexOf('Influences:') >= 0) {
                backgroundsSectionDone = true;
              }
              break;
            default:
              backgroundsSectionDone = true;
          }
        }
      }

      // Influences
      if (attributesSectionDone && !influencesSectionDone) {
        if (line.indexOf('Influences:') >= 0) {
          influencesSectionStart = true;
        }

        if (influencesSectionStart) {
          const influence = extractInfluencesTraits(line, char.creature_type);

          if (influence) {
            if (penaltyInfluences > 0) {
              let myPenalty =
                influence.level < penaltyInfluences
                  ? influence.level
                  : penaltyInfluences;

              let influenceCount = 0;
              let level_temp = '';
              let level_name = '';

              while (influenceCount < influence.level) {
                if (myPenalty > 0) {
                  level_name = 'Masquerade';
                  myPenalty -= 1;
                } else {
                  level_name = 'full';
                }

                if (influenceCount === 0) {
                  level_temp = level_name;
                } else {
                  level_temp = `${level_temp}|${level_name}`;
                }
                influenceCount += 1;
              }

              const tempArray = level_temp.split('|').reverse();
              level_temp = tempArray.join('|');

              influence.level_temp = level_temp;
            }

            charTraits.push(influence);
          }

          switch (char.creature_type) {
            case 'Vampire':
            case 'Mortal':
              if (line.indexOf('Derangements:') >= 0) {
                influencesSectionDone = true;
              }
              break;
            case 'Wraith':
              if (line.indexOf('Abilities:') >= 0) {
                influencesSectionDone = true;
              }
              break;
            case 'Mage':
              if (line.indexOf('Foci:') >= 0) {
                influencesSectionDone = true;
                rl.close();
              }
              break;
            case 'Werewolf':
              if (line.indexOf('Merits:') >= 0) {
                influencesSectionDone = true;
                rl.close();
              }
              break;

            default:
              influencesSectionDone = true;
          }
        }
      }

      // Merits and Flaws
      if (influencesSectionDone && !meritsAndFlawsSectionDone) {
        if (line.indexOf('Merits:') >= 0 || line.indexOf('Flaws:') >= 0) {
          meritsAndFlawsSectionStart = true;
        } else if (meritsAndFlawsSectionStart) {
          if (
            line.indexOf('Equipment:') >= 0 ||
            line.indexOf('Passions:') >= 0
          ) {
            meritsAndFlawsSectionDone = true;
          } else {
            const merit = extractMeritsTraits(line, char.creature_type);
            const flaw = extractFlawsTraits(line, char.creature_type);

            if (merit) {
              charTraits.push(merit);

              if (char.creature_type !== 'Wraith') {
                if (
                  merit.trait === 'Huge Size' ||
                  merit.trait === 'Nosferatu: Tough Hide'
                ) {
                  extraBruised += 1;
                }
              }
            }

            if (flaw) {
              charTraits.push(flaw);

              if (char.creature_type !== 'Wraith') {
                if (
                  flaw.trait === 'Permanent Wound' ||
                  (flaw.trait === 'Open Wound' && flaw.level === 4)
                ) {
                  penaltyHealth += 5;
                }

                if (char.creature_type === 'Vampire') {
                  switch (flaw.trait) {
                    case 'Selective Digestion':
                    case 'Restricted Diet':
                      // Selective Digestion has one blood point penalty
                      if (penaltyBlood.level_penalty === 0) {
                        penaltyBlood.level_temp = flaw.trait;
                      } else {
                        penaltyBlood.level_temp = `${penaltyBlood.level_temp}|${flaw.trait}`;
                      }
                      penaltyBlood.level_penalty += 1;
                      break;
                    case 'Selective Thirst':
                    case 'Poor Digestion':
                      // Selective Thirst has one blood point penalty
                      if (penaltyBlood.level_penalty === 0) {
                        penaltyBlood.level_temp = `${flaw.trait}|${flaw.trait}`;
                      } else {
                        penaltyBlood.level_temp = `${penaltyBlood.level_temp}|${flaw.trait}|${flaw.trait}`;
                      }
                      penaltyBlood.level_penalty += 2;
                      break;
                    case "Methuselah's Thirst":
                      // Methuselah's Thirst has one blood point penalty
                      if (penaltyBlood.level_penalty === 0) {
                        penaltyBlood.level_temp = `${flaw.trait}|${flaw.trait}|${flaw.trait}`;
                      } else {
                        penaltyBlood.level_temp = `${penaltyBlood.level_temp}|${flaw.trait}|${flaw.trait}|${flaw.trait}`;
                      }
                      penaltyBlood.level_penalty += 3;
                      break;
                    default:
                      if (flaw.trait.indexOf('Prey Exclusion') >= 0) {
                        // Prey Exclusion has one blood point penalty
                        if (penaltyBlood.level_penalty === 0) {
                          penaltyBlood.level_temp = 'Prey Exclusion';
                        } else {
                          penaltyBlood.level_temp = `${penaltyBlood.level_temp}|Prey Exclusion`;
                        }
                        penaltyBlood.level_penalty += 1;
                      } else if (flaw.trait.indexOf('Addiction') >= 0) {
                        // Addiction has one blood point penalty
                        if (penaltyBlood.level_penalty === 0) {
                          penaltyBlood.level_temp = 'Addiction|Addiction';
                        } else {
                          penaltyBlood.level_temp = `${penaltyBlood.level_temp}|Addiction|Addiction`;
                        }
                        penaltyBlood.level_penalty += 2;
                      }
                  }
                }
              }
            }
          }
        }
      }

      if (char.creature_type === 'Mortal') {
        if (retainerLevel === 0) {
          if (line.indexOf('Retainer Level ') >= 0) {
            const startRet =
              line.indexOf('Retainer Level ') + 'Retainer Level '.length;
            const endRet = line.length - 1;

            retainerLevel = parseInt(line.substring(startRet, endRet), 10);

            if (!Number.isNaN(retainerLevel)) {
              char.retainer_level = retainerLevel;
            } else {
              isParsedRetainerLevel = false;
            }

            rl.close();
          } else if (line.indexOf('Powerful Ghoul Level ') >= 0) {
            const startRet =
              line.indexOf('Powerful Ghoul Level ') +
              'Powerful Ghoul Level '.length;
            const endRet = line.length - 1;

            retainerLevel = parseInt(line.substring(startRet, endRet), 10);

            if (!Number.isNaN(retainerLevel)) {
              char.retainer_level = retainerLevel * 10;
              char.clan = `Powerful ${char.clan}`;
            } else {
              isParsedRetainerLevel = false;
            }

            rl.close();
          }
        }
      } else if (char.creature_type === 'Wraith') {
        if (retainerLevel === 0) {
          if (line.indexOf('Spirit Slave Level ') >= 0) {
            const startRet =
              line.indexOf('Spirit Slave Level ') +
              'Spirit Slave Level '.length;
            const endRet = line.length - 1;

            retainerLevel = parseInt(line.substring(startRet, endRet), 10);

            if (!Number.isNaN(retainerLevel)) {
              char.retainer_level = retainerLevel;
            } else {
              isParsedRetainerLevel = false;
            }

            rl.close();
          }
        }
      }
    });

    await once(rl, 'close');

    if (char.creature_type !== 'Vampire') {
      const newName = char.name.split(' - ');
      if (newName.length > 1) {
        // eslint-disable-next-line prefer-destructuring
        char.name = newName[1];
      }
    } else if (penaltyBlood.level_penalty > 0) {
      const bloodTrait = charTraits.find(myTrait => myTrait.trait === 'Blood');

      if (bloodTrait) {
        if (penaltyBlood.level_penalty >= bloodTrait.level) {
          const penaltyBloodLevels = penaltyBlood.level_temp.split('|');
          const newLevelTemp = penaltyBloodLevels
            .slice(0, bloodTrait.level - 1)
            .join('|');

          penaltyBlood.level_penalty = bloodTrait.level - 1;
          penaltyBlood.level_temp = `full|${newLevelTemp}`;
        } else {
          const penaltyDiff = bloodTrait.level - penaltyBlood.level_penalty;
          let penaltyCount = 0;

          let { level_temp } = penaltyBlood;
          while (penaltyCount < penaltyDiff) {
            level_temp = `full|${level_temp}`;
            penaltyCount += 1;
          }
          penaltyBlood.level_temp = level_temp;
        }

        bloodTrait.level_temp = penaltyBlood.level_temp;

        const newCharTraits = charTraits.map(myTrait =>
          myTrait.trait === 'Blood' ? bloodTrait : myTrait,
        );

        charTraits = newCharTraits;
      }
    }

    if (char.creature_type !== 'Wraith') {
      let traitsHealth;
      if (penaltyHealth > 0) {
        let penaltyCount = penaltyHealth;

        // Healthy
        let healthLevel = 2 + extraHealthy;
        let healthCount = 0;
        let healthArray = [];
        while (healthCount < healthLevel) {
          if (penaltyCount > 0) {
            healthArray.push('lethal');
            penaltyCount -= 1;
          } else {
            healthArray.push('full');
          }
          healthCount += 1;
        }
        healthArray.reverse();

        const healthy = {
          trait: 'Healthy',
          level: healthLevel,
          level_temp: healthArray.join('|'),
          type: 'health',
        } as CharacterTrait;

        // Bruised
        healthLevel = 3 + extraBruised;
        healthCount = 0;
        healthArray = [];
        while (healthCount < healthLevel) {
          if (penaltyCount > 0) {
            healthArray.push('lethal');
            penaltyCount -= 1;
          } else {
            healthArray.push('full');
          }
          healthCount += 1;
        }
        healthArray.reverse();

        const brusied = {
          trait: 'Bruised',
          level: healthLevel,
          level_temp: healthArray.join('|'),
          type: 'health',
        } as CharacterTrait;

        // Wounded
        healthLevel = 2;
        healthCount = 0;
        healthArray = [];
        while (healthCount < healthLevel) {
          if (penaltyCount > 0) {
            healthArray.push('lethal');
            penaltyCount -= 1;
          } else {
            healthArray.push('full');
          }
          healthCount += 1;
        }
        healthArray.reverse();

        const wounded = {
          trait: 'Wounded',
          level: healthLevel,
          level_temp: healthArray.join('|'),
          type: 'health',
        } as CharacterTrait;

        traitsHealth = [
          healthy,
          brusied,
          wounded,
          {
            trait: 'Incapacited',
            level: 1,
            type: 'health',
          },
          {
            trait:
              char.creature_type === 'Vampire' ? 'Torpor' : 'Mortally Wounded',
            level: 1,
            type: 'health',
          },
        ] as CharacterTrait[];
      } else {
        traitsHealth = [
          {
            trait: 'Healthy',
            level: 2 + extraHealthy,
            type: 'health',
          },
          {
            trait: 'Bruised',
            level: 3 + extraBruised,
            type: 'health',
          },
          {
            trait: 'Wounded',
            level: 2,
            type: 'health',
          },
          {
            trait: 'Incapacited',
            level: 1,
            type: 'health',
          },
          {
            trait:
              char.creature_type === 'Vampire' ? 'Torpor' : 'Mortally Wounded',
            level: 1,
            type: 'health',
          },
        ] as CharacterTrait[];
      }

      charTraits = charTraits.concat(traitsHealth);
    }

    if (powerTraits.length > 0) {
      charTraits = charTraits.concat(powerTraits);
    }

    if (!isParsedXP || !isParsedXPTotal || !isParsedRetainerLevel) {
      return undefined;
    }

    // For Debug Purpose
    /*
    console.log(charTraits);

    let abilitiesCount = 0;
    let backgroundCount = 0;
    let influecesCount = 0;
    charTraits.forEach(trait => {
      switch (trait.type) {
        case 'abilities':
          abilitiesCount += trait.level;
          break;
        case 'backgrounds':
          backgroundCount += trait.level;
          break;
        case 'influences':
          influecesCount += trait.level;
          break;
        default:
          break;
      }
    });

    console.log(`Abilities..: ${abilitiesCount}`);
    console.log(`Backgrounds: ${backgroundCount}`);
    console.log(`Influences.: ${influecesCount}`);
    console.log(char);
    // End of Debug block
    */

    return {
      character: char,
      charTraits,
    };
  }
}

export default PDFParseProvider;
