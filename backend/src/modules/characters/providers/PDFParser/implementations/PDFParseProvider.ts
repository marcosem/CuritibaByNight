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

    // let playerName: string;
    let experience: number;
    let experienceTotal: number;
    let index = 0;
    let isTitled = true;
    let clan: string;
    let isMortal = false;
    let title: string;
    let coterie = '';
    let retainerLevel = 0;

    let isParsedXP = false;
    let isParsedXPTotal = false;
    let isParsedRetainerLevel = true;

    rl.on('line', line => {
      index += 1;

      if (index === 3 && line.indexOf('Curitiba By Night') === -1) {
        isTitled = false;
        char.name = line.substring(0, line.length - 1);
      }

      if (index === 4 && line.indexOf('Mortal') >= 0) {
        isMortal = true;
        coterie = '';
      } else if (index === 4 && isTitled) {
        char.name = line.substring(0, line.length - 1);
      }

      if (line.indexOf('Experience Unspent: ') >= 0 && !experience) {
        const startXP =
          line.indexOf('Experience Unspent: ') + 'Experience Unspent: '.length;
        const endXP = line.indexOf('Date Printed: ') - 1;

        experience = parseInt(line.substring(startXP, endXP), 10);

        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(experience)) {
          char.experience = experience;
          isParsedXP = true;
        }
      }

      if (line.indexOf('Total Experience Earned: ') >= 0 && !experienceTotal) {
        const startXPTotal =
          line.indexOf('Total Experience Earned: ') +
          'Total Experience Earned: '.length;
        const endXPTotal = line.indexOf('Last Modified: ') - 1;

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

      if (line.indexOf('Title: ') >= 0 && !title) {
        const startTitle = line.indexOf('Title: ') + 'Title: '.length;
        const endString = isMortal ? 'Nature: ' : 'Demeanor: ';
        const endTitle = line.indexOf(endString) - 1;

        title = line.substring(startTitle, endTitle);
        char.title = title;

        if (isMortal) rl.close();
      }

      if (line.indexOf('Coterie/Pack: ') >= 0 && coterie === '') {
        const startCoterie =
          line.indexOf('Coterie/Pack: ') + 'Coterie/Pack: '.length;
        const endCoterie = line.indexOf('Sire: ') - 1;

        coterie = line.substring(startCoterie, endCoterie);
        char.coterie = coterie;

        rl.close();
      }

      if (!clan) {
        if (isMortal) {
          if (line.indexOf('Affiliation: ') >= 0) {
            const startClan =
              line.indexOf('Affiliation: ') + 'Affiliation: '.length;
            const endClan = line.indexOf('Motivation:') - 1;

            clan = line.substring(startClan, endClan);
            char.clan = clan;
          }
        } else if (line.indexOf('Clan: ') >= 0) {
          const startClan = line.indexOf('Clan: ') + 'Clan: '.length;
          const endClan = line.indexOf('Generation:') - 1;

          clan = line.substring(startClan, endClan);
          char.clan = clan;
        }
      }

      if (retainerLevel === 0 && isMortal) {
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
        } else if (line.indexOf('Powerful Ghoul Level ') >= 0) {
          const startRet =
            line.indexOf('Powerful Ghoul Level ') +
            'Powerful Ghoul Level '.length;
          const endRet = line.length - 1;

          retainerLevel = parseInt(line.substring(startRet, endRet), 10);

          // eslint-disable-next-line no-restricted-globals
          if (!isNaN(retainerLevel)) {
            char.retainer_level = retainerLevel * 10;
          } else {
            isParsedRetainerLevel = false;
          }
        }
      }
    });

    await once(rl, 'close');

    if (isMortal) {
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
