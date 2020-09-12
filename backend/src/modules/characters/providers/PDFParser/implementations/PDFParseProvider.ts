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
    let index = 0;
    let isTitled = true;
    let isParsed = false;
    let clan: string;
    let isMortal = false;

    rl.on('line', line => {
      index += 1;

      if (index === 3 && line.indexOf('Curitiba By Night') === -1) {
        isTitled = false;
        char.name = line.substring(0, line.length - 1);
      } else if (index === 4 && line.indexOf('Mortal') >= 0) {
        isMortal = true;
      } else if (index === 4 && isTitled) {
        char.name = line.substring(0, line.length - 1);
      } else if (line.indexOf('Experience Unspent: ') >= 0 && !experience) {
        const startXP =
          line.indexOf('Experience Unspent: ') + 'Experience Unspent: '.length;
        const endXP = line.indexOf('Date Printed: ') - 1;

        experience = parseInt(line.substring(startXP, endXP), 10);

        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(experience)) {
          char.experience = experience;
          isParsed = true;
        }
      } else if (!clan) {
        if (isMortal) {
          if (line.indexOf('Affiliation: ') >= 0) {
            const startClan =
              line.indexOf('Affiliation: ') + 'Affiliation: '.length;
            const endClan = line.indexOf('Motivation:') - 1;

            clan = line.substring(startClan, endClan);
            char.clan = clan;

            rl.close();
          }
        } else if (line.indexOf('Clan: ') >= 0) {
          const startClan = line.indexOf('Clan: ') + 'Clan: '.length;
          const endClan = line.indexOf('Generation:') - 1;

          clan = line.substring(startClan, endClan);
          char.clan = clan;

          rl.close();
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

    if (!isParsed) {
      return undefined;
    }

    return char;
  }
}

export default PDFParseProvider;
