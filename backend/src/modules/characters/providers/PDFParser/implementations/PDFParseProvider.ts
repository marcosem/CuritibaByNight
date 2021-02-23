import IPDFParserProvider from '@modules/characters/providers/PDFParser/models/IPDFParserProvider';
import Character from '@modules/characters/infra/typeorm/entities/Character';

import pdfParser from 'pdf-parse';
import { resolve } from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';
import readline from 'readline';
import { once } from 'events';
import { Readable } from 'stream';

class PDFParseProvider implements IPDFParserProvider {
  public async parse(filename: string): Promise<Character | undefined> {
    const char = new Character();

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
        }
      }

      // In case of titled have large names, the creature identification will appear at 6
      if (index === 6 && isTitled && char.creature_type === '') {
        if (line.indexOf('Vampire') >= 0) {
          char.creature_type = 'Vampire';
        }
      }

      // If at 7 no creature identification was found, the files is invalid
      if (index === 7 && char.creature_type === '') {
        rl.close();
      }

      if (!experience && line.indexOf('Experience Unspent: ') >= 0) {
        const startXP =
          line.indexOf('Experience Unspent: ') + 'Experience Unspent: '.length;
        const endXP = line.indexOf('Date Printed:') - 1;

        experience = parseInt(line.substring(startXP, endXP), 10);

        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(experience)) {
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

        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(experienceTotal)) {
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
              rl.close();
            }
            break;
          case 'Mage':
            if (line.indexOf('Rank: ') >= 0) {
              const startTitle = line.indexOf('Rank: ') + 'Rank: '.length;
              const endTitle = line.length - 1;

              title = line.substring(startTitle, endTitle);

              char.title = title;

              // For Mages, it finishes here
              rl.close();
            }
            break;
          default:
        }
      }

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
              rl.close();
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
        }
      }

      if (char.creature_type === 'Mortal') {
        if (retainerLevel === 0) {
          if (line.indexOf('Retainer Level ') >= 0) {
            const startRet =
              line.indexOf('Retainer Level ') + 'Retainer Level '.length;
            const endRet = line.length - 1;

            retainerLevel = parseInt(line.substring(startRet, endRet), 10);

            // eslint-disable-next-line no-restricted-globals
            if (!isNaN(retainerLevel)) {
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

            // eslint-disable-next-line no-restricted-globals
            if (!isNaN(retainerLevel)) {
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

            // eslint-disable-next-line no-restricted-globals
            if (!isNaN(retainerLevel)) {
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
    }

    if (!isParsedXP || !isParsedXPTotal || !isParsedRetainerLevel) {
      return undefined;
    }

    return char;
  }
}

export default PDFParseProvider;
