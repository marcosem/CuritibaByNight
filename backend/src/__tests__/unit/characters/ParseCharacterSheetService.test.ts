import 'reflect-metadata';
import FakePDFParserProvider from '@modules/characters/providers/PDFParser/fakes/FakePDFParserProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import ParseCharacterSheetService from '@modules/characters/services/ParseCharacterSheetService';
import Character from '@modules/characters/infra/typeorm/entities/Character';

import AppError from '@shared/errors/AppError';

let fakeStorageProvider: FakeStorageProvider;
let fakePDFParserProvider: FakePDFParserProvider;
let parseCharacterSheet: ParseCharacterSheetService;

describe('ParseCharacterSheet', () => {
  beforeEach(() => {
    fakePDFParserProvider = new FakePDFParserProvider();
    fakeStorageProvider = new FakeStorageProvider();

    parseCharacterSheet = new ParseCharacterSheetService(
      fakePDFParserProvider,
      fakeStorageProvider,
    );
  });

  it('Should be able to parse a PDF file', async () => {
    const char = await parseCharacterSheet.execute({
      sheetFilename: 'filename.pdf',
    });
    expect(char).toBeInstanceOf(Character);
  });

  it('Should handle errors in PDF file', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      parseCharacterSheet.execute({ sheetFilename: '' }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toBeCalled();
  });
});
