import 'reflect-metadata';
import FakePDFParserProvider from '@modules/characters/providers/PDFParser/fakes/FakePDFParserProvider';
import ParseCharacterSheetService from '@modules/characters/services/ParseCharacterSheetService';
import Character from '@modules/characters/infra/typeorm/entities/Character';

import AppError from '@shared/errors/AppError';

describe('ParseCharacterSheet', () => {
  it('Should be able to parse a PDF file', async () => {
    const fakePDFParserProvider = new FakePDFParserProvider();
    const parseCharacterSheet = new ParseCharacterSheetService(
      fakePDFParserProvider,
    );

    const char = await parseCharacterSheet.execute({
      sheetFilename: 'filename.pdf',
    });
    expect(char).toBeInstanceOf(Character);
  });

  it('Should handle errors in PDF file', async () => {
    const fakePDFParserProvider = new FakePDFParserProvider();
    const parseCharacterSheet = new ParseCharacterSheetService(
      fakePDFParserProvider,
    );

    await expect(
      parseCharacterSheet.execute({ sheetFilename: '' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
