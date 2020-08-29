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
      resolve(uploadConfig('sheet').uploadsFolder, filename),
    );

    const { text } = await pdfParser(pdfBuffer);

    const rl = readline.createInterface({
      input: Readable.from(text),
      crlfDelay: Infinity,
    });

    char.file = filename;

    let playerName: string;
    let index = 0;
    let isTitled = true;

    rl.on('line', line => {
      index += 1;
      if (index === 3 && line.indexOf('Curitiba By Night') === -1) {
        isTitled = false;
        char.name = line.substring(0, line.length - 1);
      } else if (index === 4 && isTitled) {
        char.name = line.substring(0, line.length - 1);
      } else if (line.indexOf('Player: ') >= 0 && !playerName) {
        const startPlayer = line.indexOf('Player: ') + 'Player: '.length;
        const endPlayer = line.indexOf('Experience Unspent: ') - 1;
        const startXP =
          line.indexOf('Experience Unspent: ') + 'Experience Unspent: '.length;
        const endXP = line.indexOf('Date Printed: ') - 1;
        playerName = line.substring(startPlayer, endPlayer);

        char.experience = parseInt(line.substring(startXP, endXP), 10);
        char.user_id = playerName;

        rl.close();
      }
    });

    await once(rl, 'close');

    if (!char.user_id) {
      return undefined;
    }

    return char;
  }
}

export default PDFParseProvider;
